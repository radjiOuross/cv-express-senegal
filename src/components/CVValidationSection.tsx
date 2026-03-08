import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Shield, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";

interface Validation {
  skill_validated: string;
  comment: string;
  validator?: { name: string; title: string; company: string };
}

interface Props {
  cvId?: string;
  skills: string[];
  validations: Validation[];
  onRequestSent: () => void;
}

const CVValidationSection = ({ cvId, skills, validations, onRequestSent }: Props) => {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [sending, setSending] = useState(false);

  const requestValidation = async () => {
    if (!selectedSkill || !cvId) return;
    setSending(true);
    try {
      await supabase.from("validation_requests").insert({
        cv_id: cvId,
        skill: selectedSkill,
        status: "pending",
      });
      toast({ title: "✅ Demande de validation envoyée !" });
      setSelectedSkill("");
      onRequestSent();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">🤝 Faire valider mon CV</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Un professionnel vérifié valide tes compétences. Ton CV affichera un badge de validation qui rassure les recruteurs.
      </p>

      {validations.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm font-medium text-primary mb-2">✅ Compétences validées par des professionnels</p>
          {validations.map((v, i) => (
            <p key={i} className="text-sm text-foreground">
              {v.skill_validated} — validé par {v.validator?.name || "Un professionnel"}, {v.validator?.title} @ {v.validator?.company}
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <select className="form-input flex-1" value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
          <option value="">Sélectionner une compétence</option>
          {skills.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button onClick={requestValidation} disabled={!selectedSkill || sending} className="btn-primary-sm flex items-center gap-2">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Demander
        </button>
      </div>
    </motion.div>
  );
};

export default CVValidationSection;
