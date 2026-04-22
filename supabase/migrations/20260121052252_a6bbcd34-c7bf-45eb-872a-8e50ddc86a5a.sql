-- Create classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'book',
  class_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  chapter_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapter_content table with JSONB for flexible content storage
CREATE TABLE public.chapter_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL UNIQUE REFERENCES public.chapters(id) ON DELETE CASCADE,
  video_enabled BOOLEAN NOT NULL DEFAULT false,
  youtube_url TEXT,
  drive_video_url TEXT,
  audio_enabled BOOLEAN NOT NULL DEFAULT false,
  audio_url TEXT,
  audio_downloadable BOOLEAN NOT NULL DEFAULT true,
  pdf_enabled BOOLEAN NOT NULL DEFAULT false,
  pdf_url TEXT,
  pdf_external_link TEXT,
  pdf_downloadable BOOLEAN NOT NULL DEFAULT true,
  drive_links_enabled BOOLEAN NOT NULL DEFAULT false,
  drive_links JSONB DEFAULT '[]'::jsonb,
  mind_map_enabled BOOLEAN NOT NULL DEFAULT false,
  mind_map_url TEXT,
  notes_enabled BOOLEAN NOT NULL DEFAULT false,
  notes_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_chapters_class_id ON public.chapters(class_id);
CREATE INDEX idx_chapters_order ON public.chapters(class_id, chapter_order);
CREATE INDEX idx_classes_order ON public.classes(class_order);
CREATE INDEX idx_chapter_content_chapter_id ON public.chapter_content(chapter_id);

-- Enable Row Level Security
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classes - publicly readable, but for now admin features work without auth
-- Since we don't have user auth, we'll make all operations open for admin panel functionality
CREATE POLICY "Classes are publicly readable"
ON public.classes FOR SELECT
USING (true);

CREATE POLICY "Classes can be inserted"
ON public.classes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Classes can be updated"
ON public.classes FOR UPDATE
USING (true);

CREATE POLICY "Classes can be deleted"
ON public.classes FOR DELETE
USING (true);

-- RLS Policies for chapters
CREATE POLICY "Chapters are publicly readable"
ON public.chapters FOR SELECT
USING (true);

CREATE POLICY "Chapters can be inserted"
ON public.chapters FOR INSERT
WITH CHECK (true);

CREATE POLICY "Chapters can be updated"
ON public.chapters FOR UPDATE
USING (true);

CREATE POLICY "Chapters can be deleted"
ON public.chapters FOR DELETE
USING (true);

-- RLS Policies for chapter_content
CREATE POLICY "Chapter content is publicly readable"
ON public.chapter_content FOR SELECT
USING (true);

CREATE POLICY "Chapter content can be inserted"
ON public.chapter_content FOR INSERT
WITH CHECK (true);

CREATE POLICY "Chapter content can be updated"
ON public.chapter_content FOR UPDATE
USING (true);

CREATE POLICY "Chapter content can be deleted"
ON public.chapter_content FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
BEFORE UPDATE ON public.chapters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapter_content_updated_at
BEFORE UPDATE ON public.chapter_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();