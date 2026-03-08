import { useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  type: "personal" | "experience";
  onResult: (data: Record<string, string>) => void;
}

const VoiceMicButton = ({ type, onResult }: Props) => {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Non supporté", description: "Ton navigateur ne supporte pas la reconnaissance vocale.", variant: "destructive" });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onerror = () => {
      setListening(false);
      toast({ title: "Erreur", description: "Impossible de capter ta voix. Réessaie.", variant: "destructive" });
    };
    recognition.onend = () => setListening(false);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      setProcessing(true);

      try {
        const { data, error } = await supabase.functions.invoke("ai-voice-parse", {
          body: { transcript, type },
        });
        if (error) throw error;
        if (data?.parsed) {
          onResult(data.parsed);
          toast({ title: "✅ Champs remplis automatiquement !" });
        }
      } catch {
        toast({ title: "Erreur", description: "Une erreur est survenue. Réessaie dans quelques secondes.", variant: "destructive" });
      } finally {
        setProcessing(false);
      }
    };

    recognition.start();
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={startListening}
        disabled={listening || processing}
        className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline disabled:opacity-50"
      >
        {processing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : listening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        {listening ? "Écoute..." : processing ? "Analyse..." : "🎤 Remplir vocalement"}
      </button>
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-3 h-3 bg-destructive rounded-full animate-pulse"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceMicButton;
