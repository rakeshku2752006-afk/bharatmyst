import ClassCard from './ClassCard';
import { usePublishedClasses } from '@/hooks/useClasses';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ClassesSection = () => {
  const { data: classes, isLoading } = usePublishedClasses();

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Class</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your class or course to access comprehensive study materials, video lectures, and practice resources — all added by admin.
          </p>
        </div>

        {/* Class Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        ) : classes && classes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {classes.map((classData, index) => (
                <ClassCard key={classData.id} classData={classData} index={index} />
              ))}
            </div>
            {/* View All Link */}
            <div className="text-center mt-10">
              <Link
                to="/classes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-soft hover:scale-105"
              >
                View All Classes & Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No classes available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClassesSection;
