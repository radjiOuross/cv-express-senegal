import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadFormData } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const STATUS_MESSAGES = [
  "Analyse de ton parcours...",
  "Optimisation des descriptions...",
  "Amélioration des compétences...",
  "Finalisation du CV...",
];

const LoadingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const generate = async () => {
      const formData = loadFormData();
      if (!formData.personal?.prenom) {
        navigate("/creer");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("generate-cv", {
          body: { formData },
        });

        if (error) throw error;

        // Store AI data in localStorage for preview
        localStorage.setItem("cvexpress_ai_data", JSON.stringify(data.aiData));
        
        // Save to Supabase
        await supabase.from("cvs").insert({
          email: formData.personal?.email || "",
          form_data: formData as unknown as import("@/integrations/supabase/types").Json,
          ai_data: data.aiData as import("@/integrations/supabase/types").Json,
          template: "classique",
          paid: false,
          ...(user ? { user_id: user.id } : {}),
        });

        navigate("/apercu");
      } catch (err) {
        console.error("Generation error:", err);
        // Still navigate with raw data as fallback
        localStorage.setItem("cvexpress_ai_data", JSON.stringify(null));
        navigate("/apercu");
      }
    };

    generate();
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center"
    >
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin-slow" />
        <Loader2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>

      <motion.p
        key={msgIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-xl text-foreground font-medium mb-4"
      >
        {STATUS_MESSAGES[msgIndex]}
      </motion.p>

      <p className="text-muted-foreground text-sm">Cela prend quelques secondes...</p>

      <div className="mt-8 w-64 h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 12, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingPage;
