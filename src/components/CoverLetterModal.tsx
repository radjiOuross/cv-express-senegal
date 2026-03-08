import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Copy, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormData, AIData } from "@/types/cv";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  formData: FormData;
  aiData: AIData | null;
}

const TONES = ["Professionnel", "Dynamique", "Formel"];

const CoverLetterModal = ({ open, onClose, formData, aiData }: Props) => {
  const [entreprise, setEntreprise] = useState("");
  const [poste, setPoste] = useState(formData.personal.poste || "");
  const [offre, setOffre] = useState("");
  const [tone, setTone] = useState("Professionnel");
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-cover-letter", {
        body: { formData, aiData, entreprise, poste, offre, tone },
      });
      if (error) throw error;
      setLetter(data.letter || "");
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue. Réessaie.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(letter);
    toast({ title: "📋 Lettre copiée !" });
  };

  const downloadPdf = async () => {
    const el = document.getElementById("cover-letter-content");
    if (!el) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf().set({
      margin: 20,
      filename: `Lettre_${formData.personal.prenom}_${formData.personal.nom}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4" },
    }).from(el).save();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">💌 Lettre de motivation</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!letter ? (
            <div className="space-y-4">
              <div>
                <label className="form-label">Nom de l'entreprise visée</label>
                <input className="form-input" placeholder="Orange Sénégal" value={entreprise} onChange={(e) => setEntreprise(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Poste exact</label>
                <input className="form-input" value={poste} onChange={(e) => setPoste(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Offre d'emploi (optionnel)</label>
                <textarea className="form-input min-h-[80px]" placeholder="Colle le texte de l'offre..." value={offre} onChange={(e) => setOffre(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Ton souhaité</label>
                <div className="flex gap-2">
                  {TONES.map((t) => (
                    <button key={t} onClick={() => setTone(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tone === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <button onClick={generate} disabled={loading || !entreprise} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Rédaction de ta lettre...</> : "Générer avec l'IA ✨"}
              </button>
            </div>
          ) : (
            <div>
              <div id="cover-letter-content" className="bg-white text-black p-8 rounded-lg text-sm leading-relaxed whitespace-pre-wrap font-serif" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {letter}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={copyLetter} className="btn-primary-sm flex items-center gap-2">
                  <Copy className="w-4 h-4" /> Copier
                </button>
                <button onClick={downloadPdf} className="btn-primary-sm flex items-center gap-2">
                  <Download className="w-4 h-4" /> Télécharger PDF
                </button>
                <button onClick={() => setLetter("")} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">
                  Régénérer
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CoverLetterModal;
