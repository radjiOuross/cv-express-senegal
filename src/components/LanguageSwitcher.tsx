import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AIData } from "@/types/cv";
import { toast } from "@/hooks/use-toast";

const LANGS = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

interface Props {
  aiData: AIData | null;
  onTranslated: (data: AIData) => void;
  currentLang: string;
  onLangChange: (lang: string) => void;
}

const LanguageSwitcher = ({ aiData, onTranslated, currentLang, onLangChange }: Props) => {
  const [loading, setLoading] = useState(false);
  const cacheKey = (lang: string) => `cvexpress_translation_${lang}`;

  const switchLang = async (lang: string) => {
    if (lang === currentLang) return;

    if (lang === "fr") {
      const original = localStorage.getItem("cvexpress_ai_data");
      if (original) onTranslated(JSON.parse(original));
      onLangChange("fr");
      return;
    }

    const cached = localStorage.getItem(cacheKey(lang));
    if (cached) {
      onTranslated(JSON.parse(cached));
      onLangChange(lang);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-translate-cv", {
        body: { aiData, targetLang: lang },
      });
      if (error) throw error;
      localStorage.setItem(cacheKey(lang), JSON.stringify(data.translated));
      onTranslated(data.translated);
      onLangChange(lang);
    } catch {
      toast({ title: "Erreur", description: "Traduction impossible. Réessaie.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => switchLang(l.code)}
          disabled={loading}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
            currentLang === l.code ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <span>{l.flag}</span> {l.label}
        </button>
      ))}
      {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
    </div>
  );
};

export default LanguageSwitcher;
