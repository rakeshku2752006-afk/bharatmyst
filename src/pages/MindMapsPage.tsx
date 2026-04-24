import Layout from '@/components/layout/Layout';
import { useAllMindMaps } from '@/hooks/useAllContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Brain, ExternalLink, BookOpen, Map } from 'lucide-react';

const MindMapsPage = () => {
  const { data: mindMaps, isLoading } = useAllMindMaps();

  return (
    <Layout>
      <div className="container py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-orange-500/10 mb-4">
            <Brain className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Mind <span className="text-primary">Maps</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visual summaries for quick revision — added by admin across all classes and chapters.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : mindMaps && mindMaps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mindMaps.map((item: any) => {
              const chapter = item.chapters;
              const cls = chapter?.classes;

              return (
                <Card
                  key={item.id}
                  className="group overflow-hidden border border-border/50 bg-card hover:border-orange-500/30 hover:shadow-lifted transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-0">
                    {/* Banner */}
                    <div className="flex items-center justify-center h-36 bg-gradient-to-br from-orange-500/10 to-orange-600/20 relative overflow-hidden">
                      <Brain className="h-14 w-14 text-orange-500/60 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300" />
                      <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Mind Map
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-base">{cls?.icon || '📚'}</span>
                        <span className="text-xs text-muted-foreground font-medium truncate">
                          {cls?.name}
                        </span>
                      </div>
                      <h3 className="font-semibold text-base mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {chapter?.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {item.mind_map_url ? (
                          <a
                            href={item.mind_map_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
                          >
                            <Map className="h-3.5 w-3.5" />
                            View Map
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
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-orange-500/10 mb-4">
              <Brain className="h-10 w-10 text-orange-500/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Mind Maps Yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Mind maps will appear here once the admin uploads them from the chapter editor.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MindMapsPage;
