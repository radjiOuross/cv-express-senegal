import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, history, cvData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Tu es Coach CVExpress, un coach carrière expert et bienveillant spécialisé dans le marché de l'emploi sénégalais et ouest-africain.

Tu connais parfaitement:
- Les entreprises sénégalaises: Sonatel, Wave, Orange, CBAO, Ecobank, BICIS, Groupe Bolloré, Total Sénégal, Gainde 2000, Air Sénégal, AIBD, ONAS...
- Les salaires moyens par secteur en FCFA
- Les codes culturels professionnels au Sénégal
- Les plateformes d'emploi locales: Emploi.sn, Jobartoo
- Le droit du travail sénégalais basique
- Les spécificités du marché UEMOA/CEDEAO

CV complet du candidat que tu coaches: ${JSON.stringify(cvData)}

Règles de communication:
- Toujours en français, ton chaleureux et encourageant
- Réponses courtes et actionnables (max 120 mots)
- Donne toujours au moins 1 conseil concret
- Utilise des emojis avec modération
- Si tu génères un template email/lettre: formate-le clairement entre guillemets
- Ne sois jamais négatif, toujours constructif`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessaie dans un instant." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits insuffisants." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu répondre.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
