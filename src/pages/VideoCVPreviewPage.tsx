import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { loadFormData } from "@/lib/storage";
import { RotateCcw, Download, Globe, Loader2, Play, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const VideoCVPreviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoUrl = localStorage.getItem("cvexpress_video_blob_url");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [profileLink, setProfileLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);

  const formData = loadFormData();
  const prenom = formData?.personal?.prenom || "";
  const nom = formData?.personal?.nom || "";
  const slug = `${prenom}-${nom}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `CV_Video_${prenom}_${nom}.webm`;
    a.click();
    toast.success("Vidéo téléchargée !");
  };

  const handlePublish = async () => {
    if (!user) {
      toast.error("Connecte-toi pour publier ta vidéo");
      navigate("/connexion");
      return;
    }

    const blob = (window as any).__cvexpress_video_blob;
    if (!blob) {
      toast.error("Vidéo introuvable, recommence l'enregistrement");
      return;
    }

    setPublishing(true);
    try {
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from("video-cvs")
        .upload(fileName, blob, { contentType: "video/webm" });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("video-cvs").getPublicUrl(fileName);
      const publicVideoUrl = urlData.publicUrl;

      // Update CV record
      const { error: updateError } = await supabase
        .from("cvs")
        .update({
          video_url: publicVideoUrl,
          video_script: localStorage.getItem("cvexpress_video_script") || "",
          profile_slug: slug,
        } as any)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (updateError) throw updateError;

      setPublished(true);
      setProfileLink(`${window.location.origin}/profil/${slug}`);
      toast.success("🎉 Ta vidéo est en ligne !");
    } catch (e: any) {
      console.error("Publish error:", e);
      toast.error("Erreur lors de la publication. Réessaie !");
    } finally {
      setPublishing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!videoUrl) {
    navigate("/video-cv/enregistrement");
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen" style={{ background: "#0f0f0f", color: "#fff" }}>
      <nav className="flex items-center justify-between px-6 md:px-12 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <span className="text-2xl font-bold tracking-tight cursor-pointer" style={{ color: "#00A651" }} onClick={() => navigate("/")}>CVExpress</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Prévisualisation</h1>

        {/* Video Player */}
        <div className="rounded-xl overflow-hidden mb-6 relative group" style={{ background: "#000" }}>
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full"
            controls={playing}
            onPlay={() => setPlaying(true)}
            style={{ maxHeight: 400 }}
          />
          {!playing && (
            <button
              onClick={() => { videoRef.current?.play(); setPlaying(true); }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#00A651" }}>
                <Play className="w-8 h-8 ml-1" />
              </div>
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap mb-8">
          <button onClick={() => navigate("/video-cv/enregistrement")} className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium" style={{ background: "#1a1a1a", border: "1px solid #333", color: "#ccc" }}>
            <RotateCcw className="w-4 h-4" /> Recommencer
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium" style={{ background: "#1a1a1a", border: "1px solid #333", color: "#ccc" }}>
            <Download className="w-4 h-4" /> Télécharger
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing || published}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            style={{ background: "#00A651", color: "#fff" }}
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            {publishing ? "Publication..." : published ? "✅ Publié !" : "🌐 Publier sur mon profil"}
          </button>
        </div>

        {published && profileLink && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-5 mb-8" style={{ background: "#1a1a1a", border: "1px solid #00A651" }}>
            <p className="text-sm mb-2" style={{ color: "#00A651" }}>🎉 Ta vidéo est en ligne !</p>
            <div className="flex items-center gap-2">
              <span className="text-sm truncate flex-1" style={{ color: "#ccc" }}>{profileLink}</span>
              <button onClick={copyLink} className="p-2 rounded-lg" style={{ background: "#2a2a2a" }}>
                {copied ? <Check className="w-4 h-4" style={{ color: "#00A651" }} /> : <Copy className="w-4 h-4" style={{ color: "#999" }} />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Tips */}
        <div className="rounded-xl p-5" style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          <p className="font-semibold mb-3">💡 Conseils pour une super vidéo :</p>
          <ul className="space-y-2 text-sm" style={{ color: "#999" }}>
            <li>• Tenue professionnelle recommandée</li>
            <li>• Fond neutre (mur blanc ou rangé)</li>
            <li>• Bonne lumière face à toi</li>
            <li>• Regarde la caméra, pas l'écran</li>
            <li>• Souris ! 😊</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCVPreviewPage;
