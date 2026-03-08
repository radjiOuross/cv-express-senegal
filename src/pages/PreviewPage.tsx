import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadFormData } from "@/lib/storage";
import { FormData, AIData } from "@/types/cv";
import { supabase } from "@/integrations/supabase/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CoverLetterModal from "@/components/CoverLetterModal";
import { Download, FileText, Mail, Search, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const RR_TEMPLATES = [
  { key: "azurill", label: "Azurill" },
  { key: "bronzor", label: "Bronzor" },
  { key: "chikorita", label: "Chikorita" },
  { key: "darkrai", label: "Darkrai" },
  { key: "ditgar", label: "Ditgar" },
  { key: "ditto", label: "Ditto" },
  { key: "gengar", label: "Gengar" },
  { key: "glalie", label: "Glalie" },
  { key: "kakuna", label: "Kakuna" },
  { key: "lapras", label: "Lapras" },
  { key: "leafish", label: "Leafish" },
  { key: "nosepass", label: "Nosepass" },
  { key: "onyx", label: "Onyx" },
  { key: "pikachu", label: "Pikachu" },
  { key: "rhyhorn", label: "Rhyhorn" },
];

const PreviewPage = () => {
  const navigate = useNavigate();
  const [template, setTemplate] = useState("azurill");
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("fr");
  const [downloading, setDownloading] = useState(false);
  const [changingTemplate, setChangingTemplate] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const formData = loadFormData() as FormData;
  const aiDataRaw = localStorage.getItem("cvexpress_ai_data");
  const originalAiData: AIData | null = aiDataRaw ? JSON.parse(aiDataRaw) : null;
  const [aiData, setAiData] = useState<AIData | null>(originalAiData);

  const resumeId = localStorage.getItem("cvexpress_rr_resume_id");
  const publicUrl = localStorage.getItem("cvexpress_rr_public_url");

  const handleChangeTemplate = useCallback(async (newTemplate: string) => {
    if (!resumeId || newTemplate === template) return;
    setChangingTemplate(true);
    setTemplate(newTemplate);

    try {
      const { data, error } = await supabase.functions.invoke("reactive-resume-export", {
        body: { action: "change-template", resumeId, template: newTemplate },
      });
      if (error) throw error;

      // Update public URL if returned
      if (data?.publicUrl) {
        localStorage.setItem("cvexpress_rr_public_url", data.publicUrl);
      }

      // Refresh iframe
      setIframeKey((k) => k + 1);
      toast.success(`Template "${newTemplate}" appliqué !`);
    } catch (err) {
      console.error("Template change error:", err);
      toast.error("Erreur lors du changement de template");
    } finally {
      setChangingTemplate(false);
    }
  }, [resumeId, template]);

  const handleDownload = async () => {
    if (downloading || !resumeId) return;
    setDownloading(true);

    try {
      toast.info("Génération du PDF...");
      const { data, error } = await supabase.functions.invoke("reactive-resume-export", {
        body: { action: "pdf", resumeId },
      });
      if (error) throw error;
      if (!data?.pdfUrl) throw new Error("No PDF URL");

      const link = document.createElement("a");
      link.href = data.pdfUrl;
      link.download = `CV_${formData.personal.prenom}_${formData.personal.nom}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CV téléchargé !");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Erreur lors du téléchargement du PDF");
    } finally {
      setDownloading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't cleanup - user might come back
    };
  }, []);

  if (!formData?.personal?.prenom) {
    navigate("/creer");
    return null;
  }

  const noRR = !resumeId;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border">
        <span className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          CVExpress
        </span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/analyser")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Search className="w-4 h-4" /> Analyser une offre
          </button>
          {publicUrl && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ExternalLink className="w-4 h-4" /> Voir sur Reactive Resume
            </a>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        {/* Language Switcher */}
        <div className="my-4">
          <LanguageSwitcher
            aiData={originalAiData}
            onTranslated={setAiData}
            currentLang={currentLang}
            onLangChange={setCurrentLang}
          />
        </div>

        {/* Template Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Choisis ton template Reactive Resume</h2>
          <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: "thin" }}>
            {RR_TEMPLATES.map((t) => (
              <button
                key={t.key}
                onClick={() => handleChangeTemplate(t.key)}
                disabled={changingTemplate}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  template === t.key
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-card-foreground border-border hover:border-primary/50"
                } disabled:opacity-50`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {changingTemplate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Changement de template...
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={handleDownload}
            disabled={downloading || noRR}
            className="bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 px-6 py-3 font-semibold hover:brightness-110 transition disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {downloading ? "Génération..." : "Télécharger PDF"}
          </button>
          <button
            onClick={() => setIframeKey((k) => k + 1)}
            className="bg-secondary text-secondary-foreground rounded-lg flex items-center gap-2 px-4 py-3 font-medium hover:brightness-95 transition"
          >
            <RefreshCw className="w-4 h-4" /> Rafraîchir
          </button>
          <button
            onClick={() => setCoverLetterOpen(true)}
            className="bg-accent text-accent-foreground rounded-lg flex items-center gap-2 px-4 py-3 font-medium hover:brightness-95 transition"
          >
            <Mail className="w-4 h-4" /> Lettre de motivation
          </button>
          <button
            onClick={() => navigate("/creer")}
            className="bg-muted text-muted-foreground rounded-lg flex items-center gap-2 px-4 py-3 font-medium hover:brightness-95 transition"
          >
            <FileText className="w-4 h-4" /> Modifier les infos
          </button>
        </div>

        {/* CV Preview via iframe */}
        {noRR ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Le CV n'a pas pu être importé sur Reactive Resume.
            </p>
            <button
              onClick={() => navigate("/generation")}
              className="bg-primary text-primary-foreground rounded-lg px-6 py-3 font-semibold"
            >
              Réessayer la génération
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-4xl bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 flex items-center justify-between border-b border-border">
                <span className="text-xs text-muted-foreground font-medium">
                  Aperçu — Template: <span className="text-foreground font-semibold capitalize">{template}</span>
                </span>
                {publicUrl && (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Ouvrir dans Reactive Resume <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <iframe
                key={iframeKey}
                src={publicUrl || "about:blank"}
                className="w-full border-0"
                style={{ height: "1200px" }}
                title="CV Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cover Letter Modal */}
      <CoverLetterModal
        open={coverLetterOpen}
        onClose={() => setCoverLetterOpen(false)}
        formData={formData}
        aiData={aiData}
      />
    </motion.div>
  );
};

export default PreviewPage;
