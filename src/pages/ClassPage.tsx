import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Video, Headphones, FileText, Brain, ExternalLink } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useClass } from '@/hooks/useClasses';
import { usePublishedChapters, Chapter } from '@/hooks/useChapters';
import { useChapterContent, ChapterContent } from '@/hooks/useChapterContent';

// Component to display content badges for a chapter
const ChapterBadges = ({ chapterId }: { chapterId: string }) => {
  const { data: content } = useChapterContent(chapterId);
  
  if (!content) return null;

  const badges = [];
  if (content.video_enabled) badges.push({ icon: Video, label: 'Video', color: 'bg-blue-500/10 text-blue-600' });
  if (content.audio_enabled) badges.push({ icon: Headphones, label: 'Audio', color: 'bg-purple-500/10 text-purple-600' });
  if (content.pdf_enabled) badges.push({ icon: FileText, label: 'PDF', color: 'bg-green-500/10 text-green-600' });
  if (content.mind_map_enabled) badges.push({ icon: Brain, label: 'Mind Map', color: 'bg-orange-500/10 text-orange-600' });
  if (content.drive_links_enabled && content.drive_links?.length > 0) badges.push({ icon: ExternalLink, label: 'Links', color: 'bg-teal-500/10 text-teal-600' });

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, i) => (
        <Badge
          key={i}
          variant="secondary"
          className={`${badge.color} flex items-center gap-1`}
        >
          <badge.icon className="h-3 w-3" />
          {badge.label}
        </Badge>
      ))}
    </div>
  );
};

const ClassPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const { data: classData, isLoading: classLoading } = useClass(classId || '');
  const { data: chapters, isLoading: chaptersLoading } = usePublishedChapters(classId || '');

  if (classLoading) {
    return (
      <Layout>
        <div className="container py-20">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
      </Layout>
    );
  }

  if (!classData) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Class Not Found</h1>
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
      <section className="bg-gradient-to-br from-primary to-primary/90 py-12 md:py-16">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{classData.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 text-4xl">
              {classData.icon || '📚'}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {classData.name}
              </h1>
              <p className="text-white/80">
                {classData.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              Chapters <span className="text-muted-foreground font-normal">({chapters?.length || 0})</span>
            </h2>
          </div>

          {chaptersLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {chapters?.map((chapter) => (
                <Link key={chapter.id} to={`/chapter/${chapter.id}`}>
                  <Card className="group border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all duration-300">
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                              {chapter.chapter_order + 1}
                            </span>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                              {chapter.name}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {chapter.description}
                          </p>
                          <ChapterBadges chapterId={chapter.id} />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!chaptersLoading && (!chapters || chapters.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No chapters available yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ClassPage;
