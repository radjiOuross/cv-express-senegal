import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { formData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Tu es un expert RH sénégalais spécialisé dans la rédaction de CV professionnels. Améliore ce CV en français professionnel.

Données du candidat:
- Nom: ${formData.personal?.prenom} ${formData.personal?.nom}
- Poste recherché: ${formData.personal?.poste}
- Formation: ${JSON.stringify(formData.diplomas || [])}
- Expériences: ${JSON.stringify(formData.experiences || [])}
- Compétences: ${JSON.stringify(formData.skills || [])}
- Langues: ${JSON.stringify(formData.languages || [])}
- Pas d'expérience: ${formData.noExperience ? "Oui" : "Non"}

Retourne UNIQUEMENT un JSON valide (sans markdown, sans backticks) avec cette structure:
{
  "summary": "Un résumé professionnel de 2-3 phrases",
  "experiences_optimisees": [{"poste": "", "entreprise": "", "dateDebut": "", "dateFin": "", "description": "description améliorée avec des verbes d'action"}],
  "competences": ["compétence améliorée"],
  "formation": [{"diplome": "", "ecole": "", "annee": "", "mention": ""}],
  "langues": [{"langue": "", "niveau": ""}]
}

Si le candidat n'a pas d'expérience, crée des expériences de stage fictives pertinentes pour le poste.
Améliore les descriptions avec des verbes d'action et des résultats quantifiables.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Tu es un assistant qui retourne uniquement du JSON valide, sans aucun formatage markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Clean markdown formatting if present
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    
    let aiData;
    try {
      aiData = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", jsonStr);
      // Return raw form data as fallback
      aiData = {
        summary: `Professionnel motivé à la recherche d'un poste de ${formData.personal?.poste || "collaborateur"}.`,
        experiences_optimisees: formData.experiences || [],
        competences: formData.skills || [],
        formation: formData.diplomas || [],
        langues: formData.languages || [],
      };
    }

    return new Response(JSON.stringify({ aiData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-cv error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
