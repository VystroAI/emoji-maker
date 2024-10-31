import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Set maxDuration to 60 seconds (Vercel hobby plan limit)
export const maxDuration = 60;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
  fetch: (url, options) => {
    return fetch(url, {
      ...options,
      signal: AbortSignal.timeout(55000), // 55 seconds timeout (leaving buffer)
    });
  },
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const output = await replicate.run(
      "fpsorg/emoji:2489b7892129c47ec8590fd3e86270b8804f2ff07faeae8c306342fad2f48df6",
      {
        input: { prompt },
        wait: { interval: 1000 }  // Poll every second for completion
      }
    );

    if (!output) {
      return NextResponse.json(
        { success: false, error: 'No output from model' },
        { status: 500 }
      );
    }

    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ 
      success: true, 
      images: [imageUrl] 
    });

  } catch (error) {
    console.error('Generate error:', error);
    
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Generation is taking longer than expected. Please try again.' 
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate emoji. Please try again.' 
      },
      { status: 500 }
    );
  }
} 