import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function useCredits() {
  const { user } = useUser();
  const [credits, setCredits] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchCredits();
    }
  }, [user?.id]);

  const fetchCredits = async () => {
    if (!user?.id) return;

    try {
      // First try to get existing credits
      let { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single();

      // If no record exists, create one
      if (!data && (!error || error.code === 'PGRST116')) {
        console.log('Creating new credits record for user:', user.id);
        const { data: newData, error: insertError } = await supabase
          .from('user_credits')
          .insert([
            { user_id: user.id, credits: 3 }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating credits:', insertError);
          throw insertError;
        }

        data = newData;
      } else if (error) {
        console.error('Error fetching credits:', error);
        throw error;
      }

      if (data) {
        console.log('Credits data:', data);
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Error in fetchCredits:', error);
      toast({
        variant: "destructive",
        title: "Error fetching credits",
        description: "Please try refreshing the page"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useCredit = async () => {
    if (!user?.id) return false;
    
    if (credits <= 0) {
      toast({
        variant: "destructive",
        title: "No credits remaining",
        description: "You have reached your limit on Generating Emojis"
      });
      return false;
    }

    try {
      const newCredits = credits - 1;
      const { error } = await supabase
        .from('user_credits')
        .update({ credits: newCredits })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating credits:', error);
        throw error;
      }

      setCredits(newCredits);
      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to use credit. Please try again."
      });
      return false;
    }
  };

  return { 
    credits, 
    isLoading, 
    useCredit,
    refetchCredits: fetchCredits // Export this to allow manual refresh
  };
} 