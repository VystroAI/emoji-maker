'use client';

import { EmojiForm } from '@/components/emoji-form';
import { EmojiGrid } from '@/components/emoji-grid';
import { useState, useEffect, useCallback } from 'react';
import { saveAs } from 'file-saver';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/components/ui/use-toast";
import { EmojiFilter } from '@/components/emoji-filter';

interface Emoji {
  id: string;
  imageUrl: string;
  liked?: boolean;
  created_at?: string;
  likes_count?: number;
}

export default function Home() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [filter, setFilter] = useState("latest");
  const [isLoading, setIsLoading] = useState(false);
  const { user, isSignedIn } = useUser();
  const { credits, useCredit: spendCredit } = useCredits();
  const { toast } = useToast();
  const [likingInProgress, setLikingInProgress] = useState<Record<string, boolean>>({});

  const fetchEmojis = useCallback(async () => {
    try {
      let query = supabase
        .from('emoji')
        .select('*');

      if (filter === "trending") {
        query = query.order('likes_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: emojisData, error: emojisError } = await query;

      if (emojisError) throw emojisError;

      const { data: likesData, error: likesError } = await supabase
        .from('emoji_likes')
        .select('emoji_id')
        .eq('user_id', user?.id || '');

      if (likesError) throw likesError;

      const likedEmojiIds = new Set(likesData?.map(like => like.emoji_id) || []);

      const emojisWithLikes = emojisData?.map(emoji => ({
        ...emoji,
        liked: likedEmojiIds.has(emoji.id)
      })) || [];

      setEmojis(emojisWithLikes);
    } catch (error) {
      console.error('Error fetching emojis:', error);
    }
  }, [user?.id, filter]);

  useEffect(() => {
    fetchEmojis();
  }, [user?.id, filter, fetchEmojis]);

  const handleGenerateEmoji = async (prompt: string) => {
    const hasCredits = await spendCredit();
    if (!hasCredits) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate emoji');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate emoji');
      }

      // Save the generated emoji
      const { data: savedEmoji, error: saveError } = await supabase
        .from('emoji')
        .insert([
          {
            imageUrl: data.images[0],
            user_id: user?.id,
            likes_count: 0,
          },
        ])
        .select()
        .single();

      if (saveError) throw saveError;

      toast({
        description: "Successfully generated emoji!",
      });

      // Refresh the emoji list
      fetchEmojis();
    } catch (error) {
      console.error('Error generating emoji:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : 'Failed to generate emoji',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      if (!user?.id) {
        toast({
          description: "Please sign in to like emojis",
        });
        return;
      }

      // Prevent multiple clicks while processing
      if (likingInProgress[id]) {
        return;
      }

      setLikingInProgress(prev => ({ ...prev, [id]: true }));

      const emoji = emojis.find((e) => e.id === id);
      if (!emoji) {
        toast({
          variant: "destructive",
          description: "Emoji not found",
        });
        return;
      }

      const isLiked = emoji.liked;

      if (isLiked) {
        // Unlike: Remove the like
        const { error: deleteError } = await supabase
          .from('emoji_likes')
          .delete()
          .eq('emoji_id', id)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // Only update UI after successful database operation
        setEmojis(emojis.map((e) =>
          e.id === id ? { 
            ...e, 
            liked: false,
            likes_count: (e.likes_count || 1) - 1
          } : e
        ));

        toast({
          description: "Emoji unliked",
        });
      } else {
        // Like: Add new like
        const { error: insertError } = await supabase
          .from('emoji_likes')
          .insert([
            { emoji_id: id, user_id: user.id }
          ]);

        if (insertError) throw insertError;

        // Only update UI after successful database operation
        setEmojis(emojis.map((e) =>
          e.id === id ? { 
            ...e, 
            liked: true,
            likes_count: (e.likes_count || 0) + 1
          } : e
        ));

        toast({
          description: "Emoji liked!",
        });
      }

    } catch (error) {
      console.error('Error updating like status:', error);
      // Revert to the previous state by refetching
      await fetchEmojis();
      toast({
        variant: "destructive",
        description: "Failed to update like status",
      });
    } finally {
      setLikingInProgress(prev => ({ ...prev, [id]: false }));
    }
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

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Generate custom emojis with AI</h1>
          <p className="text-muted-foreground">Enter a prompt to create your own emoji</p>
        </div>
        
        <div className="flex justify-center">
          {isSignedIn ? (
            <EmojiForm onSubmit={handleGenerateEmoji} />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Sign in to generate emojis</p>
              <SignInButton mode="modal">
                <Button>Sign In to Get Started</Button>
              </SignInButton>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                <div className="text-sm text-muted-foreground">Generating your emoji...</div>
              </div>
            </div>
          )}

          {emojis.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <EmojiFilter onFilterChange={setFilter} />
              </div>
              <EmojiGrid 
                emojis={emojis}
                onLike={handleLike}
                onDownload={handleDownload}
                likingInProgress={likingInProgress}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
