import { Video, FileText, Headphones, Brain, Download, Bookmark } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Video Lectures',
    description: 'High-quality video explanations by expert teachers',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: FileText,
    title: 'PDF Notes',
    description: 'Comprehensive notes with formulas and examples',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Headphones,
    title: 'Audio Lectures',
    description: 'Learn on-the-go with audio content',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Brain,
    title: 'Mind Maps',
    description: 'Visual summaries for quick revision',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Download,
    title: 'Downloadable',
    description: 'Download materials for offline study',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  {
    icon: Bookmark,
    title: 'Bookmarks',
    description: 'Save chapters for quick access later',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-accent">Excel</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the resources you need for comprehensive learning and exam preparation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
