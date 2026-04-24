import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetches all published chapters + their content joined with class name
export const useAllVideoLectures = () => {
  return useQuery({
    queryKey: ['all-video-lectures'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapter_content')
        .select(`
          id,
          chapter_id,
          youtube_url,
          drive_video_url,
          video_enabled,
          chapters!inner(
            id,
            name,
            description,
            published,
            classes!inner(id, name, icon)
          )
        `)
        .eq('video_enabled', true)
        .eq('chapters.published', true);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAllPdfNotes = () => {
  return useQuery({
    queryKey: ['all-pdf-notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapter_content')
        .select(`
          id,
          chapter_id,
          pdf_url,
          pdf_external_link,
          pdf_downloadable,
          pdf_enabled,
          chapters!inner(
            id,
            name,
            description,
            published,
            classes!inner(id, name, icon)
          )
        `)
        .eq('pdf_enabled', true)
        .eq('chapters.published', true);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAllMindMaps = () => {
  return useQuery({
    queryKey: ['all-mind-maps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapter_content')
        .select(`
          id,
          chapter_id,
          mind_map_url,
          mind_map_enabled,
          chapters!inner(
            id,
            name,
            description,
            published,
            classes!inner(id, name, icon)
          )
        `)
        .eq('mind_map_enabled', true)
        .eq('chapters.published', true);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAllAudioLectures = () => {
  return useQuery({
    queryKey: ['all-audio-lectures'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapter_content')
        .select(`
          id,
          chapter_id,
          audio_url,
          audio_enabled,
          audio_downloadable,
          chapters!inner(
            id,
            name,
            description,
            published,
            classes!inner(id, name, icon)
          )
        `)
        .eq('audio_enabled', true)
        .eq('chapters.published', true);

      if (error) throw error;
      return data || [];
    },
  });
};
