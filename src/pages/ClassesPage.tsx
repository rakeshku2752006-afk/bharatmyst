import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { usePublishedClasses } from '@/hooks/useClasses';
import { useChapters } from '@/hooks/useChapters';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseClassName, getDisplayClassName } from '@/lib/classParser';

const ClassCard = ({ classData }: { classData: { id: string; name: string; description: string | null; icon: string | null } }) => {
  const { data: chapters } = useChapters(classData.id);
  const chapterCount = chapters?.filter(ch => ch.published).length || 0;
  const parsed = parseClassName(classData.name);

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
            {getDisplayClassName(classData.name)}
          </h3>
          
          {/* Display badges for Grade, Board, Language */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-[10px] uppercase font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {parsed.grade || 'Default'}
            </span>
            {parsed.board && (
              <span className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full">
                {parsed.board}
              </span>
            )}
            {parsed.language && (
              <span className="text-[10px] uppercase font-bold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                {parsed.language}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {classData.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto pt-2 border-t border-border/50">
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
  
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedBoard, setSelectedBoard] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  const { parsedClasses, filters } = useMemo(() => {
    if (!classes) return { parsedClasses: [], filters: { grades: [], boards: [], languages: [] } };
    
    const parsedList = classes.map(c => ({
      ...c,
      parsed: parseClassName(c.name)
    }));

    const grades = new Set<string>();
    const boards = new Set<string>();
    const languages = new Set<string>();

    parsedList.forEach(c => {
      if (c.parsed.grade) grades.add(c.parsed.grade);
      if (c.parsed.board) boards.add(c.parsed.board);
      if (c.parsed.language) languages.add(c.parsed.language);
    });

    return {
      parsedClasses: parsedList,
      filters: {
        grades: Array.from(grades).sort(),
        boards: Array.from(boards).sort(),
        languages: Array.from(languages).sort(),
      }
    };
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return parsedClasses.filter(c => {
      if (selectedGrade !== 'All' && c.parsed.grade !== selectedGrade) return false;
      if (selectedBoard !== 'All' && c.parsed.board !== selectedBoard) return false;
      if (selectedLanguage !== 'All' && c.parsed.language !== selectedLanguage) return false;
      return true;
    });
  }, [parsedClasses, selectedGrade, selectedBoard, selectedLanguage]);

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Your <span className="text-primary">Course</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the exact study material you need by filtering through grades, boards, and languages.
          </p>
        </div>

        {/* Filters Section */}
        {!isLoading && classes && classes.length > 0 && (
          <div className="bg-muted/30 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-center border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mr-4">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filter By:</span>
            </div>
            
            {filters.grades.length > 0 && (
              <select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium w-full md:w-auto"
              >
                <option value="All">All Grades / Classes</option>
                {filters.grades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            )}

            {filters.boards.length > 0 && (
              <select 
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium w-full md:w-auto"
              >
                <option value="All">All Boards</option>
                {filters.boards.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}

            {filters.languages.length > 0 && (
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium w-full md:w-auto"
              >
                <option value="All">All Languages</option>
                {filters.languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* List Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        ) : filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.map((classData) => (
              <ClassCard key={classData.id} classData={classData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground text-lg">No classes found matching your filters.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSelectedGrade('All');
                setSelectedBoard('All');
                setSelectedLanguage('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClassesPage;
