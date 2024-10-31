'use client';

import { Card } from './ui/card';
import Image from 'next/image';
import { Download, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface EmojiGridProps {
  emojis: Array<{
    id: string;
    imageUrl: string;
    liked?: boolean;
    likes_count?: number;
  }>;
  onLike?: (id: string) => void;
  onDownload?: (imageUrl: string) => void;
  likingInProgress?: Record<string, boolean>;
}

export function EmojiGrid({ emojis, onLike, onDownload, likingInProgress = {} }: EmojiGridProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Generated Emojis</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {emojis.map((emoji) => (
          <Card key={emoji.id} className="relative group">
            <div className="w-full aspect-square p-2">
              <div className="relative w-full h-full">
                {!loadingStates[emoji.id] && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}
                <Image
                  src={emoji.imageUrl}
                  alt="Generated emoji"
                  fill
                  className={`object-contain p-2 transition-opacity duration-200 ${
                    loadingStates[emoji.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(emoji.id)}
                  unoptimized
                  sizes="(max-width: 768px) 25vw, 200px"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20"
                    onClick={() => onDownload?.(emoji.imageUrl)}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`text-white hover:text-white hover:bg-white/20 ${
                      emoji.liked ? 'text-red-500' : ''
                    }`}
                    onClick={() => onLike?.(emoji.id)}
                    disabled={likingInProgress[emoji.id]}
                  >
                    <Heart
                      className={`h-5 w-5 ${likingInProgress[emoji.id] ? 'animate-pulse' : ''}`}
                      fill={emoji.liked ? 'currentColor' : 'none'}
                    />
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-2 flex items-center justify-center gap-1 text-sm text-muted-foreground border-t">
              <Heart className="h-4 w-4" fill={emoji.liked ? 'currentColor' : 'none'} />
              <span>{emoji.likes_count || 0} likes</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 