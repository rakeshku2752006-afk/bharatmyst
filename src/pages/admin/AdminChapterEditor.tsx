import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ChevronLeft, 
  Video, 
  Headphones, 
  FileText, 
  Brain, 
  ExternalLink, 
  Plus, 
  Trash2,
  Save,
  Eye,
  Upload
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useChapter } from '@/hooks/useChapters';
import { useClass } from '@/hooks/useClasses';
import { useChapterContent, useUpdateChapterContent, DriveLink } from '@/hooks/useChapterContent';

const AdminChapterEditor = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { data: chapter, isLoading: chapterLoading } = useChapter(chapterId || '');
  const { data: content, isLoading: contentLoading } = useChapterContent(chapterId || '');
  const { data: classData } = useClass(chapter?.class_id || '');
  const updateContent = useUpdateChapterContent();

  // Form states
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [driveVideoUrl, setDriveVideoUrl] = useState('');

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioDownloadable, setAudioDownloadable] = useState(true);

  const [pdfEnabled, setPdfEnabled] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfExternalLink, setPdfExternalLink] = useState('');
  const [pdfDownloadable, setPdfDownloadable] = useState(true);

  const [driveLinksEnabled, setDriveLinksEnabled] = useState(false);
  const [driveLinks, setDriveLinks] = useState<DriveLink[]>([]);

  const [mindMapEnabled, setMindMapEnabled] = useState(false);
  const [mindMapUrl, setMindMapUrl] = useState('');

  const [notesEnabled, setNotesEnabled] = useState(false);
  const [notesContent, setNotesContent] = useState('');

  // Load content into form when data is fetched
  useEffect(() => {
    if (content) {
      setVideoEnabled(content.video_enabled);
      setYoutubeUrl(content.youtube_url || '');
      setDriveVideoUrl(content.drive_video_url || '');
      setAudioEnabled(content.audio_enabled);
      setAudioUrl(content.audio_url || '');
      setAudioDownloadable(content.audio_downloadable);
      setPdfEnabled(content.pdf_enabled);
      setPdfUrl(content.pdf_url || '');
      setPdfExternalLink(content.pdf_external_link || '');
      setPdfDownloadable(content.pdf_downloadable);
      setDriveLinksEnabled(content.drive_links_enabled);
      setDriveLinks(content.drive_links || []);
      setMindMapEnabled(content.mind_map_enabled);
      setMindMapUrl(content.mind_map_url || '');
      setNotesEnabled(content.notes_enabled);
      setNotesContent(content.notes_content || '');
    }
  }, [content]);

  if (chapterLoading || contentLoading) {
    return (
      <AdminLayout title="Loading...">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-96 rounded-lg" />
      </AdminLayout>
    );
  }

  if (!chapter) {
    return (
      <AdminLayout title="Chapter Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">This chapter does not exist.</p>
          <Link to="/admin/classes">
            <Button>Back to Classes</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const handleAddDriveLink = () => {
    setDriveLinks([...driveLinks, { id: `dl-${Date.now()}`, title: '', url: '' }]);
  };

  const handleRemoveDriveLink = (id: string) => {
    setDriveLinks(driveLinks.filter(link => link.id !== id));
  };

  const handleSave = async () => {
    await updateContent.mutateAsync({
      chapterId: chapterId!,
      video_enabled: videoEnabled,
      youtube_url: youtubeUrl || null,
      drive_video_url: driveVideoUrl || null,
      audio_enabled: audioEnabled,
      audio_url: audioUrl || null,
      audio_downloadable: audioDownloadable,
      pdf_enabled: pdfEnabled,
      pdf_url: pdfUrl || null,
      pdf_external_link: pdfExternalLink || null,
      pdf_downloadable: pdfDownloadable,
      drive_links_enabled: driveLinksEnabled,
      drive_links: driveLinks,
      mind_map_enabled: mindMapEnabled,
      mind_map_url: mindMapUrl || null,
      notes_enabled: notesEnabled,
      notes_content: notesContent || null,
    });
  };

  return (
    <AdminLayout 
      title={`Edit: ${chapter.name}`}
      subtitle={`${classData?.name || 'Loading...'} / Chapter ${chapter.chapter_order + 1}`}
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link to={`/admin/classes/${chapter.class_id}`}>
          <Button variant="ghost" className="gap-2 -ml-2">
            <ChevronLeft className="h-4 w-4" />
            Back to {classData?.name || 'Class'}
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Link to={`/chapter/${chapter.id}`} target="_blank">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </Link>
          <Button className="gap-2" onClick={handleSave} disabled={updateContent.isPending}>
            <Save className="h-4 w-4" />
            {updateContent.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Content Editor */}
      <Tabs defaultValue="video" className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-1">
          <TabsTrigger value="video" className="gap-2 py-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Video</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="gap-2 py-2">
            <Headphones className="h-4 w-4" />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="pdf" className="gap-2 py-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </TabsTrigger>
          <TabsTrigger value="drive" className="gap-2 py-2">
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Drive</span>
          </TabsTrigger>
          <TabsTrigger value="mindmap" className="gap-2 py-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Mind Map</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2 py-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
        </TabsList>

        {/* Video Section */}
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Video Lecture
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="videoEnabled">Enable</Label>
                  <Switch
                    id="videoEnabled"
                    checked={videoEnabled}
                    onCheckedChange={setVideoEnabled}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
                <Input
                  id="youtubeUrl"
                  placeholder="https://www.youtube.com/embed/..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={!videoEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  Use the embed URL format: https://www.youtube.com/embed/VIDEO_ID
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="driveVideoUrl">Google Drive Video URL</Label>
                <Input
                  id="driveVideoUrl"
                  placeholder="https://drive.google.com/..."
                  value={driveVideoUrl}
                  onChange={(e) => setDriveVideoUrl(e.target.value)}
                  disabled={!videoEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio Section */}
        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  Audio Lecture
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="audioEnabled">Enable</Label>
                  <Switch
                    id="audioEnabled"
                    checked={audioEnabled}
                    onCheckedChange={setAudioEnabled}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audioUrl">Audio URL</Label>
                <Input
                  id="audioUrl"
                  placeholder="https://example.com/audio.mp3"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  disabled={!audioEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a direct URL to an audio file (MP3, WAV, etc.)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="audioDownloadable"
                  checked={audioDownloadable}
                  onCheckedChange={setAudioDownloadable}
                  disabled={!audioEnabled}
                />
                <Label htmlFor="audioDownloadable">Allow students to download</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PDF Section */}
        <TabsContent value="pdf">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  PDF Notes
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="pdfEnabled">Enable</Label>
                  <Switch
                    id="pdfEnabled"
                    checked={pdfEnabled}
                    onCheckedChange={setPdfEnabled}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdfUrl">PDF URL</Label>
                <Input
                  id="pdfUrl"
                  placeholder="https://example.com/notes.pdf"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  disabled={!pdfEnabled}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="pdfExternalLink">Or External PDF Link</Label>
                <Input
                  id="pdfExternalLink"
                  placeholder="https://drive.google.com/..."
                  value={pdfExternalLink}
                  onChange={(e) => setPdfExternalLink(e.target.value)}
                  disabled={!pdfEnabled}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="pdfDownloadable"
                  checked={pdfDownloadable}
                  onCheckedChange={setPdfDownloadable}
                  disabled={!pdfEnabled}
                />
                <Label htmlFor="pdfDownloadable">Allow students to download</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drive Links Section */}
        <TabsContent value="drive">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  Google Drive Links
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="driveLinksEnabled">Enable</Label>
                  <Switch
                    id="driveLinksEnabled"
                    checked={driveLinksEnabled}
                    onCheckedChange={setDriveLinksEnabled}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {driveLinks.map((link, index) => (
                <div key={link.id} className="flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Link title"
                      value={link.title}
                      onChange={(e) => {
                        const updated = [...driveLinks];
                        updated[index].title = e.target.value;
                        setDriveLinks(updated);
                      }}
                      disabled={!driveLinksEnabled}
                    />
                    <Input
                      placeholder="https://drive.google.com/..."
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...driveLinks];
                        updated[index].url = e.target.value;
                        setDriveLinks(updated);
                      }}
                      disabled={!driveLinksEnabled}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveDriveLink(link.id)}
                    disabled={!driveLinksEnabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleAddDriveLink}
                disabled={!driveLinksEnabled}
              >
                <Plus className="h-4 w-4" />
                Add Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mind Map Section */}
        <TabsContent value="mindmap">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Mind Map
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="mindMapEnabled">Enable</Label>
                  <Switch
                    id="mindMapEnabled"
                    checked={mindMapEnabled}
                    onCheckedChange={setMindMapEnabled}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mindMapUrl">Mind Map URL (Image or PDF)</Label>
                <Input
                  id="mindMapUrl"
                  placeholder="https://example.com/mindmap.png"
                  value={mindMapUrl}
                  onChange={(e) => setMindMapUrl(e.target.value)}
                  disabled={!mindMapEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL to an image (PNG, JPG) or PDF file
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Section */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Notes & Key Concepts
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="notesEnabled">Enable</Label>
                  <Switch
                    id="notesEnabled"
                    checked={notesEnabled}
                    onCheckedChange={setNotesEnabled}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notesContent">Notes Content (Markdown supported)</Label>
                <Textarea
                  id="notesContent"
                  placeholder="## Key Concepts&#10;&#10;Write your notes here using markdown..."
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  disabled={!notesEnabled}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminChapterEditor;
