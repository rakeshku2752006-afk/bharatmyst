import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, GripVertical, ChevronLeft, Video, Headphones, FileText, Brain, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useClass, useUpdateClass } from '@/hooks/useClasses';
import { useChapters, useCreateChapter, useUpdateChapter, useDeleteChapter, Chapter } from '@/hooks/useChapters';
import { useChapterContent, ChapterContent } from '@/hooks/useChapterContent';
import React from 'react';

const EMOJI_OPTIONS = ['📚', '📖', '🎓', '🏆', '📝', '🔬', '🧮', '🌍', '💻', '🎨', '🎵', '⚽'];

const AdminClassDetail = () => {
  const { classId } = useParams<{ classId: string }>();
  const { data: classData, isLoading: classLoading } = useClass(classId || '');
  const { data: chapters, isLoading: chaptersLoading } = useChapters(classId || '');
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();
  const updateClass = useUpdateClass();

  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterDescription, setNewChapterDescription] = useState('');
  const [editClassName, setEditClassName] = useState('');
  const [editClassDescription, setEditClassDescription] = useState('');
  const [editClassIcon, setEditClassIcon] = useState('📚');

  // Initialize edit form when class data loads
  React.useEffect(() => {
    if (classData) {
      setEditClassName(classData.name);
      setEditClassDescription(classData.description || '');
      setEditClassIcon(classData.icon || '📚');
    }
  }, [classData]);

  if (classLoading) {
    return (
      <AdminLayout title="Loading...">
        <Skeleton className="h-32 rounded-lg mb-6" />
        <Skeleton className="h-20 rounded-lg mb-3" />
        <Skeleton className="h-20 rounded-lg" />
      </AdminLayout>
    );
  }

  if (!classData) {
    return (
      <AdminLayout title="Class Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">This class does not exist.</p>
          <Link to="/admin/classes">
            <Button>Back to Classes</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const handleAddChapter = async () => {
    if (!newChapterName.trim()) return;
    
    await createChapter.mutateAsync({
      class_id: classId!,
      name: newChapterName,
      description: newChapterDescription,
    });
    
    setIsAddChapterOpen(false);
    setNewChapterName('');
    setNewChapterDescription('');
  };

  const handleTogglePublish = async (chapter: Chapter) => {
    await updateChapter.mutateAsync({
      id: chapter.id,
      published: !chapter.published,
    });
  };

  const handleDeleteChapter = async (chapterId: string) => {
    await deleteChapter.mutateAsync({ id: chapterId, classId: classId! });
  };

  const handleSaveClass = async () => {
    await updateClass.mutateAsync({
      id: classId!,
      name: editClassName,
      description: editClassDescription,
      icon: editClassIcon,
    });
    setIsEditClassOpen(false);
  };

  return (
    <AdminLayout 
      title={classData.name} 
      subtitle={`Manage chapters for ${classData.name}`}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/admin/classes">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Classes
          </Button>
        </Link>
      </div>

      {/* Class Info Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-4xl">
                {classData.icon || '📚'}
              </div>
              <div>
                <h2 className="text-xl font-bold">{classData.name}</h2>
                <p className="text-muted-foreground">{classData.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {chapters?.length || 0} chapters
                </p>
              </div>
            </div>
            <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Class</DialogTitle>
                  <DialogDescription>Update the class details.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <div className="flex flex-wrap gap-2">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className={`h-10 w-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                            editClassIcon === emoji 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                          onClick={() => setEditClassIcon(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editClassName">Class Name</Label>
                    <Input
                      id="editClassName"
                      value={editClassName}
                      onChange={(e) => setEditClassName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editClassDescription">Description</Label>
                    <Textarea
                      id="editClassDescription"
                      value={editClassDescription}
                      onChange={(e) => setEditClassDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditClassOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveClass} disabled={updateClass.isPending}>
                    {updateClass.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Add Chapter Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Chapters</h3>
        <Dialog open={isAddChapterOpen} onOpenChange={setIsAddChapterOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Chapter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Chapter</DialogTitle>
              <DialogDescription>
                Create a new chapter for {classData.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="chapterName">Chapter Name</Label>
                <Input
                  id="chapterName"
                  placeholder="e.g., Real Numbers"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chapterDescription">Description</Label>
                <Textarea
                  id="chapterDescription"
                  placeholder="Brief description of the chapter..."
                  value={newChapterDescription}
                  onChange={(e) => setNewChapterDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddChapterOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddChapter} disabled={createChapter.isPending}>
                {createChapter.isPending ? 'Adding...' : 'Add Chapter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chapters List */}
      {chaptersLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {chapters?.map((chapter) => (
            <ChapterCard 
              key={chapter.id}
              chapter={chapter}
              onTogglePublish={handleTogglePublish}
              onDelete={handleDeleteChapter}
            />
          ))}
        </div>
      )}

      {!chaptersLoading && (!chapters || chapters.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No chapters yet. Add your first chapter.</p>
            <Button onClick={() => setIsAddChapterOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Chapter
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
};

// Separate component for chapter card to fetch content badges
const ChapterCard = ({ 
  chapter, 
  onTogglePublish, 
  onDelete 
}: { 
  chapter: Chapter; 
  onTogglePublish: (chapter: Chapter) => void;
  onDelete: (id: string) => void;
}) => {
  const { data: content } = useChapterContent(chapter.id);
  
  const badges = [];
  if (content?.video_enabled) badges.push({ icon: Video, label: 'Video', color: 'bg-blue-500/10 text-blue-600' });
  if (content?.audio_enabled) badges.push({ icon: Headphones, label: 'Audio', color: 'bg-purple-500/10 text-purple-600' });
  if (content?.pdf_enabled) badges.push({ icon: FileText, label: 'PDF', color: 'bg-green-500/10 text-green-600' });
  if (content?.mind_map_enabled) badges.push({ icon: Brain, label: 'Mind Map', color: 'bg-orange-500/10 text-orange-600' });
  if (content?.drive_links_enabled && content?.drive_links?.length > 0) badges.push({ icon: ExternalLink, label: 'Links', color: 'bg-teal-500/10 text-teal-600' });

  return (
    <Card className="group">
      <CardContent className="p-0">
        <div className="flex items-center">
          {/* Drag Handle */}
          <div className="p-4 cursor-grab text-muted-foreground hover:text-foreground">
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Chapter Info */}
          <Link 
            to={`/admin/chapters/${chapter.id}`}
            className="flex-1 flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
              {chapter.chapter_order + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium group-hover:text-primary transition-colors">
                  {chapter.name}
                </h4>
                {!chapter.published && (
                  <Badge variant="secondary" className="text-xs">Draft</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate mb-2">
                {chapter.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {badges.map((badge, i) => {
                  const IconComponent = badge.icon;
                  return (
                    <Badge
                      key={i}
                      variant="secondary"
                      className={`${badge.color} text-xs px-2 py-0.5`}
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {badge.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3 p-4 border-l border-border">
            <div className="flex items-center gap-2">
              <Label htmlFor={`publish-${chapter.id}`} className="text-xs text-muted-foreground">
                Published
              </Label>
              <Switch 
                id={`publish-${chapter.id}`}
                checked={chapter.published}
                onCheckedChange={() => onTogglePublish(chapter)}
              />
            </div>
            <Link to={`/admin/chapters/${chapter.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{chapter.name}"? This will also delete all content. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(chapter.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminClassDetail;
