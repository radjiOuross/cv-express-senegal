import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadFormData } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AnalysisResult {
  score: number;
  points_forts: { element: string; detail: string }[];
  points_manquants: { element: string; detail: string }[];
  suggestions: string[];
}

const AnalysePage = () => {
  const navigate = useNavigate();
  const [offreText, setOffreText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const formData = loadFormData();
  const aiDataRaw = localStorage.getItem("cvexpress_ai_data");

  const analyze = async () => {
    if (!offreText.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze-job", {
        body: { formData, aiData: aiDataRaw ? JSON.parse(aiDataRaw) : null, offreText },
      });
      if (error) throw error;
      setResult(data.analysis);
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue. Réessaie.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const optimizeForJob = () => {
    localStorage.setItem("cvexpress_job_offer", offreText);
    navigate("/generation");
  };

  const scoreColor = (s: number) => s < 50 ? "hsl(0, 84%, 60%)" : s < 75 ? "hsl(30, 90%, 55%)" : "hsl(149, 100%, 33%)";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>CVExpress</span>
        <div className="flex gap-3">
          <button onClick={() => navigate("/creer")} className="btn-primary-sm">Créer un CV</button>
          <button onClick={() => navigate("/apercu")} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">Mon CV</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Analyse ta compatibilité avec une offre d'emploi
          </h1>
          <p className="text-muted-foreground">Colle une offre et l'IA compare avec ton CV</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Input */}
          <div className="space-y-4">
            <textarea
              className="form-input min-h-[250px]"
              placeholder="Colle ici le texte complet de l'offre d'emploi...&#10;Ex: Nous recherchons un développeur React avec 3 ans d'expérience, anglais courant, esprit d'équipe..."
              value={offreText}
              onChange={(e) => setOffreText(e.target.value)}
            />
            <button onClick={analyze} disabled={loading || !offreText.trim()} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyse en cours...</> : <><Search className="w-5 h-5" /> Analyser avec mon CV</>}
            </button>
          </div>

          {/* Right - Results */}
          <div>
            {result ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Score */}
                <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor(result.score)} strokeWidth="8"
                        strokeLinecap="round" strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={2 * Math.PI * 50 * (1 - result.score / 100)} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold" style={{ color: scoreColor(result.score) }}>{result.score}%</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground mt-2">Compatibilité avec cette offre</span>
                </div>

                {/* Points forts */}
                {result.points_forts.length > 0 && (
                  <div className="glass-card">
                    <h3 className="text-sm font-semibold text-primary mb-3">✅ Points forts</h3>
                    <ul className="space-y-2">
                      {result.points_forts.map((p, i) => (
                        <li key={i} className="text-sm text-foreground">✅ {p.element} — {p.detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Points manquants */}
                {result.points_manquants.length > 0 && (
                  <div className="glass-card">
                    <h3 className="text-sm font-semibold text-destructive mb-3">❌ Points manquants</h3>
                    <ul className="space-y-2">
                      {result.points_manquants.map((p, i) => (
                        <li key={i} className="text-sm text-foreground">❌ {p.element} — {p.detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="glass-card">
                    <h3 className="text-sm font-semibold text-accent mb-3">💡 Suggestions d'amélioration</h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-foreground">💡 {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button onClick={optimizeForJob} className="btn-primary w-full flex items-center justify-center gap-2">
                  🚀 Optimiser mon CV pour cette offre <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Colle une offre d'emploi et lance l'analyse pour voir tes résultats</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysePage;
