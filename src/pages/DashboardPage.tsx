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
  const [viewCount, setViewCount] = useState(0);
  const [profileSlug, setProfileSlug] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/connexion");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) loadCVs();
  }, [user]);

  useEffect(() => {
    if (user && cvs.length > 0) {
      const latestCv = cvs[0];
      const slug = (latestCv as any).profile_slug;
      setProfileSlug(slug || "");
      setHasVideo(!!(latestCv as any).video_url);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      supabase
        .from("profile_views")
        .select("*", { count: "exact", head: true })
        .eq("cv_id", latestCv.id)
        .gte("viewed_at", weekAgo.toISOString())
        .then(({ count }) => setViewCount(count || 0));
    }
  }, [user, cvs]);

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

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profil/${profileSlug}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Utilisateur";
  const userAvatar = user?.user_metadata?.avatar_url;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  useEffect(() => {
    if (user && cvs.length > 0) {
      const latestCv = cvs[0];
      const slug = (latestCv as any).profile_slug;
      setProfileSlug(slug || "");
      setHasVideo(!!(latestCv as any).video_url);

      // Get weekly views
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      supabase
        .from("profile_views")
        .select("*", { count: "exact", head: true })
        .eq("cv_id", latestCv.id)
        .gte("viewed_at", weekAgo.toISOString())
        .then(({ count }) => setViewCount(count || 0));
    }
  }, [user, cvs]);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profil/${profileSlug}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border">
        <span className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>CVExpress</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {userAvatar && <img src={userAvatar} alt="" className="w-8 h-8 rounded-full" />}
            <span className="text-sm text-foreground font-medium hidden sm:block">{userName}</span>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Settings className="w-4 h-4" /> Paramètres
          </button>
          <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Dashboard cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Profile card */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Mon profil en ligne</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">👁️ {viewCount} vues cette semaine</p>
            {profileSlug ? (
              <div className="flex gap-2">
                <button onClick={() => navigate(`/profil/${profileSlug}`)} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground">
                  <Eye className="w-3 h-3 inline mr-1" /> Voir
                </button>
                <button onClick={copyProfileLink} className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground">
                  {linkCopied ? <Check className="w-3 h-3 inline mr-1" /> : <Copy className="w-3 h-3 inline mr-1" />}
                  {linkCopied ? "Copié" : "Copier"}
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Crée ton premier CV pour activer ton profil</p>
            )}
          </div>

          {/* Video card */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Ma vidéo CV</h3>
            </div>
            {hasVideo ? (
              <p className="text-sm text-primary">✅ Vidéo publiée</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-3">Crée ta vidéo de présentation</p>
                <button onClick={() => navigate("/video-cv/script")} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground">
                  🎥 Créer ma vidéo
                </button>
              </>
            )}
          </div>

          {/* Completeness card */}
          <div className="glass-card">
            <h3 className="font-semibold text-foreground mb-3">Profil complet</h3>
            {(() => {
              const pct = (cvs.length > 0 ? 50 : 0) + (hasVideo ? 25 : 0) + (profileSlug ? 25 : 0);
              return (
                <>
                  <div className="w-full h-2 rounded-full bg-muted mb-2">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pct}% — {!hasVideo ? "Ajoute une vidéo pour progresser" : "Excellent !"}
                  </p>
                </>
              );
            })()}
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="mb-8">
            <ProfileSettings />
          </div>
        )}

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
