import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadFormData } from "@/lib/storage";
import { FormData, AIData } from "@/types/cv";
import { CVCustomization, loadCustomization, saveCustomization, loadGoogleFont } from "@/types/customization";
import CVPrestige from "@/components/cv/CVPrestige";
import CVTech from "@/components/cv/CVTech";
import CVCreative from "@/components/cv/CVCreative";
import CVExecutive from "@/components/cv/CVExecutive";
import CustomizationPanel from "@/components/CustomizationPanel";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CoverLetterModal from "@/components/CoverLetterModal";
import { Download, FileText, Mail, Search, Palette, Loader2, Video } from "lucide-react";
import { toast } from "sonner";

const TEMPLATES = [
  { key: "prestige", label: "Prestige" },
  { key: "tech", label: "Tech" },
  { key: "creative", label: "Créatif" },
  { key: "executive", label: "Executive" },
];

const PreviewPage = () => {
  const navigate = useNavigate();
  const cvRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState("prestige");
  const [customization, setCustomization] = useState<CVCustomization>(loadCustomization());
  const [panelOpen, setPanelOpen] = useState(false);
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("fr");
  const [downloading, setDownloading] = useState(false);

  const formData = loadFormData() as FormData;
  const aiDataRaw = localStorage.getItem("cvexpress_ai_data");
  const originalAiData: AIData | null = aiDataRaw ? JSON.parse(aiDataRaw) : null;
  const [aiData, setAiData] = useState<AIData | null>(originalAiData);

  const handleCustomizationChange = useCallback((c: CVCustomization) => {
    setCustomization(c);
    saveCustomization(c);
    loadGoogleFont(c.font.display);
    loadGoogleFont(c.font.body);
  }, []);

  const handleDownload = async () => {
    if (downloading || !cvRef.current) return;
    setDownloading(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = cvRef.current;

      await html2pdf()
        .set({
          margin: 0,
          filename: `CV_${formData.personal.prenom}_${formData.personal.nom}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();

      toast.success("CV téléchargé !");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setDownloading(false);
    }
  };

  if (!formData?.personal?.prenom) {
    navigate("/creer");
    return null;
  }

  const renderCV = () => {
    const props = { formData, aiData, customization };
    switch (template) {
      case "tech": return <CVTech {...props} />;
      case "creative": return <CVCreative {...props} />;
      case "executive": return <CVExecutive {...props} />;
      default: return <CVPrestige {...props} />;
    }
  };

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
        </div>
      </nav>

      <CustomizationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        customization={customization}
        onChange={handleCustomizationChange}
      />

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
          <h2 className="text-lg font-semibold text-foreground mb-3">Choisis ton template</h2>
          <div className="flex gap-2 flex-wrap">
            {TEMPLATES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTemplate(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  template === t.key
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-card-foreground border-border hover:border-primary/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 px-6 py-3 font-semibold hover:brightness-110 transition disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {downloading ? "Génération..." : "Télécharger PDF"}
          </button>
          <button
            onClick={() => setPanelOpen(true)}
            className="bg-secondary text-secondary-foreground rounded-lg flex items-center gap-2 px-4 py-3 font-medium hover:brightness-95 transition"
          >
            <Palette className="w-4 h-4" /> Personnaliser
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

        {/* CV Preview */}
        <div className="flex justify-center">
          <div className="shadow-2xl rounded-xl overflow-hidden" ref={cvRef}>
            {renderCV()}
          </div>
        </div>
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
