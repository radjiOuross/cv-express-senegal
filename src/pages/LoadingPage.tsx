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
  "Création du CV sur Reactive Resume...",
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
        // Step 1: Generate AI-enhanced data
        const { data: genData, error: genError } = await supabase.functions.invoke("generate-cv", {
          body: { formData },
        });

        if (genError) throw genError;

        const aiData = genData?.aiData || null;
        localStorage.setItem("cvexpress_ai_data", JSON.stringify(aiData));

        // Step 2: Import to Reactive Resume
        const { data: rrData, error: rrError } = await supabase.functions.invoke("reactive-resume-export", {
          body: {
            action: "import",
            formData,
            aiData,
            template: "azurill",
            customization: null,
          },
        });

        if (rrError) {
          console.error("Reactive Resume import error:", rrError);
          // Still continue - we'll handle this in preview
        }

        if (rrData?.resumeId) {
          localStorage.setItem("cvexpress_rr_resume_id", rrData.resumeId);
          localStorage.setItem("cvexpress_rr_slug", rrData.slug || "");
          localStorage.setItem("cvexpress_rr_public_url", rrData.publicUrl || "");
        }

        // Save to database
        await supabase.from("cvs").insert({
          email: formData.personal?.email || "",
          form_data: formData as unknown as import("@/integrations/supabase/types").Json,
          ai_data: aiData as import("@/integrations/supabase/types").Json,
          template: "azurill",
          paid: false,
          ...(user ? { user_id: user.id } : {}),
        });

        navigate("/apercu");
      } catch (err) {
        console.error("Generation error:", err);
        localStorage.setItem("cvexpress_ai_data", JSON.stringify(null));
        navigate("/apercu");
      }
    };

    generate();
  }, [navigate, user]);

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
          transition={{ duration: 15, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingPage;
