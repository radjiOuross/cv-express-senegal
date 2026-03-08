import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FormPage from "./pages/FormPage";
import LoadingPage from "./pages/LoadingPage";
import PreviewPage from "./pages/PreviewPage";
import AnalysePage from "./pages/AnalysePage";
import ValidatePage from "./pages/ValidatePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/creer" element={<FormPage />} />
          <Route path="/generation" element={<LoadingPage />} />
          <Route path="/apercu" element={<PreviewPage />} />
          <Route path="/analyser" element={<AnalysePage />} />
          <Route path="/valider" element={<ValidatePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
