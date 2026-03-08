import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadFormData } from "@/lib/storage";
import { FormData, AIData, TemplateName } from "@/types/cv";
import CVClassique from "@/components/cv/CVClassique";
import CVModerne from "@/components/cv/CVModerne";
import CVMinimaliste from "@/components/cv/CVMinimaliste";
import { Download, FileText } from "lucide-react";

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

  const templates: { key: TemplateName; label: string; color: string }[] = [
    { key: "classique", label: "Classique", color: "bg-cv-navy" },
    { key: "moderne", label: "Moderne", color: "bg-cv-green" },
    { key: "minimaliste", label: "Minimaliste", color: "bg-foreground/10" },
  ];

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
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Choisis ton template</h2>
            <div className="space-y-3">
              {templates.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTemplate(t.key)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    template === t.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`w-10 h-14 rounded ${t.color}`} />
                  <span className="font-medium text-foreground">{t.label}</span>
                </button>
              ))}
            </div>

            <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Télécharger PDF — 2000 FCFA
            </button>

            <button
              onClick={() => navigate("/creer")}
              className="w-full px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> Modifier les infos
            </button>
          </div>

          {/* CV Preview */}
          <div className="flex justify-center">
            <div className="shadow-2xl rounded-lg overflow-hidden" style={{ width: 794 }}>
              <div ref={cvRef}>
                {template === "classique" && <CVClassique formData={formData} aiData={aiData} />}
                {template === "moderne" && <CVModerne formData={formData} aiData={aiData} />}
                {template === "minimaliste" && <CVMinimaliste formData={formData} aiData={aiData} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewPage;
