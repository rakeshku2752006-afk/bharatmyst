import { Link } from 'react-router-dom';
import { BookOpen, FileText, Video, Headphones, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useClasses } from '@/hooks/useClasses';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { data: classes, isLoading: classesLoading } = useClasses();
  
  // Get all chapters count
  const { data: chaptersData } = useQuery({
    queryKey: ['chapters-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('chapters')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Get content stats
  const { data: contentStats } = useQuery({
    queryKey: ['content-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapter_content')
        .select('video_enabled, audio_enabled, pdf_enabled');
      if (error) throw error;
      return {
        videos: data?.filter(c => c.video_enabled).length || 0,
        audio: data?.filter(c => c.audio_enabled).length || 0,
        pdfs: data?.filter(c => c.pdf_enabled).length || 0,
      };
    },
  });

  const totalClasses = classes?.length || 0;
  const totalChapters = chaptersData || 0;
  const totalVideos = contentStats?.videos || 0;
  const totalAudio = contentStats?.audio || 0;

  const stats = [
    { label: 'Total Classes', value: totalClasses, icon: BookOpen, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Total Chapters', value: totalChapters, icon: FileText, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Video Lectures', value: totalVideos, icon: Video, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { label: 'Audio Files', value: totalAudio, icon: Headphones, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your learning platform">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/classes">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Class
              </Button>
            </Link>
            <Link to="/admin/classes">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Chapter
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Classes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Classes Overview</CardTitle>
          <Link to="/admin/classes">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {classesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : classes && classes.length > 0 ? (
            <div className="space-y-3">
              {classes.map((classItem) => (
                <ClassOverviewItem key={classItem.id} classItem={classItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No classes yet. Create your first class!</p>
              <Link to="/admin/classes">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Class
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

// Separate component for class overview item to fetch chapter count
const ClassOverviewItem = ({ classItem }: { classItem: { id: string; name: string; icon: string | null } }) => {
  const { data: chapters } = useQuery({
    queryKey: ['chapters', classItem.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('id')
        .eq('class_id', classItem.id);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">
          {classItem.icon || '📚'}
        </div>
        <div>
          <p className="font-medium">{classItem.name}</p>
          <p className="text-sm text-muted-foreground">{chapters?.length || 0} chapters</p>
        </div>
      </div>
      <Link to={`/admin/classes/${classItem.id}`}>
        <Button variant="ghost" size="sm">Manage</Button>
      </Link>
    </div>
  );
};

export default AdminDashboard;
