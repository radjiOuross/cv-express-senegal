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

  const startListening = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale nécessite Chrome ou Edge. Essaie avec un de ces navigateurs.",
        variant: "destructive",
      });
      return;
    }

    // Request microphone permission explicitly first (must be in click handler)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately — we only needed to trigger the permission
      stream.getTracks().forEach((track) => track.stop());
    } catch (err: any) {
      console.error("Microphone permission error:", err);
      if (err.name === "NotAllowedError") {
        toast({
          title: "Accès au micro refusé",
          description: "Autorise l'accès au microphone dans les paramètres de ton navigateur, puis réessaie.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur micro",
          description: "Impossible d'accéder au microphone. Vérifie qu'un micro est connecté.",
          variant: "destructive",
        });
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      
      const messages: Record<string, string> = {
        "not-allowed": "Autorise l'accès au microphone dans ton navigateur.",
        "no-speech": "Aucune voix détectée. Parle plus fort et réessaie.",
        "audio-capture": "Aucun microphone détecté. Vérifie ta connexion.",
        "network": "Erreur réseau. Vérifie ta connexion internet.",
        "aborted": "Écoute annulée.",
      };

      toast({
        title: "Erreur vocale",
        description: messages[event.error] || `Erreur: ${event.error}. Réessaie.`,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
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
        
        if (data?.parsed && Object.keys(data.parsed).some((k) => data.parsed[k])) {
          onResult(data.parsed);
          toast({ title: "✅ Champs remplis automatiquement !" });
        } else {
          toast({
            title: "Aucune info extraite",
            description: "Essaie de parler plus clairement. Ex: 'Je m'appelle Amadou Diallo, je cherche un poste de développeur à Dakar'",
          });
        }
      } catch {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'analyse. Réessaie dans quelques secondes.",
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
      }
    };

    // Start recognition directly in the click handler chain
    try {
      recognition.start();
    } catch (err) {
      console.error("Recognition start error:", err);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'écoute. Réessaie.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={listening ? stopListening : startListening}
        disabled={processing}
        className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline disabled:opacity-50"
        type="button"
      >
        {processing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : listening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        {listening ? "Arrêter l'écoute" : processing ? "Analyse en cours..." : "🎤 Remplir vocalement"}
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
