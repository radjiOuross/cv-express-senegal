import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadFormData } from "@/lib/storage";
import { generateVideoScript } from "@/services/geminiService";
import { Loader2, RefreshCw, Check, Edit3 } from "lucide-react";

const VideoCVScriptPage = () => {
  const navigate = useNavigate();
  const formData = loadFormData();
  const aiDataRaw = localStorage.getItem("cvexpress_ai_data");
  const cvJson = JSON.stringify({ formData, aiData: aiDataRaw ? JSON.parse(aiDataRaw) : null });

  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await generateVideoScript(cvJson);
      setScript(result.trim());
    } catch {
      setError("Erreur lors de la génération. Réessaie !");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generate();
  }, []);

  const wordCount = script.split(/\s+/).filter(Boolean).length;
  const seconds = Math.round(wordCount * 0.4);

  const handleContinue = () => {
    localStorage.setItem("cvexpress_video_script", script);
    navigate("/video-cv/enregistrement");
  };

  if (!formData?.personal?.prenom) {
    navigate("/creer");
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen" style={{ background: "#0f0f0f", color: "#fff" }}>
      <nav className="flex items-center justify-between px-6 md:px-12 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <span className="text-2xl font-bold tracking-tight cursor-pointer" style={{ color: "#00A651" }} onClick={() => navigate("/")}>CVExpress</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h1 className="text-3xl font-bold mb-2">🎥 Ta présentation vidéo en 60 secondes</h1>
          <p className="mb-8" style={{ color: "#999" }}>L'IA rédige ton script parfait, tu n'as plus qu'à le lire</p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#00A651" }} />
            <p style={{ color: "#999" }}>✍️ Rédaction de ton script en cours...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="mb-4" style={{ color: "#EF4444" }}>{error}</p>
            <button onClick={generate} className="px-6 py-3 rounded-lg font-medium" style={{ background: "#00A651", color: "#fff" }}>Réessayer</button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-xl p-6 mb-4" style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(0,166,81,0.15)", color: "#00A651" }}>
                  {wordCount} mots · ~{seconds} secondes
                </span>
                <button onClick={() => setEditing(!editing)} className="flex items-center gap-1 text-xs" style={{ color: "#999" }}>
                  <Edit3 className="w-3 h-3" /> {editing ? "Aperçu" : "Modifier"}
                </button>
              </div>

              {editing ? (
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="w-full min-h-[300px] rounded-lg p-4 text-base outline-none resize-none"
                  style={{ background: "#111", border: "1px solid #333", color: "#eee", fontFamily: "'Cormorant Garamond', serif", fontSize: 18, lineHeight: 1.8 }}
                />
              ) : (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, lineHeight: 1.8, color: "#ddd" }}>{script}</p>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <button onClick={generate} className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all" style={{ background: "#1a1a1a", border: "1px solid #333", color: "#ccc" }}>
                <RefreshCw className="w-4 h-4" /> Générer un autre script
              </button>
              <button onClick={handleContinue} className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:brightness-110" style={{ background: "#00A651", color: "#fff" }}>
                <Check className="w-4 h-4" /> Ce script me convient → Continuer
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCVScriptPage;
