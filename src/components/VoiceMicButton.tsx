import { useState, useRef } from "react";
import { Mic, MicOff, Loader2, MessageSquare, X, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  type: "personal" | "experience";
  onResult: (data: Record<string, string>) => void;
}

const VoiceMicButton = ({ type, onResult }: Props) => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textValue, setTextValue] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/ogg";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];

        if (blob.size < 1000) {
          toast({ title: "Enregistrement trop court", description: "Parle plus longtemps et réessaie." });
          return;
        }

        // Convert to base64 and send for transcription
        setProcessing(true);
        try {
          const base64 = await blobToBase64(blob);
          const { data, error } = await supabase.functions.invoke("ai-voice-parse", {
            body: { audio: base64, mimeType, type },
          });
          if (error) throw error;
          if (data?.parsed && Object.values(data.parsed).some((v) => v)) {
            onResult(data.parsed);
            toast({ title: "✅ Champs remplis automatiquement !" });
          } else {
            toast({
              title: "Aucune info extraite",
              description: "Parle plus clairement. Ex: 'Je m'appelle Amadou Diallo, développeur à Dakar'",
            });
          }
        } catch (err) {
          console.error("Transcription error:", err);
          toast({ title: "Erreur", description: "Erreur lors de la transcription. Réessaie.", variant: "destructive" });
        } finally {
          setProcessing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setRecording(true);
    } catch (err: any) {
      console.error("Microphone error:", err);
      if (err.name === "NotAllowedError") {
        toast({
          title: "Accès micro refusé",
          description: "Autorise l'accès au microphone dans les paramètres de ton navigateur.",
          variant: "destructive",
        });
      } else if (err.name === "NotFoundError") {
        toast({
          title: "Aucun micro détecté",
          description: "Connecte un microphone et réessaie.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'accéder au micro. Utilise le mode texte.",
          variant: "destructive",
        });
        setShowTextInput(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
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
      <div className="inline-flex items-center gap-3 flex-wrap">
        {/* Voice recording — universal via MediaRecorder */}
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={processing}
          type="button"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            recording
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          } disabled:opacity-50`}
        >
          {processing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : recording ? (
            <Square className="w-3 h-3 fill-current" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          {recording ? "⏹ Arrêter" : processing ? "Analyse..." : "🎤 Dicter"}
        </button>

        {/* Text mode button */}
        <button
          onClick={() => setShowTextInput(!showTextInput)}
          disabled={processing}
          type="button"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground font-medium hover:text-primary disabled:opacity-50"
        >
          <MessageSquare className="w-4 h-4" />
          📝 Écrire
        </button>

        <AnimatePresence>
          {recording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 bg-destructive rounded-full"
              />
              <span className="text-xs text-destructive font-medium">Parle maintenant...</span>
            </motion.div>
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

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data:audio/...;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default VoiceMicButton;
