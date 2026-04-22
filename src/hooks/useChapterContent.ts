import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface DriveLink {
  id: string;
  title: string;
  url: string;
}

export interface ChapterContent {
  id: string;
  chapter_id: string;
  video_enabled: boolean;
  youtube_url: string | null;
  drive_video_url: string | null;
  audio_enabled: boolean;
  audio_url: string | null;
  audio_downloadable: boolean;
  pdf_enabled: boolean;
  pdf_url: string | null;
  pdf_external_link: string | null;
  pdf_downloadable: boolean;
  drive_links_enabled: boolean;
  drive_links: DriveLink[];
  mind_map_enabled: boolean;
  mind_map_url: string | null;
  notes_enabled: boolean;
  notes_content: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to transform database response
const transformContent = (data: any): ChapterContent | null => {
  if (!data) return null;
  return {
    ...data,
    drive_links: Array.isArray(data.drive_links) ? data.drive_links : [],
  };
};

export const useChapterContent = (chapterId: string) => {
  return useQuery({
    queryKey: ['chapter-content', chapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapter_content')
        .select('*')
        .eq('chapter_id', chapterId)
        .maybeSingle();
      
      if (error) throw error;
      return transformContent(data);
    },
    enabled: !!chapterId,
  });
};

export const useUpdateChapterContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ chapterId, ...updates }: Partial<Omit<ChapterContent, 'drive_links'>> & { 
      chapterId: string;
      drive_links?: DriveLink[];
    }) => {
      // Transform drive_links to Json type for Supabase
      const dbUpdates: Record<string, any> = { ...updates };
      if (updates.drive_links) {
        dbUpdates.drive_links = updates.drive_links as unknown as Json;
      }
      delete dbUpdates.chapterId;
      
      // Check if content exists
      const { data: existing } = await supabase
        .from('chapter_content')
        .select('id')
        .eq('chapter_id', chapterId)
        .maybeSingle();
      
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('chapter_content')
          .update(dbUpdates)
          .eq('chapter_id', chapterId)
          .select()
          .single();
        
        if (error) throw error;
        return transformContent(data);
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('chapter_content')
          .insert({ chapter_id: chapterId, ...dbUpdates })
          .select()
          .single();
        
        if (error) throw error;
        return transformContent(data);
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['chapter-content', data.chapter_id] });
      }
      toast.success('Chapter content saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save content: ' + error.message);
    },
  });
};
