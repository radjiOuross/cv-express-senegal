import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadFormData } from "@/lib/storage";
import { FormData, AIData, TemplateName } from "@/types/cv";
import CVClassique from "@/components/cv/CVClassique";
import CVModerne from "@/components/cv/CVModerne";
import CVMinimaliste from "@/components/cv/CVMinimaliste";
import CVElegant from "@/components/cv/CVElegant";
import CVAudacieux from "@/components/cv/CVAudacieux";
import CVNature from "@/components/cv/CVNature";
import CVCorporate from "@/components/cv/CVCorporate";
import { Download, FileText, Check } from "lucide-react";

const PreviewPage = () => {
  const navigate = useNavigate();
  const [template, setTemplate] = useState<TemplateName>("classique");
  const cvRef = useRef<HTMLDivElement>(null);

  const formData = loadFormData() as FormData;
  const aiDataRaw = localStorage.getItem("cvexpress_ai_data");
  const aiData: AIData | null = aiDataRaw ? JSON.parse(aiDataRaw) : null;

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
        filename: `CV_${formData.personal.prenom}_${formData.personal.nom}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(cvRef.current)
      .save();
  };

  const templates: { key: TemplateName; label: string; colors: string[]; layout: string }[] = [
    { key: "classique", label: "Classique", colors: ["#1B3A6B", "#E8B84B", "#fff"], layout: "sidebar" },
    { key: "moderne", label: "Moderne", colors: ["#00A651", "#007a3d", "#fff"], layout: "header" },
    { key: "minimaliste", label: "Minimaliste", colors: ["#fafafa", "#222", "#999"], layout: "minimal" },
    { key: "elegant", label: "Élégant", colors: ["#fff", "#C9A84C", "#333"], layout: "centered" },
    { key: "audacieux", label: "Audacieux", colors: ["#1a1a2e", "#e94560", "#16213e"], layout: "dark-sidebar" },
    { key: "nature", label: "Nature", colors: ["#2d6a4f", "#f5f0e8", "#95d5b2"], layout: "nature" },
    { key: "corporate", label: "Corporate", colors: ["#003580", "#fff", "#e8f0fe"], layout: "corporate" },
  ];

  const renderMiniPreview = (t: typeof templates[0]) => {
    const [c1, c2, c3] = t.colors;
    if (t.layout === "sidebar") {
      return (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "35%", backgroundColor: c1 }} />
          <div style={{ position: "absolute", left: "15%", top: 8, width: 10, height: 10, borderRadius: "50%", border: `1px solid ${c2}` }} />
          <div style={{ position: "absolute", right: 8, top: 10, width: "50%", height: 3, backgroundColor: c1, borderRadius: 1 }} />
          <div style={{ position: "absolute", right: 8, top: 18, width: "45%", height: 2, backgroundColor: "#ddd", borderRadius: 1 }} />
          <div style={{ position: "absolute", right: 8, top: 24, width: "48%", height: 2, backgroundColor: "#ddd", borderRadius: 1 }} />
        </>
      );
    }
    if (t.layout === "header") {
      return (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "25%", background: `linear-gradient(135deg, ${c1}, ${c2})` }} />
          <div style={{ position: "absolute", left: 8, top: 30, width: "40%", height: 2, backgroundColor: c1 }} />
          <div style={{ position: "absolute", left: 8, top: 36, width: "35%", height: 2, backgroundColor: "#ddd" }} />
          <div style={{ position: "absolute", right: 8, top: 30, width: "40%", height: 2, backgroundColor: c1 }} />
          <div style={{ position: "absolute", right: 8, top: 36, width: "35%", height: 2, backgroundColor: "#ddd" }} />
        </>
      );
    }
    if (t.layout === "minimal") {
      return (
        <>
          <div style={{ position: "absolute", left: 10, top: 10, width: "60%", height: 5, backgroundColor: c2 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 22, height: 1, backgroundColor: c2 }} />
          <div style={{ position: "absolute", left: 8, top: 28, width: "30%", height: 2, backgroundColor: c3 }} />
          <div style={{ position: "absolute", right: 8, top: 28, width: "50%", height: 2, backgroundColor: "#ddd" }} />
        </>
      );
    }
    if (t.layout === "centered") {
      return (
        <>
          <div style={{ position: "absolute", left: 10, right: 10, top: 6, height: 1, backgroundColor: c2 }} />
          <div style={{ position: "absolute", left: "25%", right: "25%", top: 12, height: 4, backgroundColor: c3, borderRadius: 1 }} />
          <div style={{ position: "absolute", left: "30%", right: "30%", top: 20, height: 2, backgroundColor: "#ccc" }} />
          <div style={{ position: "absolute", left: 10, right: 10, top: 28, height: 1, backgroundColor: c2 }} />
          <div style={{ position: "absolute", left: 8, top: 34, width: "28%", height: 2, backgroundColor: "#ddd" }} />
          <div style={{ position: "absolute", left: "36%", top: 34, width: "28%", height: 2, backgroundColor: "#ddd" }} />
          <div style={{ position: "absolute", right: 8, top: 34, width: "28%", height: 2, backgroundColor: "#ddd" }} />
        </>
      );
    }
    if (t.layout === "dark-sidebar") {
      return (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, right: 0, backgroundColor: c1 }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "35%", backgroundColor: c3 }} />
          <div style={{ position: "absolute", left: "12%", top: 10, width: 12, height: 12, borderRadius: "50%", border: `1.5px solid ${c2}` }} />
          <div style={{ position: "absolute", left: "42%", top: 10, width: "50%", height: 3, backgroundColor: c2, borderRadius: 1 }} />
          <div style={{ position: "absolute", left: "42%", top: 18, width: "45%", height: 2, backgroundColor: "#444", borderRadius: 1 }} />
        </>
      );
    }
    if (t.layout === "nature") {
      return (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "22%", backgroundColor: c1 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "22%", bottom: 0, backgroundColor: c2 }} />
          <div style={{ position: "absolute", left: 6, top: 28, width: "35%", height: 60, backgroundColor: "#fff", borderRadius: 4 }} />
          <div style={{ position: "absolute", right: 8, top: 30, width: "50%", height: 2, backgroundColor: c1 }} />
          <div style={{ position: "absolute", right: 8, top: 36, width: "45%", height: 2, backgroundColor: "#ccc" }} />
        </>
      );
    }
    // corporate
    return (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "20%", backgroundColor: c1 }} />
        <div style={{ position: "absolute", left: 10, top: 24, height: 5, borderRadius: 2, backgroundColor: c1, width: "35%" }} />
        <div style={{ position: "absolute", left: 10, top: 34, width: "25%", height: 10, backgroundColor: c3, borderRadius: 3 }} />
        <div style={{ position: "absolute", left: "40%", top: 34, width: "25%", height: 10, backgroundColor: c3, borderRadius: 3 }} />
        <div style={{ position: "absolute", right: 10, top: 34, width: "25%", height: 10, backgroundColor: c3, borderRadius: 3 }} />
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          CVExpress
        </span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        {/* Template selector - horizontal scrollable */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Choisis ton template</h2>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
            {templates.map((t) => (
              <button
                key={t.key}
                onClick={() => setTemplate(t.key)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div
                  className="relative rounded-lg overflow-hidden transition-all"
                  style={{
                    width: 80,
                    height: 110,
                    border: template === t.key ? "2.5px solid #00A651" : "2px solid #e5e5e5",
                    boxShadow: template === t.key ? "0 0 0 2px rgba(0,166,81,0.2)" : "none",
                    backgroundColor: t.colors[0] === "#fff" || t.colors[0] === "#fafafa" ? "#fafafa" : t.colors[0],
                  }}
                >
                  {renderMiniPreview(t)}
                  {template === t.key && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${template === t.key ? "text-primary" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-8">
          <button onClick={handleDownload} className="btn-primary flex items-center justify-center gap-2 px-6 py-3">
            <Download className="w-5 h-5" />
            Télécharger PDF — 2000 FCFA
          </button>
          <button
            onClick={() => navigate("/creer")}
            className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Modifier les infos
          </button>
        </div>

        {/* CV Preview */}
        <div className="flex justify-center">
          <div className="shadow-2xl rounded-lg overflow-hidden" style={{ width: 794 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={template}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                ref={cvRef}
              >
                {template === "classique" && <CVClassique formData={formData} aiData={aiData} />}
                {template === "moderne" && <CVModerne formData={formData} aiData={aiData} />}
                {template === "minimaliste" && <CVMinimaliste formData={formData} aiData={aiData} />}
                {template === "elegant" && <CVElegant formData={formData} aiData={aiData} />}
                {template === "audacieux" && <CVAudacieux formData={formData} aiData={aiData} />}
                {template === "nature" && <CVNature formData={formData} aiData={aiData} />}
                {template === "corporate" && <CVCorporate formData={formData} aiData={aiData} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewPage;
