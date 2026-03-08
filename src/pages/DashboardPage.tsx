import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { saveFormData } from "@/lib/storage";
import { FormData } from "@/types/cv";
import { Loader2, Plus, FileText, Calendar, LogOut, Edit, Globe, Video, Eye, Copy, Check, Settings } from "lucide-react";
import ProfileSettings from "@/components/ProfileSettings";

interface CVRow {
  id: string;
  created_at: string;
  form_data: any;
  ai_data: any;
  template: string;
  email: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [cvs, setCvs] = useState<CVRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/connexion");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) loadCVs();
  }, [user]);

  const loadCVs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cvs")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: "Impossible de charger vos CV.", variant: "destructive" });
    } else {
      setCvs(data || []);
    }
    setLoading(false);
  };

  const openCV = (cv: CVRow) => {
    // Load form data and AI data into localStorage for preview
    const formData = cv.form_data as FormData;
    saveFormData(formData);
    if (cv.ai_data) {
      localStorage.setItem("cvexpress_ai_data", JSON.stringify(cv.ai_data));
    }
    navigate("/apercu");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Utilisateur";
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border">
        <span className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>CVExpress</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {userAvatar && <img src={userAvatar} alt="" className="w-8 h-8 rounded-full" />}
            <span className="text-sm text-foreground font-medium hidden sm:block">{userName}</span>
          </div>
          <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Mes CV</h1>
            <p className="text-muted-foreground mt-1">Retrouve et gère tous tes CV</p>
          </div>
          <button onClick={() => navigate("/creer")} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouveau CV
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : cvs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Aucun CV pour l'instant</h2>
            <p className="text-muted-foreground mb-6">Crée ton premier CV professionnel en quelques minutes</p>
            <button onClick={() => navigate("/creer")} className="btn-primary">
              Créer mon premier CV
            </button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.map((cv, i) => {
              const fd = cv.form_data as any;
              const name = `${fd?.personal?.prenom || ""} ${fd?.personal?.nom || ""}`.trim() || "Sans nom";
              const poste = fd?.personal?.poste || "Poste non défini";
              const date = new Date(cv.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

              return (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card cursor-pointer hover:border-primary/30 transition-all group"
                  onClick={() => openCV(cv)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">{cv.template}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{poste}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {date}
                    </span>
                    <Edit className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardPage;
