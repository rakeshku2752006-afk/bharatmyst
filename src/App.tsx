import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClassesPage from "./pages/ClassesPage";
import ClassPage from "./pages/ClassPage";
import ChapterPage from "./pages/ChapterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminClassDetail from "./pages/admin/AdminClassDetail";
import AdminChapterEditor from "./pages/admin/AdminChapterEditor";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import VideoLecturesPage from "./pages/VideoLecturesPage";
import PdfNotesPage from "./pages/PdfNotesPage";
import MindMapsPage from "./pages/MindMapsPage";
import AudioLecturesPage from "./pages/AudioLecturesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/class/:classId" element={<ClassPage />} />
          <Route path="/chapter/:chapterId" element={<ChapterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/video-lectures" element={<VideoLecturesPage />} />
          <Route path="/pdf-notes" element={<PdfNotesPage />} />
          <Route path="/mind-maps" element={<MindMapsPage />} />
          <Route path="/audio-lectures" element={<AudioLecturesPage />} />
          
          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

          {/* Admin Routes - Protected by login */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/classes" element={<AdminProtectedRoute><AdminClasses /></AdminProtectedRoute>} />
          <Route path="/admin/classes/:classId" element={<AdminProtectedRoute><AdminClassDetail /></AdminProtectedRoute>} />
          <Route path="/admin/chapters/:chapterId" element={<AdminProtectedRoute><AdminChapterEditor /></AdminProtectedRoute>} />
          <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
