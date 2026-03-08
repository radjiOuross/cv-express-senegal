import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { formData, aiData, entreprise, poste, offre, tone } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Tu es expert en rédaction de lettres de motivation en France/Sénégal.
Génère une lettre de motivation professionnelle en français.
Ton: ${tone}.
Format français standard avec: expéditeur en haut à droite, date, destinataire à gauche, objet,
3 paragraphes percutants (accroche, arguments, conclusion), formule de politesse.
Personnalise avec les vraies informations du candidat.
Retourne le texte brut de la lettre, sans JSON ni markdown.

CV du candidat: ${JSON.stringify({ formData, aiData })}
Entreprise: ${entreprise}
Poste: ${poste}
${offre ? `Offre: ${offre}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Tu es un rédacteur professionnel. Retourne uniquement le texte de la lettre." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${status}`);
    }

    const data = await response.json();
    const letter = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ letter: letter.trim() }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-cover-letter error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
