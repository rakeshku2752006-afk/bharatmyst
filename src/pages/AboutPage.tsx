import Layout from '@/components/layout/Layout';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Target, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AboutPage = () => {
  const { data: settings, isLoading } = useSiteSettings();

  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Content',
      description: 'Study materials covering all subjects from Class 9 to 12',
    },
    {
      icon: Users,
      title: 'Expert Educators',
      description: 'Content created by experienced teachers and educators',
    },
    {
      icon: Target,
      title: 'Goal-Oriented',
      description: 'Focused learning paths to help you achieve your goals',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Regularly updated content maintaining high standards',
    },
  ];

  return (
    <Layout>
      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            About <span className="text-primary">{settings?.site_name || 'BHARATMYST'}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {settings?.site_description || 'Your one-stop platform for comprehensive learning resources'}
          </p>
        </div>

        {/* About Content */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {settings?.about_content?.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-muted-foreground">
                    {paragraph.startsWith('**') ? (
                      <strong className="text-foreground">
                        {paragraph.replace(/\*\*/g, '')}
                      </strong>
                    ) : paragraph.startsWith('- ') ? (
                      <ul className="list-disc list-inside">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            To democratize quality education by providing accessible, comprehensive, and 
            engaging learning resources that empower students to achieve their academic goals 
            and build a strong foundation for their future.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
