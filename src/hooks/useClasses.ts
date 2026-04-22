import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Class {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  class_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('class_order', { ascending: true });
      
      if (error) throw error;
      return data as Class[];
    },
  });
};

export const usePublishedClasses = () => {
  return useQuery({
    queryKey: ['classes', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('published', true)
        .order('class_order', { ascending: true });
      
      if (error) throw error;
      return data as Class[];
    },
  });
};

export const useClass = (id: string) => {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Class | null;
    },
    enabled: !!id,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newClass: { name: string; description?: string; icon?: string }) => {
      // Get the max order
      const { data: existing } = await supabase
        .from('classes')
        .select('class_order')
        .order('class_order', { ascending: false })
        .limit(1);
      
      const nextOrder = existing && existing.length > 0 ? existing[0].class_order + 1 : 0;
      
      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: newClass.name,
          description: newClass.description || null,
          icon: newClass.icon || '📚',
          class_order: nextOrder,
          published: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create class: ' + error.message);
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Class> & { id: string }) => {
      const { data, error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update class: ' + error.message);
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete class: ' + error.message);
    },
  });
};
