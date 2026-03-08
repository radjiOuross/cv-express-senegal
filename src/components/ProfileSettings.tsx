import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Copy, Check, Eye, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Settings {
  profile_public: boolean;
  show_email: boolean;
  show_phone: boolean;
  profile_slug: string;
}

const ProfileSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>({ profile_public: true, show_email: false, show_phone: false, profile_slug: "" });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("cvs")
      .select("profile_public, show_email, show_phone, profile_slug")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setSettings(data as unknown as Settings);
    }
    setLoading(false);
  };

  const updateSetting = async (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    await supabase
      .from("cvs")
      .update({ [key]: value } as any)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1);
    toast.success("Paramètre mis à jour");
  };

  const profileUrl = settings.profile_slug ? `${window.location.origin}/profil/${settings.profile_slug}` : "";

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Lien copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return null;

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center justify-between py-3 cursor-pointer">
      <span className="text-sm" style={{ color: "#ccc" }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        className="w-11 h-6 rounded-full relative transition-all cursor-pointer"
        style={{ background: checked ? "#00A651" : "#333" }}
      >
        <div className="absolute top-0.5 w-5 h-5 rounded-full transition-transform" style={{ background: "#fff", transform: checked ? "translateX(22px)" : "translateX(2px)" }} />
      </div>
    </label>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-6" style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
      <h3 className="font-semibold text-lg mb-4">🔒 Visibilité du profil</h3>

      <div className="divide-y" style={{ borderColor: "#2a2a2a" }}>
        <Toggle label="Profil public" checked={settings.profile_public} onChange={(v) => updateSetting("profile_public", v)} />
        <Toggle label="Afficher mon email" checked={settings.show_email} onChange={(v) => updateSetting("show_email", v)} />
        <Toggle label="Afficher mon téléphone" checked={settings.show_phone} onChange={(v) => updateSetting("show_phone", v)} />
      </div>

      {profileUrl && (
        <div className="mt-5 space-y-3">
          <button onClick={copyUrl} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: "#2a2a2a", color: "#ccc" }}>
            {copied ? <Check className="w-4 h-4" style={{ color: "#00A651" }} /> : <Copy className="w-4 h-4" />}
            {copied ? "Copié !" : "📋 Copier mon lien profil"}
          </button>
          <a href={`/profil/${settings.profile_slug}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: "#2a2a2a", color: "#ccc" }}>
            <Eye className="w-4 h-4" /> 👁️ Voir mon profil
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileSettings;
