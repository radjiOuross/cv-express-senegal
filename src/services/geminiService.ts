import { supabase } from "@/integrations/supabase/client";

export async function callCoach(
  message: string,
  history: { role: string; content: string }[],
  cvDataJson: string
): Promise<string> {
  const { data, error } = await supabase.functions.invoke("ai-coach", {
    body: { message, history: history.slice(-20), cvData: JSON.parse(cvDataJson) },
  });

  if (error) throw new Error(error.message || "Erreur du coach IA");
  if (data?.error) throw new Error(data.error);
  return data.reply;
}

export async function generateVideoScript(cvDataJson: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("ai-video-script", {
    body: { cvData: JSON.parse(cvDataJson) },
  });

  if (error) throw new Error(error.message || "Erreur de génération du script");
  if (data?.error) throw new Error(data.error);
  return data.script;
}
