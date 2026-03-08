import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { FormData, AIData } from "@/types/cv";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, MapPin, Mail, Phone, Linkedin, Play, ChevronDown, Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const ProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cvData, setCvData] = useState<{ formData: FormData; aiData: AIData | null; showEmail: boolean; showPhone: boolean; videoUrl: string | null; cvId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) loadProfile();
  }, [slug]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from("cvs")
      .select("*")
      .eq("profile_slug", slug)
      .eq("profile_public", true)
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    setCvData({
      formData: data.form_data as unknown as FormData,
      aiData: data.ai_data as unknown as AIData | null,
      showEmail: (data as any).show_email ?? false,
      showPhone: (data as any).show_phone ?? false,
      videoUrl: (data as any).video_url ?? null,
      cvId: data.id,
    });

    // Track view
    await supabase.from("profile_views").insert({ cv_id: data.id, referrer: document.referrer || null });

    // Get view count
    const { count } = await supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("cv_id", data.id);
    setViewCount(count || 0);

    setLoading(false);
  };

  const profileUrl = `${window.location.origin}/profil/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Lien copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Découvrez mon profil professionnel : ${profileUrl}`)}`, "_blank");
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0f0f" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#00A651" }} />
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0f0f", color: "#999" }}>
        <p className="text-lg">Profil introuvable ou non public.</p>
      </div>
    );
  }

  const { formData, aiData, showEmail, showPhone, videoUrl } = cvData;
  const p = formData.personal;
  const initials = `${p.prenom?.[0] || ""}${p.nom?.[0] || ""}`.toUpperCase();
  const experiences = aiData?.experiences_optimisees || formData.experiences || [];
  const competences = aiData?.competences || formData.skills || [];
  const formations = aiData?.formation || formData.diplomas || [];
  const langues = aiData?.langues || formData.languages || [];
  const summary = aiData?.summary || "";

  const getLevelColor = (niveau: string) => {
    const n = niveau.toLowerCase();
    if (n.includes("bilingue") || n.includes("natif") || n.includes("maternel")) return "#00A651";
    if (n.includes("courant") || n.includes("avancé")) return "#3B82F6";
    return "#6B7280";
  };

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4" style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(0,166,81,0.08) 0%, #0f0f0f 70%)" }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
          {p.photo ? (
            <img src={p.photo} alt={`${p.prenom} ${p.nom}`} className="w-40 h-40 rounded-full object-cover" style={{ border: "3px solid #00A651", boxShadow: "0 0 30px rgba(0,166,81,0.3)" }} />
          ) : (
            <div className="w-40 h-40 rounded-full flex items-center justify-center text-4xl font-bold" style={{ background: "#00A651", color: "#fff" }}>{initials}</div>
          )}

          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="mt-6 text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 8vw, 56px)", fontWeight: 700 }}>
            {p.prenom} {p.nom}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} style={{ color: "#00A651", fontSize: 18, marginTop: 8 }}>
            {p.poste}
          </motion.p>

          {p.ville && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-1 mt-2" style={{ color: "#999", fontSize: 14 }}>
              <MapPin className="w-3.5 h-3.5" /> {p.ville}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-4">
            <span className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ background: "rgba(0,166,81,0.15)", color: "#00A651", border: "1px solid rgba(0,166,81,0.3)" }}>
              🟢 Disponible immédiatement
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex gap-3 mt-6 flex-wrap justify-center">
            {showEmail && p.email && (
              <a href={`mailto:${p.email}`} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:text-white" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#ccc" }}>
                <Mail className="w-4 h-4" /> Email
              </a>
            )}
            {showPhone && p.telephone && (
              <a href={`tel:${p.telephone}`} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:text-white" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#ccc" }}>
                <Phone className="w-4 h-4" /> Appeler
              </a>
            )}
            {videoUrl && (
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:text-white" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#ccc" }}>
                <Play className="w-4 h-4" /> Voir vidéo
              </button>
            )}
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute bottom-8">
          <ChevronDown className="w-6 h-6" style={{ color: "#555" }} />
        </motion.div>
      </section>

      {/* RÉSUMÉ */}
      {summary && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="max-w-3xl mx-auto px-6 py-20">
          <div className="rounded-xl p-8 relative" style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <span className="text-4xl absolute top-4 left-6" style={{ color: "#00A651" }}>"</span>
            <p className="mt-6" style={{ fontSize: 18, fontStyle: "italic", lineHeight: 1.8, color: "#bbb" }}>{summary}</p>
          </div>
        </motion.section>
      )}

      {/* EXPÉRIENCES */}
      {experiences.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="max-w-3xl mx-auto px-6 py-16">
          <p className="mb-10" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: "#00A651" }}>Parcours</p>
          <div className="relative" style={{ borderLeft: "2px solid #00A651", paddingLeft: 24 }}>
            {experiences.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="mb-8 relative group">
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full" style={{ background: "#00A651" }} />
                <div className="rounded-lg p-4 transition-transform group-hover:-translate-y-0.5" style={{ background: "#1a1a1a" }}>
                  <p className="font-bold" style={{ fontSize: 16 }}>{exp.entreprise}</p>
                  <p style={{ fontSize: 14, color: "#00A651" }}>{exp.poste}</p>
                  <p className="mt-1" style={{ fontSize: 12, color: "#666" }}>{exp.dateDebut} — {exp.dateFin}</p>
                  <p className="mt-2" style={{ fontSize: 13, color: "#999" }}>{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* COMPÉTENCES */}
      {competences.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="max-w-3xl mx-auto px-6 py-16">
          <p className="mb-8" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: "#00A651" }}>Compétences</p>
          <div className="flex flex-wrap gap-3">
            {competences.map((skill, i) => (
              <motion.span key={i} variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } } }} className="px-4 py-2 rounded-full text-sm" style={{ background: "#1a1a1a", border: "1px solid #00A651", color: "#fff" }}>
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.section>
      )}

      {/* FORMATION */}
      {formations.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="max-w-3xl mx-auto px-6 py-16">
          <p className="mb-8" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: "#00A651" }}>Formation</p>
          <div className="space-y-4">
            {formations.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-lg p-5" style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                <p className="font-bold">{f.diplome}</p>
                <p style={{ fontStyle: "italic", color: "#999", fontSize: 14 }}>{f.ecole}</p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs" style={{ background: "rgba(0,166,81,0.15)", color: "#00A651" }}>{f.annee}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* LANGUES */}
      {langues.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="max-w-3xl mx-auto px-6 py-16">
          <p className="mb-8" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: "#00A651" }}>Langues</p>
          <div className="flex flex-wrap gap-4">
            {langues.map((l, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: "#1a1a1a" }}>
                <span className="text-lg">🌐</span>
                <span className="text-sm">{l.langue}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${getLevelColor(l.niveau)}20`, color: getLevelColor(l.niveau) }}>
                  {l.niveau}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* FOOTER */}
      <footer className="max-w-3xl mx-auto px-6 py-12">
        <div style={{ height: 1, background: "#00A651", opacity: 0.3, marginBottom: 24 }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p style={{ color: "#666", fontSize: 14 }}>👁️ {viewCount} personnes ont consulté ce profil</p>
            <p className="mt-4" style={{ color: "#444", fontSize: 12 }}>Créé avec CVExpress 🇸🇳</p>
          </div>
          <QRCodeSVG value={profileUrl} size={80} fgColor="#00A651" bgColor="transparent" />
        </div>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={shareWhatsApp} className="px-4 py-2 rounded-lg text-sm transition-all" style={{ border: "1px solid #333", color: "#aaa" }}>WhatsApp</button>
          <button onClick={shareLinkedIn} className="px-4 py-2 rounded-lg text-sm transition-all" style={{ border: "1px solid #333", color: "#aaa" }}>LinkedIn</button>
          <button onClick={copyLink} className="px-4 py-2 rounded-lg text-sm flex items-center gap-1 transition-all" style={{ border: "1px solid #333", color: "#aaa" }}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copié !" : "Copier le lien"}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
