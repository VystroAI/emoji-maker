'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { EmojiGrid } from "@/components/emoji-grid";
import { saveAs } from 'file-saver';
import { useToast } from "@/components/ui/use-toast";

interface Emoji {
  id: string;
  imageUrl: string;
  liked?: boolean;
  created_at?: string;
  likes_count?: number;
}

export default function MyEmojis() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();
  const [likingInProgress, setLikingInProgress] = useState<Record<string, boolean>>({});

  const fetchMyEmojis = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log('Fetching emojis for user:', user.id);
      
      const { data: emojisData, error: emojisError } = await supabase
        .from('emoji')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (emojisError) {
        console.error('Error fetching emojis:', emojisError);
        throw emojisError;
      }

      const { data: likesData, error: likesError } = await supabase
        .from('emoji_likes')
        .select('emoji_id')
        .eq('user_id', user.id);

      if (likesError) {
        console.error('Error fetching likes:', likesError);
        throw likesError;
      }

      const likedEmojiIds = new Set(likesData?.map(like => like.emoji_id) || []);

      const emojisWithLikes = (emojisData || []).map(emoji => ({
        ...emoji,
        liked: likedEmojiIds.has(emoji.id)
      }));

      console.log('Fetched emojis:', emojisWithLikes);
      setEmojis(emojisWithLikes);
    } catch (error) {
      console.error('Error fetching emojis:', error);
      toast({
        variant: "destructive",
        description: "Failed to fetch your emojis"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (user?.id) {
      fetchMyEmojis();
    }
  }, [user?.id, fetchMyEmojis]);

  const handleLike = async (id: string) => {
    // ... same like handling logic as in main page
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();
      saveAs(blob, `emoji-${Date.now()}.png`);
    } catch (error) {
      console.error('Error downloading emoji:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view your emojis</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Emojis</h1>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Created</p>
            <p className="text-2xl font-bold">{emojis.length}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-32 w-32 bg-secondary rounded-lg"></div>
              <div className="text-center text-sm text-muted-foreground">Loading your emojis...</div>
            </div>
          </div>
        ) : emojis.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You haven&apos;t created any emojis yet</p>
          </div>
        ) : (
          <EmojiGrid 
            emojis={emojis}
            onLike={handleLike}
            onDownload={handleDownload}
            likingInProgress={likingInProgress}
          />
        )}
      </div>
    </div>
  );
} 