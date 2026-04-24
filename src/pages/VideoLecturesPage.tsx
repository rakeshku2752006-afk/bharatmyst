import Layout from '@/components/layout/Layout';
import { useAllVideoLectures } from '@/hooks/useAllContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Video, Play, ExternalLink, BookOpen } from 'lucide-react';

const VideoLecturesPage = () => {
  const { data: lectures, isLoading } = useAllVideoLectures();

  return (
    <Layout>
      <div className="container py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-500/10 mb-4">
            <Video className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Video <span className="text-primary">Lectures</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch high-quality video explanations by expert teachers — added by admin across all classes and chapters.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : lectures && lectures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectures.map((item: any) => {
              const chapter = item.chapters;
              const cls = chapter?.classes;
              const videoUrl = item.youtube_url || item.drive_video_url;

              return (
                <Card
                  key={item.id}
                  className="group overflow-hidden border border-border/50 bg-card hover:border-blue-500/30 hover:shadow-lifted transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-0">
                    {/* Thumbnail / Banner */}
                    <div className="flex items-center justify-center h-36 bg-gradient-to-br from-blue-500/10 to-blue-600/20 relative overflow-hidden">
                      <Play className="h-14 w-14 text-blue-500/60 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
                      {item.youtube_url && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          YouTube
                        </span>
                      )}
                      {item.drive_video_url && !item.youtube_url && (
                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Drive
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-base">{cls?.icon || '📚'}</span>
                        <span className="text-xs text-muted-foreground font-medium truncate">
                          {cls?.name}
                        </span>
                      </div>
                      <h3 className="font-semibold text-base mb-3 group-hover:text-blue-500 transition-colors line-clamp-2">
                        {chapter?.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {videoUrl ? (
                          <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                          >
                            <Play className="h-3.5 w-3.5" />
                            Watch Now
                          </a>
                        ) : null}
                        <Link
                          to={`/chapter/${item.chapter_id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          Chapter
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-blue-500/10 mb-4">
              <Video className="h-10 w-10 text-blue-500/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Video Lectures Yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Video lectures will appear here once the admin uploads them from the chapter editor.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VideoLecturesPage;
