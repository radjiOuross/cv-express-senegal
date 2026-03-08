import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadFormData } from "@/lib/storage";
import { FormData, AIData, TemplateName } from "@/types/cv";
import { CVCustomization, loadCustomization, saveCustomization } from "@/types/customization";
import CVExecutive from "@/components/cv/CVExecutive";
import CVCreative from "@/components/cv/CVCreative";
import CVPrestige from "@/components/cv/CVPrestige";
import CVTech from "@/components/cv/CVTech";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CoverLetterModal from "@/components/CoverLetterModal";
import CVValidationSection from "@/components/CVValidationSection";
import CustomizationPanel from "@/components/CustomizationPanel";
import { Download, FileText, Check, Mail, Search, Palette } from "lucide-react";

const PreviewPage = () => {
  const navigate = useNavigate();
  const [template, setTemplate] = useState<TemplateName>("executive");
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("fr");
  const [panelOpen, setPanelOpen] = useState(false);
  const [customization, setCustomization] = useState<CVCustomization>(loadCustomization);
  const cvRef = useRef<HTMLDivElement>(null);

  const formData = loadFormData() as FormData;
  const aiDataRaw = localStorage.getItem("cvexpress_ai_data");
  const originalAiData: AIData | null = aiDataRaw ? JSON.parse(aiDataRaw) : null;
  const [aiData, setAiData] = useState<AIData | null>(originalAiData);

  useEffect(() => {
    saveCustomization(customization);
  }, [customization]);

  if (!formData?.personal?.prenom) {
    navigate("/creer");
    return null;
  }

  const handleDownload = async () => {
    if (!cvRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 0,
        filename: `CV_${formData.personal.prenom}_${formData.personal.nom}${currentLang !== "fr" ? `_${currentLang}` : ""}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(cvRef.current)
      .save();
  };

  const templates: { key: TemplateName; label: string; colors: string[]; layout: string }[] = [
    { key: "executive", label: "Executive", colors: ["#fff", "#1B3A6B", "#eee"], layout: "executive" },
    { key: "creative", label: "Creative", colors: ["#00A651", "#fff", "#f5f5f5"], layout: "creative" },
    { key: "prestige", label: "Prestige", colors: ["#fff", "#C9A84C", "#333"], layout: "prestige" },
    { key: "tech", label: "Tech", colors: ["#0f0f0f", "#00A651", "#161616"], layout: "tech" },
  ];

  const renderMiniPreview = (t: typeof templates[0]) => {
    const [c1, c2, c3] = t.colors;
    if (t.layout === "executive") {
      return (<>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, backgroundColor: c2 }} />
        <div style={{ position: "absolute", left: 10, top: 10, width: "50%", height: 5, backgroundColor: c2, borderRadius: 1 }} />
        <div style={{ position: "absolute", left: 10, top: 22, width: "35%", height: 2, backgroundColor: "#ddd" }} />
        <div style={{ position: "absolute", right: 8, top: 35, width: "25%", height: 50, backgroundColor: c3, borderRadius: 2 }} />
      </>);
    }
    if (t.layout === "creative") {
      return (<>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "35%", backgroundColor: c1 }} />
        <div style={{ position: "absolute", left: "12%", top: 12, width: 16, height: 16, borderRadius: "50%", backgroundColor: "#fff" }} />
        <div style={{ position: "absolute", right: 10, top: 14, width: "45%", height: 3, backgroundColor: c1, borderRadius: 1 }} />
        <div style={{ position: "absolute", right: 10, top: 24, width: "40%", height: 2, backgroundColor: "#ddd" }} />
      </>);
    }
    if (t.layout === "prestige") {
      return (<>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: `linear-gradient(90deg, ${c2}, #ddd, ${c2})` }} />
        <div style={{ position: "absolute", left: "25%", right: "25%", top: 14, height: 5, backgroundColor: c3, borderRadius: 1 }} />
        <div style={{ position: "absolute", left: "30%", right: "30%", top: 24, height: 1, backgroundColor: c2 }} />
        <div style={{ position: "absolute", left: 12, top: 35, width: 3, height: 50, backgroundColor: c2, borderRadius: 1 }} />
      </>);
    }
    // tech
    return (<>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, right: 0, backgroundColor: c1 }} />
      <div style={{ position: "absolute", left: 8, top: 10, width: "45%", height: 4, backgroundColor: c2, borderRadius: 1 }} />
      <div style={{ position: "absolute", left: 8, top: 20, width: "35%", height: 2, backgroundColor: "#333" }} />
      <div style={{ position: "absolute", right: 6, top: 34, width: "28%", height: 55, backgroundColor: c3, borderRadius: 4 }} />
    </>);
  };

  const skills = aiData?.competences || formData.skills || [];

  const cvProps = { formData, aiData, customization };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background">
      {/* Customization Panel */}
      <CustomizationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        customization={customization}
        onChange={setCustomization}
      />

      {/* Floating button */}
      {!panelOpen && (
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setPanelOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground px-3 py-4 rounded-r-xl shadow-lg hover:brightness-110 transition-all flex flex-col items-center gap-1"
        >
          <Palette className="w-5 h-5" />
          <span className="text-[9px] font-bold writing-vertical" style={{ writingMode: "vertical-lr" }}>Personnaliser</span>
        </motion.button>
      )}

      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>CVExpress</span>
        <button onClick={() => navigate("/analyser")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <Search className="w-4 h-4" /> Analyser une offre
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        {/* Language Switcher */}
        <div className="mb-4">
          <LanguageSwitcher
            aiData={originalAiData}
            onTranslated={setAiData}
            currentLang={currentLang}
            onLangChange={setCurrentLang}
          />
        </div>

        {/* Template selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Choisis ton template</h2>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
            {templates.map((t) => (
              <button key={t.key} onClick={() => setTemplate(t.key)} className="flex-shrink-0 flex flex-col items-center gap-2 group">
                <div className="relative rounded-lg overflow-hidden transition-all" style={{
                  width: 80, height: 110,
                  border: template === t.key ? "2.5px solid #00A651" : "2px solid #e5e5e5",
                  boxShadow: template === t.key ? "0 0 0 2px rgba(0,166,81,0.2)" : "none",
                  backgroundColor: t.colors[0] === "#fff" || t.colors[0] === "#fafafa" ? "#fafafa" : t.colors[0],
                }}>
                  {renderMiniPreview(t)}
                  {template === t.key && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${template === t.key ? "text-primary" : "text-muted-foreground"}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button onClick={handleDownload} className="btn-primary flex items-center justify-center gap-2 px-6 py-3">
            <Download className="w-5 h-5" /> Télécharger PDF — 2000 FCFA
          </button>
          <button onClick={() => setPanelOpen(true)} className="btn-primary-sm flex items-center gap-2 bg-accent text-accent-foreground">
            <Palette className="w-4 h-4" /> 🎨 Personnaliser
          </button>
          <button onClick={() => setCoverLetterOpen(true)} className="btn-primary-sm flex items-center gap-2">
            <Mail className="w-4 h-4" /> 💌 Lettre de motivation
          </button>
          <button onClick={() => navigate("/creer")} className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Modifier les infos
          </button>
        </div>

        {/* CV Preview */}
        <div className="flex justify-center">
          <div className="shadow-2xl rounded-lg overflow-hidden" style={{ width: 794 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${template}-${currentLang}-${JSON.stringify(customization.colors)}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                ref={cvRef}
              >
                {template === "classique" && <CVClassique {...cvProps} />}
                {template === "moderne" && <CVModerne {...cvProps} />}
                {template === "minimaliste" && <CVMinimaliste {...cvProps} />}
                {template === "elegant" && <CVElegant {...cvProps} />}
                {template === "audacieux" && <CVAudacieux {...cvProps} />}
                {template === "nature" && <CVNature {...cvProps} />}
                {template === "corporate" && <CVCorporate {...cvProps} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Validation Section */}
        <CVValidationSection
          skills={skills}
          validations={[]}
          onRequestSent={() => {}}
        />
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
