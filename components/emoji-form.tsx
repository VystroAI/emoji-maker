'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';

export function EmojiForm({ onSubmit }: { onSubmit: (prompt: string) => Promise<void> }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(prompt);
      setPrompt(''); // Clear the input after successful generation
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Enter your emoji prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !prompt}
          className="relative"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            'Generate Emoji'
          )}
        </Button>
      </form>
    </Card>
  );
} 