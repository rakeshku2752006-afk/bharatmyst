import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Video, 
  Headphones, 
  FileText, 
  Brain, 
  ExternalLink,
  Download,
  Play,
  BookOpen
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useChapter } from '@/hooks/useChapters';
import { useChapterContent } from '@/hooks/useChapterContent';
import { useClass } from '@/hooks/useClasses';

// Convert YouTube URL to embed format
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // Already an embed URL
  if (url.includes('/embed/')) return url;
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  // Handle youtu.be/VIDEO_ID format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    videoId = shortMatch[1];
  }
  
  // Handle youtube.com/watch?v=VIDEO_ID format
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }
  
  // Handle youtube.com/shorts/VIDEO_ID format
  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    videoId = shortsMatch[1];
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url;
};

const ChapterPage = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { data: chapter, isLoading: chapterLoading } = useChapter(chapterId || '');
  const { data: content, isLoading: contentLoading } = useChapterContent(chapterId || '');
  const { data: classData } = useClass(chapter?.class_id || '');

  if (chapterLoading || contentLoading) {
    return (
      <Layout>
        <div className="container py-20">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (!chapter) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter Not Found</h1>
          <Link to="/" className="text-primary hover:underline">
            Go back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary to-primary/90 py-10 md:py-14">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/class/${chapter.class_id}`} className="hover:text-white transition-colors">
              {classData?.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{chapter.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-2xl font-bold text-white">
              {chapter.chapter_order + 1}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {chapter.name}
              </h1>
              <p className="text-white/80 text-sm md:text-base">
                {chapter.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 md:py-14">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {/* Video Section */}
            {content?.video_enabled && (content.youtube_url || content.drive_video_url) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Video className="h-5 w-5 text-blue-500" />
                    Video Lecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    {content.youtube_url ? (
                      <iframe
                        src={getYouTubeEmbedUrl(content.youtube_url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Button variant="outline" className="gap-2" asChild>
                          <a href={content.drive_video_url || '#'} target="_blank" rel="noopener noreferrer">
                            <Play className="h-4 w-4" />
                            Play Video
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Audio Section */}
            {content?.audio_enabled && content.audio_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Headphones className="h-5 w-5 text-purple-500" />
                    Audio Lecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <audio controls className="w-full">
                      <source src={content.audio_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    {content.audio_downloadable && (
                      <Button variant="outline" size="sm" className="mt-3 gap-2" asChild>
                        <a href={content.audio_url} download>
                          <Download className="h-4 w-4" />
                          Download Audio
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PDF Section */}
            {content?.pdf_enabled && (content.pdf_url || content.pdf_external_link) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-green-500" />
                    PDF Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive PDF notes for this chapter
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <Button variant="outline" className="gap-2" asChild>
                        <a href={content.pdf_external_link || content.pdf_url || '#'} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          View PDF
                        </a>
                      </Button>
                      {content.pdf_downloadable && content.pdf_url && (
                        <Button variant="default" className="gap-2" asChild>
                          <a href={content.pdf_url} download>
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Drive Links Section */}
            {content?.drive_links_enabled && content.drive_links && content.drive_links.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ExternalLink className="h-5 w-5 text-teal-500" />
                    Google Drive Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content.drive_links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <span className="font-medium">{link.title}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mind Map Section */}
            {content?.mind_map_enabled && content.mind_map_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="h-5 w-5 text-orange-500" />
                    Mind Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Visual summary and concept map for quick revision
                    </p>
                    <Button variant="outline" className="gap-2" asChild>
                      <a href={content.mind_map_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        View Mind Map
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes Section */}
            {content?.notes_enabled && content.notes_content && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Notes & Key Concepts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="bg-muted/30 rounded-lg p-6" dangerouslySetInnerHTML={{ 
                      __html: content.notes_content.replace(/\n/g, '<br/>').replace(/##/g, '<strong>').replace(/\*\*/g, '<strong>') 
                    }} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No content message */}
            {content && !content.video_enabled && !content.audio_enabled && !content.pdf_enabled && 
             !content.drive_links_enabled && !content.mind_map_enabled && !content.notes_enabled && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No content available for this chapter yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ChapterPage;
