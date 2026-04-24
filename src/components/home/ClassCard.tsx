import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Class } from '@/hooks/useClasses';
import { useChapters } from '@/hooks/useChapters';
import { getDisplayClassName } from '@/lib/classParser';

interface ClassCardProps {
  classData: Class;
  index: number;
}

const ClassCard = ({ classData, index }: ClassCardProps) => {
  const { data: chapters } = useChapters(classData.id);
  const chapterCount = chapters?.filter(ch => ch.published).length || 0;

  return (
    <Link to={`/class/${classData.id}`} className="block group">
      <Card 
        className="h-full overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lifted hover:-translate-y-1"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <CardContent className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-3xl">
              {classData.icon || '📚'}
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {getDisplayClassName(classData.name)}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {classData.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{chapterCount} Chapters</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClassCard;
