import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/favicon.png" alt="BHARATMYST Logo" className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-bold tracking-tight">
                <span className="text-primary">BHARAT</span>
                <span className="text-accent">MYST</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your trusted partner for academic excellence. Quality education resources for Classes 9-12 students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Classes</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/classes" className="hover:text-primary transition-colors">Class 9</Link></li>
              <li><Link to="/classes" className="hover:text-primary transition-colors">Class 10</Link></li>
              <li><Link to="/classes" className="hover:text-primary transition-colors">Class 11</Link></li>
              <li><Link to="/classes" className="hover:text-primary transition-colors">Class 12</Link></li>
              <li><Link to="/classes" className="hover:text-primary transition-colors">View All Classes</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/pdf-notes" className="hover:text-primary transition-colors">Study Materials</Link></li>
              <li><Link to="/video-lectures" className="hover:text-primary transition-colors">Video Lectures</Link></li>
              <li><Link to="/audio-lectures" className="hover:text-primary transition-colors">Audio Lectures</Link></li>
              <li><Link to="/mind-maps" className="hover:text-primary transition-colors">Mind Maps & Downloads</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-lg md:text-xl font-bold tracking-wide">
            <span className="text-primary">CEO - </span>
            <span className="text-accent">ROHIT RAJ JAIN</span>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 BHARATMYST. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
