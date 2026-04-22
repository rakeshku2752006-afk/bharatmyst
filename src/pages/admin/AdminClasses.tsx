import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, GripVertical, ChevronRight } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useClasses, useCreateClass, useDeleteClass, useUpdateClass, Class } from '@/hooks/useClasses';
import { useChapters } from '@/hooks/useChapters';

const EMOJI_OPTIONS = ['📚', '📖', '🎓', '🏆', '📝', '🔬', '🧮', '🌍', '💻', '🎨', '🎵', '⚽'];

const AdminClasses = () => {
  const { data: classes, isLoading } = useClasses();
  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();
  const updateClass = useUpdateClass();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [newClassIcon, setNewClassIcon] = useState('📚');

  const handleAddClass = async () => {
    if (!newClassName.trim()) return;
    
    await createClass.mutateAsync({
      name: newClassName,
      description: newClassDescription,
      icon: newClassIcon,
    });
    
    setIsAddDialogOpen(false);
    setNewClassName('');
    setNewClassDescription('');
    setNewClassIcon('📚');
  };

  const handleDeleteClass = async (id: string) => {
    await deleteClass.mutateAsync(id);
  };

  const handleUpdateClass = async (id: string, updates: Partial<Class>) => {
    await updateClass.mutateAsync({ id, ...updates });
  };

  return (
    <AdminLayout title="Classes & Chapters" subtitle="Manage all classes and their chapters">
      {/* Add Class Button */}
      <div className="flex justify-end mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>
                Create a new class for your students.
              </DialogDescription>
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
                        newClassIcon === emoji 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      onClick={() => setNewClassIcon(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  placeholder="e.g., Class 8"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classDescription">Description</Label>
                <Textarea
                  id="classDescription"
                  placeholder="Brief description of the class..."
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClass} disabled={createClass.isPending}>
                {createClass.isPending ? 'Adding...' : 'Add Class'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classes List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {classes?.map((classItem) => (
            <ClassCard 
              key={classItem.id} 
              classItem={classItem} 
              onDelete={handleDeleteClass}
              onUpdate={handleUpdateClass}
            />
          ))}
        </div>
      )}

      {!isLoading && (!classes || classes.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No classes yet. Add your first class to get started.</p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Class
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
};

// Separate component for class card to fetch chapter count
const ClassCard = ({ 
  classItem, 
  onDelete, 
  onUpdate 
}: { 
  classItem: Class; 
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Class>) => void;
}) => {
  const { data: chapters } = useChapters(classItem.id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(classItem.name);
  const [editDescription, setEditDescription] = useState(classItem.description || '');
  const [editIcon, setEditIcon] = useState(classItem.icon || '📚');

  const handleSave = () => {
    onUpdate(classItem.id, {
      name: editName,
      description: editDescription,
      icon: editIcon,
    });
    setIsEditOpen(false);
  };
  
  return (
    <Card className="group">
      <CardContent className="p-0">
        <div className="flex items-center">
          {/* Drag Handle */}
          <div className="p-4 cursor-grab text-muted-foreground hover:text-foreground">
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Class Info */}
          <Link 
            to={`/admin/classes/${classItem.id}`}
            className="flex-1 flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
              {classItem.icon || '📚'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {classItem.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {classItem.description}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {chapters?.length || 0} chapters
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1 p-4 border-l border-border">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
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
                            editIcon === emoji 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                          onClick={() => setEditIcon(emoji)}
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
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editClassDescription">Description</Label>
                    <Textarea
                      id="editClassDescription"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Class</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{classItem.name}"? This will also delete all chapters and content. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(classItem.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminClasses;
