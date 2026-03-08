import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import FormPage from "./pages/FormPage";
import LoadingPage from "./pages/LoadingPage";
import PreviewPage from "./pages/PreviewPage";
import AnalysePage from "./pages/AnalysePage";
import ValidatePage from "./pages/ValidatePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ImportCVPage from "./pages/ImportCVPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import VideoCVScriptPage from "./pages/VideoCVScriptPage";
import VideoCVRecordPage from "./pages/VideoCVRecordPage";
import VideoCVPreviewPage from "./pages/VideoCVPreviewPage";
import CoachButton from "./components/CoachButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/importer" element={<ImportCVPage />} />
            <Route path="/creer" element={<FormPage />} />
            <Route path="/generation" element={<LoadingPage />} />
            <Route path="/apercu" element={<PreviewPage />} />
            <Route path="/analyser" element={<AnalysePage />} />
            <Route path="/valider" element={<ValidatePage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profil/:slug" element={<ProfilePage />} />
            <Route path="/video-cv/script" element={<VideoCVScriptPage />} />
            <Route path="/video-cv/enregistrement" element={<VideoCVRecordPage />} />
            <Route path="/video-cv/preview" element={<VideoCVPreviewPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CoachButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
