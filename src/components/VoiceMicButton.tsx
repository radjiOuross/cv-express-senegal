import { useState, useRef } from "react";
import { Mic, MicOff, Loader2, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  type: "personal" | "experience";
  onResult: (data: Record<string, string>) => void;
}

const hasSpeechRecognition = () =>
  !!(((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));

const VoiceMicButton = ({ type, onResult }: Props) => {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textValue, setTextValue] = useState("");
  const recognitionRef = useRef<any>(null);

  const parseWithAI = async (transcript: string) => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-voice-parse", {
        body: { transcript, type },
      });
      if (error) throw error;
      if (data?.parsed && Object.values(data.parsed).some((v) => v)) {
        onResult(data.parsed);
        toast({ title: "✅ Champs remplis automatiquement !" });
        setShowTextInput(false);
        setTextValue("");
      } else {
        toast({
          title: "Aucune info extraite",
          description: type === "personal"
            ? "Essaie : 'Je m'appelle Amadou Diallo, développeur web à Dakar, amadou@gmail.com'"
            : "Essaie : 'J'ai travaillé chez Orange comme technicien de 2022 à 2024'",
        });
      }
    } catch {
      toast({ title: "Erreur", description: "Erreur lors de l'analyse. Réessaie.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onerror = (event: any) => {
      console.error("SpeechRecognition error:", event.error);
      setListening(false);
      if (event.error === "network" || event.error === "service-not-available") {
        toast({ title: "Vocal indisponible", description: "Utilise le mode texte à la place.", variant: "destructive" });
        setShowTextInput(true);
      } else {
        const msgs: Record<string, string> = {
          "not-allowed": "Autorise l'accès au microphone.",
          "no-speech": "Aucune voix détectée. Réessaie.",
          "audio-capture": "Aucun microphone détecté.",
        };
        toast({ title: "Erreur", description: msgs[event.error] || `Erreur: ${event.error}`, variant: "destructive" });
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice transcript:", transcript);
      setListening(false);
      parseWithAI(transcript);
    };

    try {
      recognition.start();
    } catch {
      toast({ title: "Erreur", description: "Impossible de démarrer. Utilise le mode texte.", variant: "destructive" });
      setShowTextInput(true);
    }
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleTextSubmit = () => {
    if (!textValue.trim()) return;
    parseWithAI(textValue.trim());
  };

  const placeholder = type === "personal"
    ? "Ex: Je m'appelle Amadou Diallo, je cherche un poste de développeur web à Dakar, mon email est amadou@gmail.com, mon numéro est +221 77 123 45 67"
    : "Ex: J'ai travaillé chez Orange Sénégal pendant 2 ans comme technicien réseau de janvier 2022 à décembre 2024. Je gérais la maintenance du réseau fibre optique.";

  return (
    <div className="space-y-2">
      <div className="inline-flex items-center gap-2 flex-wrap">
        {/* Text mode button — always available */}
        <button
          onClick={() => setShowTextInput(!showTextInput)}
          disabled={processing}
          type="button"
          className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline disabled:opacity-50"
        >
          <MessageSquare className="w-4 h-4" />
          📝 Remplir avec une description
        </button>

        {/* Voice mode button — only if supported */}
        {hasSpeechRecognition() && (
          <button
            onClick={listening ? stopVoice : startVoice}
            disabled={processing}
            type="button"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground font-medium hover:text-primary disabled:opacity-50"
          >
            {listening ? <MicOff className="w-4 h-4 text-destructive" /> : <Mic className="w-4 h-4" />}
            {listening ? "Arrêter" : "🎤 Vocal"}
          </button>
        )}

        {processing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}

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

      {/* Text input area */}
      <AnimatePresence>
        {showTextInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Décris-toi en une phrase, l'IA remplira les champs
                </span>
                <button onClick={() => setShowTextInput(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                className="form-input min-h-[80px] text-sm"
                placeholder={placeholder}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
              <button
                onClick={handleTextSubmit}
                disabled={processing || !textValue.trim()}
                className="btn-primary-sm w-full flex items-center justify-center gap-2"
              >
                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyse en cours...</> : "✨ Extraire les informations"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceMicButton;
