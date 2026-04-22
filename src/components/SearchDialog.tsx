import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { usePublishedClasses } from '@/hooks/useClasses';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const { data: classes } = usePublishedClasses();
  
  // Fetch all published chapters
  const { data: chapters } = useQuery({
    queryKey: ['all-published-chapters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('id, name, description, class_id')
        .eq('published', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handleSelect = (type: 'class' | 'chapter', id: string) => {
    onOpenChange(false);
    if (type === 'class') {
      navigate(`/class/${id}`);
    } else {
      navigate(`/chapter/${id}`);
    }
  };

  // Keyboard shortcut to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search classes, chapters, topics..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {classes && classes.length > 0 && (
          <CommandGroup heading="Classes">
            {classes.map((classItem) => (
              <CommandItem
                key={classItem.id}
                value={classItem.name}
                onSelect={() => handleSelect('class', classItem.id)}
              >
                <span className="mr-2 text-lg">{classItem.icon || '📚'}</span>
                <span>{classItem.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {chapters && chapters.length > 0 && (
          <CommandGroup heading="Chapters">
            {chapters.map((chapter) => (
              <CommandItem
                key={chapter.id}
                value={`${chapter.name} ${chapter.description || ''}`}
                onSelect={() => handleSelect('chapter', chapter.id)}
              >
                <Search className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{chapter.name}</span>
                  {chapter.description && (
                    <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                      {chapter.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;
