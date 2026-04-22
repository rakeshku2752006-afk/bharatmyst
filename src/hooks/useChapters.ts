import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Chapter {
  id: string;
  class_id: string;
  name: string;
  description: string | null;
  chapter_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const useChapters = (classId: string) => {
  return useQuery({
    queryKey: ['chapters', classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('class_id', classId)
        .order('chapter_order', { ascending: true });
      
      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!classId,
  });
};

export const usePublishedChapters = (classId: string) => {
  return useQuery({
    queryKey: ['chapters', classId, 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('class_id', classId)
        .eq('published', true)
        .order('chapter_order', { ascending: true });
      
      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!classId,
  });
};

export const useChapter = (id: string) => {
  return useQuery({
    queryKey: ['chapter', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Chapter | null;
    },
    enabled: !!id,
  });
};

export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newChapter: { class_id: string; name: string; description?: string }) => {
      // Get the max order for this class
      const { data: existing } = await supabase
        .from('chapters')
        .select('chapter_order')
        .eq('class_id', newChapter.class_id)
        .order('chapter_order', { ascending: false })
        .limit(1);
      
      const nextOrder = existing && existing.length > 0 ? existing[0].chapter_order + 1 : 0;
      
      const { data, error } = await supabase
        .from('chapters')
        .insert({
          class_id: newChapter.class_id,
          name: newChapter.name,
          description: newChapter.description || null,
          chapter_order: nextOrder,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Also create empty chapter content
      await supabase
        .from('chapter_content')
        .insert({ chapter_id: data.id });
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chapters', variables.class_id] });
      toast.success('Chapter created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create chapter: ' + error.message);
    },
  });
};

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Chapter> & { id: string }) => {
      const { data, error } = await supabase
        .from('chapters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chapters', data.class_id] });
      queryClient.invalidateQueries({ queryKey: ['chapter', data.id] });
      toast.success('Chapter updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update chapter: ' + error.message);
    },
  });
};

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, classId }: { id: string; classId: string }) => {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return classId;
    },
    onSuccess: (classId) => {
      queryClient.invalidateQueries({ queryKey: ['chapters', classId] });
      toast.success('Chapter deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete chapter: ' + error.message);
    },
  });
};
