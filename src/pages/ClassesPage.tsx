import Layout from '@/components/layout/Layout';
import { usePublishedClasses } from '@/hooks/useClasses';
import { useChapters } from '@/hooks/useChapters';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const ClassCard = ({ classData }: { classData: { id: string; name: string; description: string | null; icon: string | null } }) => {
  const { data: chapters } = useChapters(classData.id);
  const chapterCount = chapters?.filter(ch => ch.published).length || 0;

  return (
    <Link to={`/class/${classData.id}`} className="block group">
      <Card className="h-full overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lifted hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-3xl">
              {classData.icon || '📚'}
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {classData.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {classData.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{chapterCount} Chapters</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const ClassesPage = () => {
  const { data: classes, isLoading } = usePublishedClasses();

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            All <span className="text-primary">Classes</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your class to access comprehensive study materials, video lectures, and practice resources.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        ) : classes && classes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classes.map((classData) => (
              <ClassCard key={classData.id} classData={classData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No classes available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClassesPage;
