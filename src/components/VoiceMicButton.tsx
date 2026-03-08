import { useState, useRef } from "react";
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
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale nécessite Chrome ou Edge.",
        variant: "destructive",
      });
      return;
    }

    // Create and start recognition DIRECTLY in click handler — no await before this
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("SpeechRecognition started");
      setListening(true);
    };

    recognition.onerror = (event: any) => {
      console.error("SpeechRecognition error:", event.error, event.message);
      setListening(false);

      const messages: Record<string, string> = {
        "not-allowed": "Autorise l'accès au microphone dans ton navigateur.",
        "no-speech": "Aucune voix détectée. Parle plus fort et réessaie.",
        "audio-capture": "Aucun microphone détecté.",
        "network": "Erreur réseau. Ouvre l'app dans un nouvel onglet (pas dans l'iframe).",
        "aborted": "Écoute annulée.",
        "service-not-available": "Service indisponible. Ouvre l'app dans un nouvel onglet Chrome.",
      };

      toast({
        title: "Erreur vocale",
        description: messages[event.error] || `Erreur: ${event.error}`,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      console.log("SpeechRecognition ended");
      setListening(false);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice transcript:", transcript);
      setListening(false);
      setProcessing(true);

      try {
        const { data, error } = await supabase.functions.invoke("ai-voice-parse", {
          body: { transcript, type },
        });

        if (error) {
          console.error("AI voice parse error:", error);
          throw error;
        }

        if (data?.parsed && Object.values(data.parsed).some((v) => v)) {
          onResult(data.parsed);
          toast({ title: "✅ Champs remplis automatiquement !" });
        } else {
          toast({
            title: "Aucune info extraite",
            description: "Essaie : 'Je m'appelle Amadou Diallo, développeur web à Dakar'",
          });
        }
      } catch {
        toast({
          title: "Erreur",
          description: "Erreur lors de l'analyse. Réessaie.",
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
      }
    };

    // CRITICAL: Start immediately in the click handler — no async before this
    try {
      recognition.start();
    } catch (err) {
      console.error("Recognition start error:", err);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'écoute. Ouvre l'app dans un nouvel onglet.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={listening ? stopListening : startListening}
        disabled={processing}
        type="button"
        className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline disabled:opacity-50"
      >
        {processing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : listening ? (
          <MicOff className="w-4 h-4 text-destructive" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        {listening ? "Arrêter" : processing ? "Analyse..." : "🎤 Remplir vocalement"}
      </button>
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.3, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-3 h-3 bg-destructive rounded-full"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceMicButton;
