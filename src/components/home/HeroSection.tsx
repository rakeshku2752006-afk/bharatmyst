import { Search, BookOpen, Video, FileText, ArrowRight } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePublishedClasses } from '@/hooks/useClasses';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: classes } = usePublishedClasses();
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

  const query = searchQuery.trim().toLowerCase();

  const { matchedClasses, matchedChapters } = useMemo(() => {
    if (!query) return { matchedClasses: [], matchedChapters: [] };
    const mc = (classes || []).filter((c) =>
      c.name.toLowerCase().includes(query) ||
      (c.description || '').toLowerCase().includes(query)
    );
    const mch = (chapters || []).filter((ch) =>
      ch.name.toLowerCase().includes(query) ||
      (ch.description || '').toLowerCase().includes(query)
    );
    return { matchedClasses: mc, matchedChapters: mch };
  }, [query, classes, chapters]);

  const totalResults = matchedClasses.length + matchedChapters.length;

  const goToFirstResult = () => {
    if (matchedClasses[0]) {
      navigate(`/class/${matchedClasses[0].id}`);
    } else if (matchedChapters[0]) {
      navigate(`/chapter/${matchedChapters[0].id}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalResults > 0) goToFirstResult();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-teal py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm mb-6 animate-fade-in">
            <BookOpen className="h-4 w-4" />
            <span>Trusted by 10,000+ students across India</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up">
            Learn Smart,{' '}
            <span className="text-accent">Learn Deep</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Comprehensive study materials, video lectures, and practice resources for Classes 9-12. Everything you need to excel in your board exams.
          </p>

          {/* Search Bar */}
          <div ref={containerRef} className="relative max-w-xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Input
                type="search"
                placeholder="Search class or chapter name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="h-14 pl-12 pr-32 text-base bg-white border-0 shadow-elevated rounded-xl text-foreground"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-primary hover:bg-primary/90"
              >
                Search
              </Button>
            </form>

            {/* Live Results Dropdown */}
            {showResults && query && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground border border-border rounded-xl shadow-elevated overflow-hidden z-20 text-left max-h-96 overflow-y-auto">
                {totalResults === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  <>
                    {matchedClasses.length > 0 && (
                      <div className="py-2">
                        <div className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Classes
                        </div>
                        {matchedClasses.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setShowResults(false);
                              navigate(`/class/${c.id}`);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            <span className="text-lg">{c.icon || '📚'}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{c.name}</div>
                              {c.description && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {c.description}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 opacity-50" />
                          </button>
                        ))}
                      </div>
                    )}
                    {matchedChapters.length > 0 && (
                      <div className="py-2 border-t border-border">
                        <div className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Chapters
                        </div>
                        {matchedChapters.map((ch) => (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => {
                              setShowResults(false);
                              navigate(`/chapter/${ch.id}`);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{ch.name}</div>
                              {ch.description && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {ch.description}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 opacity-50" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              <Video className="h-4 w-4 text-accent" />
              <span>Video Lectures</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              <FileText className="h-4 w-4 text-accent" />
              <span>PDF Notes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              <BookOpen className="h-4 w-4 text-accent" />
              <span>Mind Maps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
