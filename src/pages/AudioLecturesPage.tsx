import Layout from '@/components/layout/Layout';
import { useAllAudioLectures } from '@/hooks/useAllContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Headphones, Play, Download, BookOpen } from 'lucide-react';

const AudioLecturesPage = () => {
  const { data: audios, isLoading } = useAllAudioLectures();

  return (
    <Layout>
      <div className="container py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-purple-500/10 mb-4">
            <Headphones className="h-8 w-8 text-purple-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Audio <span className="text-primary">Lectures</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn on-the-go with audio content — added by admin across all classes and chapters.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : audios && audios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audios.map((item: any) => {
              const chapter = item.chapters;
              const cls = chapter?.classes;

              return (
                <Card
                  key={item.id}
                  className="group overflow-hidden border border-border/50 bg-card hover:border-purple-500/30 hover:shadow-lifted transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-0">
                    {/* Banner */}
                    <div className="flex items-center justify-center h-36 bg-gradient-to-br from-purple-500/10 to-purple-600/20 relative overflow-hidden">
                      <Headphones className="h-14 w-14 text-purple-500/60 group-hover:text-purple-500 group-hover:scale-110 transition-all duration-300" />
                      {item.audio_downloadable && (
                        <span className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Download className="h-2.5 w-2.5" />
                          Downloadable
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
                      <h3 className="font-semibold text-base mb-3 group-hover:text-purple-500 transition-colors line-clamp-2">
                        {chapter?.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {item.audio_url ? (
                          <a
                            href={item.audio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
                          >
                            <Play className="h-3.5 w-3.5" />
                            Listen Now
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
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-purple-500/10 mb-4">
              <Headphones className="h-10 w-10 text-purple-500/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Audio Lectures Yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Audio lectures will appear here once the admin uploads them from the chapter editor.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AudioLecturesPage;
