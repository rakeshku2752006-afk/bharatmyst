import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSiteSettings, useUpdateMultipleSiteSettings } from '@/hooks/useSiteSettings';
import { Save, Globe, Bell, Shield, FileText, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateMultipleSiteSettings();
  
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    about_content: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    auto_publish: true,
    email_notifications: false,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        about_content: settings.about_content || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        contact_address: settings.contact_address || '',
        auto_publish: settings.auto_publish === 'true',
        email_notifications: settings.email_notifications === 'true',
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate({
      site_name: formData.site_name,
      site_description: formData.site_description,
      about_content: formData.about_content,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      contact_address: formData.contact_address,
      auto_publish: formData.auto_publish ? 'true' : 'false',
      email_notifications: formData.email_notifications ? 'true' : 'false',
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Settings" subtitle="Configure your learning platform">
        <div className="space-y-6 max-w-2xl">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings" subtitle="Configure your learning platform">
      <div className="space-y-6 max-w-2xl">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">General Settings</CardTitle>
            </div>
            <CardDescription>
              Configure basic information about your platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="Enter site name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={formData.site_description}
                onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                placeholder="Enter site description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* About Page Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">About Page Content</CardTitle>
            </div>
            <CardDescription>
              Edit the content displayed on the About page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aboutContent">About Content</Label>
              <Textarea
                id="aboutContent"
                value={formData.about_content}
                onChange={(e) => setFormData({ ...formData, about_content: e.target.value })}
                placeholder="Enter about page content (supports basic markdown)"
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                Use **text** for bold, - for lists, and separate paragraphs with blank lines.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </div>
            <CardDescription>
              Contact details displayed on the Contact page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactAddress">Address</Label>
              <Textarea
                id="contactAddress"
                value={formData.contact_address}
                onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                placeholder="Enter your address"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Content Settings</CardTitle>
            </div>
            <CardDescription>
              Configure how content is managed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-publish new content</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically publish new classes and chapters when created
                </p>
              </div>
              <Switch
                checked={formData.auto_publish}
                onCheckedChange={(checked) => setFormData({ ...formData, auto_publish: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for new content
                </p>
              </div>
              <Switch
                checked={formData.email_notifications}
                onCheckedChange={(checked) => setFormData({ ...formData, email_notifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          className="gap-2"
          disabled={updateSettings.isPending}
        >
          <Save className="h-4 w-4" />
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
