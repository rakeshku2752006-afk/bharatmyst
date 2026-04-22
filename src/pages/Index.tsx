import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ClassesSection from '@/components/home/ClassesSection';
import FeaturesSection from '@/components/home/FeaturesSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ClassesSection />
      <FeaturesSection />
    </Layout>
  );
};

export default Index;
