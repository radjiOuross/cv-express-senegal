import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, Shield } from "lucide-react";

interface ValidationRequest {
  id: string;
  skill: string;
  status: string;
  cv_id: string;
  created_at: string;
}

const ValidatePage = () => {
  const navigate = useNavigate();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [validatorId, setValidatorId] = useState<string | null>(null);
  const [requests, setRequests] = useState<ValidationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState<Record<string, string>>({});

  const login = async () => {
    if (!linkedinUrl.trim()) return;
    setLoading(true);
    try {
      const { data } = await supabase.from("validators").select("id").eq("linkedin", linkedinUrl).maybeSingle();
      if (data) {
        setValidatorId(data.id);
        setLoggedIn(true);
        loadRequests();
      } else {
        toast({ title: "Non trouvé", description: "Ce profil LinkedIn n'est pas enregistré comme validateur.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    const { data } = await supabase.from("validation_requests").select("*").eq("status", "pending");
    if (data) setRequests(data);
  };

  const validate = async (reqId: string, skill: string, cvId: string) => {
    try {
      await supabase.from("validations").insert({
        cv_id: cvId,
        validator_id: validatorId!,
        skill_validated: skill,
        comment: comment[reqId] || "",
      });
      await supabase.from("validation_requests").update({ status: "validated", validator_id: validatorId }).eq("id", reqId);
      toast({ title: "✅ Compétence validée !" });
      loadRequests();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>CVExpress</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Espace Validateur</h1>
          <p className="text-muted-foreground">Validez les compétences des candidats</p>
        </div>

        {!loggedIn ? (
          <div className="glass-card max-w-md mx-auto space-y-4">
            <label className="form-label">Votre URL LinkedIn</label>
            <input className="form-input" placeholder="https://linkedin.com/in/votre-profil" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
            <button onClick={login} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Se connecter"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">Aucune demande de validation en attente.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="glass-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">Compétence: <span className="text-primary">{req.skill}</span></span>
                    <span className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <input className="form-input text-sm mb-3" placeholder="Commentaire (max 100 caractères)" maxLength={100}
                    value={comment[req.id] || ""} onChange={(e) => setComment({ ...comment, [req.id]: e.target.value })} />
                  <button onClick={() => validate(req.id, req.skill, req.cv_id)} className="btn-primary-sm flex items-center gap-2">
                    <Check className="w-4 h-4" /> Valider cette compétence
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ValidatePage;
