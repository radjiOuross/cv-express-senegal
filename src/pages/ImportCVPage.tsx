import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { saveFormData } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2, Check, AlertTriangle, ArrowRight, Sparkles, X } from "lucide-react";
import { FormData } from "@/types/cv";

interface CVRecommendation {
  type: "improvement" | "missing" | "tip";
  section: string;
  message: string;
}

interface ParsedCV {
  formData: FormData;
  recommendations: CVRecommendation[];
  score: number;
  summary: string;
}

const ImportCVPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"upload" | "analyzing" | "results">("upload");
  const [parsed, setParsed] = useState<ParsedCV | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (f: File) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg"];
    if (!allowed.includes(f.type)) {
      toast({ title: "Format non supporté", description: "Envoie un fichier PDF, DOCX, PNG ou JPG.", variant: "destructive" });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Le fichier doit faire moins de 10 Mo.", variant: "destructive" });
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setStep("analyzing");

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("ai-parse-cv", {
        body: { fileBase64: base64, fileName: file.name, fileType: file.type },
      });

      if (error) throw error;
      setParsed(data);
      setStep("results");
    } catch (err) {
      console.error("Parse error:", err);
      toast({ title: "Erreur d'analyse", description: "Impossible d'analyser ce fichier. Réessaie avec un autre format.", variant: "destructive" });
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  const applyAndEdit = () => {
    if (!parsed) return;
    saveFormData(parsed.formData);
    toast({ title: "CV importé !", description: "Les données ont été pré-remplies. Tu peux les modifier." });
    navigate("/creer");
  };

  const applyAndGenerate = () => {
    if (!parsed) return;
    saveFormData(parsed.formData);
    navigate("/generation");
  };

  const scoreColor = (s: number) => s < 50 ? "text-destructive" : s < 75 ? "text-orange-500" : "text-primary";
  const typeIcon = (t: string) => t === "improvement" ? "🔧" : t === "missing" ? "⚠️" : "💡";
  const typeLabel = (t: string) => t === "improvement" ? "Amélioration" : t === "missing" ? "Manquant" : "Conseil";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>CVExpress</span>
        <div className="flex gap-3">
          <button onClick={() => navigate("/creer")} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">
            Créer de zéro
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            📄 Importe ton ancien CV
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload ton CV existant et l'IA l'analyse, extrait les données et te donne des recommandations pour l'améliorer
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Drop zone */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  dragActive ? "border-primary bg-primary/5 scale-[1.01]" : file ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} Mo</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Changer de fichier
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">Glisse ton CV ici</p>
                      <p className="text-sm text-muted-foreground mt-1">ou clique pour sélectionner un fichier</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {["PDF", "DOCX", "PNG", "JPG"].map((fmt) => (
                        <span key={fmt} className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">{fmt}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {file && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  <button onClick={analyze} className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4">
                    <Sparkles className="w-5 h-5" /> Analyser avec l'IA
                  </button>
                </motion.div>
              )}

              <div className="mt-10 grid md:grid-cols-3 gap-4">
                {[
                  { icon: "📤", title: "Upload", desc: "Envoie ton CV en PDF, DOCX ou image" },
                  { icon: "🤖", title: "Analyse IA", desc: "L'IA extrait tes données et évalue ton CV" },
                  { icon: "✨", title: "Amélioration", desc: "Reçois des recommandations personnalisées" },
                ].map((s) => (
                  <div key={s.title} className="glass-card text-center p-6">
                    <span className="text-3xl">{s.icon}</span>
                    <h3 className="font-semibold text-foreground mt-3">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Loader2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">Analyse en cours...</p>
              <p className="text-muted-foreground text-sm">L'IA lit ton CV et prépare des recommandations</p>
              <div className="mt-8 w-64 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 15, ease: "linear" }} />
              </div>
            </motion.div>
          )}

          {step === "results" && parsed && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Score card */}
              <div className="glass-card p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                      <circle cx="60" cy="60" r="50" fill="none"
                        stroke={parsed.score < 50 ? "hsl(0,84%,60%)" : parsed.score < 75 ? "hsl(30,90%,55%)" : "hsl(149,100%,33%)"}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={2 * Math.PI * 50 * (1 - parsed.score / 100)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-3xl font-bold ${scoreColor(parsed.score)}`}>{parsed.score}%</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Score de ton CV actuel</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">{parsed.summary}</p>
              </div>

              {/* Extracted data summary */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Données extraites
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Nom", value: `${parsed.formData.personal?.prenom || ""} ${parsed.formData.personal?.nom || ""}`.trim() || "—" },
                    { label: "Poste", value: parsed.formData.personal?.poste || "—" },
                    { label: "Expériences", value: `${parsed.formData.experiences?.length || 0}` },
                    { label: "Compétences", value: `${parsed.formData.skills?.length || 0}` },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted/50 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-foreground text-sm truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {parsed.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground text-lg">🎯 Recommandations de l'IA</h3>
                  {parsed.recommendations.map((rec, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className={`glass-card p-4 border-l-4 ${
                        rec.type === "missing" ? "border-l-destructive" : rec.type === "improvement" ? "border-l-orange-400" : "border-l-primary"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{typeIcon(rec.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              rec.type === "missing" ? "bg-destructive/10 text-destructive" : rec.type === "improvement" ? "bg-orange-100 text-orange-700" : "bg-primary/10 text-primary"
                            }`}>
                              {typeLabel(rec.type)}
                            </span>
                            <span className="text-xs text-muted-foreground">{rec.section}</span>
                          </div>
                          <p className="text-sm text-foreground">{rec.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <button onClick={applyAndEdit} className="px-6 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors">
                  ✏️ Modifier avant de générer
                </button>
                <button onClick={applyAndGenerate} className="btn-primary py-4 flex items-center justify-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5" /> Générer directement avec l'IA <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <button onClick={() => { setStep("upload"); setFile(null); setParsed(null); }}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                ← Importer un autre CV
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ImportCVPage;
