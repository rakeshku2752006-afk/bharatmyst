import { Video, FileText, Headphones, Brain, Download, Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAllVideoLectures, useAllPdfNotes, useAllMindMaps, useAllAudioLectures } from '@/hooks/useAllContent';

const FeaturesSection = () => {
  const { data: videos } = useAllVideoLectures();
  const { data: pdfs } = useAllPdfNotes();
  const { data: mindMaps } = useAllMindMaps();
  const { data: audios } = useAllAudioLectures();

  const features = [
    {
      icon: Video,
      title: 'Video Lectures',
      description: 'High-quality video explanations by expert teachers',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      hoverBorder: 'hover:border-blue-500/40',
      hoverText: 'group-hover:text-blue-500',
      btnColor: 'bg-blue-500 hover:bg-blue-600',
      to: '/video-lectures',
      count: videos?.length || 0,
      countLabel: 'videos available',
    },
    {
      icon: FileText,
      title: 'PDF Notes',
      description: 'Comprehensive notes with formulas and examples',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      hoverBorder: 'hover:border-green-500/40',
      hoverText: 'group-hover:text-green-600',
      btnColor: 'bg-green-600 hover:bg-green-700',
      to: '/pdf-notes',
      count: pdfs?.length || 0,
      countLabel: 'notes available',
    },
    {
      icon: Headphones,
      title: 'Audio Lectures',
      description: 'Learn on-the-go with audio content',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      hoverBorder: 'hover:border-purple-500/40',
      hoverText: 'group-hover:text-purple-500',
      btnColor: 'bg-purple-600 hover:bg-purple-700',
      to: '/audio-lectures',
      count: audios?.length || 0,
      countLabel: 'audios available',
    },
    {
      icon: Brain,
      title: 'Mind Maps',
      description: 'Visual summaries for quick revision',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      hoverBorder: 'hover:border-orange-500/40',
      hoverText: 'group-hover:text-orange-500',
      btnColor: 'bg-orange-500 hover:bg-orange-600',
      to: '/mind-maps',
      count: mindMaps?.length || 0,
      countLabel: 'maps available',
    },
    {
      icon: Download,
      title: 'Downloadable',
      description: 'Download materials for offline study',
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      hoverBorder: 'hover:border-teal-500/40',
      hoverText: 'group-hover:text-teal-500',
      btnColor: 'bg-teal-600 hover:bg-teal-700',
      to: '/pdf-notes',
      count: null,
      countLabel: '',
    },
    {
      icon: Bookmark,
      title: 'Bookmarks',
      description: 'Save chapters for quick access later',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      hoverBorder: 'hover:border-pink-500/40',
      hoverText: 'group-hover:text-pink-500',
      btnColor: 'bg-pink-500 hover:bg-pink-600',
      to: '/classes',
      count: null,
      countLabel: '',
    },
  ];

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
            <Link
              key={feature.title}
              to={feature.to}
              className={`group p-6 bg-card rounded-xl border border-border/50 ${feature.hoverBorder} hover:shadow-soft transition-all duration-300 hover:-translate-y-1 block`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${feature.hoverText} transition-colors`}>
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {feature.description}
              </p>

              {/* Count badge */}
              {feature.count !== null && (
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${feature.bgColor} ${feature.color}`}>
                    {feature.count > 0
                      ? `${feature.count} ${feature.countLabel}`
                      : 'Coming Soon'}
                  </span>
                  <ArrowRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 ${feature.color} transition-all duration-200 group-hover:translate-x-1`} />
                </div>
              )}
              {feature.count === null && (
                <div className="flex justify-end">
                  <ArrowRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 ${feature.color} transition-all duration-200 group-hover:translate-x-1`} />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
