import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { fileBase64, fileName, fileType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isImage = fileType.startsWith("image/");

    const extractionPrompt = `RÔLE : Tu es un SCANNER/OCR. Tu COPIES le texte du CV, tu ne le réécris pas.

INSTRUCTIONS ABSOLUES - VIOLATION = ÉCHEC :

1. COPIE EXACTE : Chaque donnée doit être IDENTIQUE à ce qui est écrit sur le CV.
   - Si le CV dit "Développeur Full Stack", tu écris "Développeur Full Stack" (pas "Développeur Web", pas "Full-Stack Developer")
   - Si le CV dit "+221 77 123 45 67", tu écris "+221 77 123 45 67" exactement
   - Si le CV liste "React, Node.js, Python", tu listes ["React", "Node.js", "Python"] - RIEN DE PLUS

2. ZÉRO INVENTION : Tu ne dois JAMAIS :
   - Ajouter des compétences qui ne sont pas listées
   - Modifier un intitulé de poste
   - Changer un nom d'entreprise
   - Inventer une description de poste
   - Ajouter des technologies non mentionnées
   - Reformuler les missions/descriptions

3. DATES : Copie les dates EXACTEMENT comme elles apparaissent.
   - "Janvier 2020 - Présent" → dateDebut: "Janvier 2020", dateFin: "Présent"
   - "2019-2022" → dateDebut: "2019", dateFin: "2022"
   - "Depuis 2021" → dateDebut: "2021", dateFin: "Présent"

4. CHAMPS VIDES : Si une info n'existe pas sur le CV, laisse le champ VIDE (""). N'invente RIEN.

5. RECOMMANDATIONS : C'est le SEUL endroit où tu donnes ton expertise. Sois précis et utile.

Fichier : ${fileName} (${fileType})`;

    const userContent: any[] = [{ type: "text", text: extractionPrompt }];

    if (isImage) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${fileType};base64,${fileBase64}` },
      });
    } else {
      // For PDFs: send as document
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${fileType};base64,${fileBase64}` },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `Tu es un SCANNER OCR. Tu extrais les données d'un CV SANS AUCUNE MODIFICATION. Tu copies mot pour mot. Tu n'ajoutes rien, tu ne reformules rien, tu ne corriges rien. Si une information n'est pas sur le CV, tu laisses le champ vide. Les recommandations sont le SEUL endroit où tu peux t'exprimer.`,
          },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_cv_data",
              description: "Scanner et copier fidèlement les données du CV",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Score de qualité 0-100" },
                  summary: { type: "string", description: "Ton évaluation en 2 phrases (pas un résumé du CV)" },
                  personal: {
                    type: "object",
                    properties: {
                      prenom: { type: "string", description: "COPIE EXACTE du prénom" },
                      nom: { type: "string", description: "COPIE EXACTE du nom" },
                      poste: { type: "string", description: "COPIE EXACTE de l'intitulé de poste/titre" },
                      email: { type: "string", description: "COPIE EXACTE de l'email" },
                      telephone: { type: "string", description: "COPIE EXACTE du téléphone" },
                      ville: { type: "string", description: "COPIE EXACTE de la ville/adresse" },
                    },
                    required: ["prenom", "nom", "poste"],
                  },
                  diplomas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        diplome: { type: "string", description: "COPIE EXACTE du diplôme" },
                        ecole: { type: "string", description: "COPIE EXACTE de l'école" },
                        annee: { type: "string", description: "COPIE EXACTE de l'année/période" },
                        mention: { type: "string" },
                      },
                      required: ["diplome", "ecole", "annee"],
                    },
                  },
                  experiences: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        poste: { type: "string", description: "COPIE EXACTE du poste" },
                        entreprise: { type: "string", description: "COPIE EXACTE de l'entreprise" },
                        dateDebut: { type: "string", description: "COPIE EXACTE de la date de début" },
                        dateFin: { type: "string", description: "COPIE EXACTE de la date de fin" },
                        description: { type: "string", description: "COPIE EXACTE de la description des missions" },
                      },
                      required: ["poste", "entreprise"],
                    },
                  },
                  skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "COPIE EXACTE de la liste de compétences - NE PAS EN AJOUTER"
                  },
                  languages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        langue: { type: "string" },
                        niveau: { type: "string" },
                      },
                      required: ["langue", "niveau"],
                    },
                  },
                  interests: { type: "string", description: "COPIE EXACTE des centres d'intérêt" },
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["improvement", "missing", "tip"] },
                        section: { type: "string" },
                        message: { type: "string" },
                      },
                      required: ["type", "section", "message"],
                    },
                  },
                },
                required: ["score", "summary", "personal", "recommendations"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_cv_data" } },
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
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    let parsed;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("Failed to parse tool call arguments");
    }

    const formData = {
      personal: {
        prenom: parsed.personal?.prenom || "",
        nom: parsed.personal?.nom || "",
        poste: parsed.personal?.poste || "",
        email: parsed.personal?.email || "",
        telephone: parsed.personal?.telephone || "",
        ville: parsed.personal?.ville || "",
      },
      diplomas: (parsed.diplomas || []).map((d: any) => ({
        id: crypto.randomUUID(),
        diplome: d.diplome || "",
        ecole: d.ecole || "",
        annee: d.annee || "",
        mention: d.mention || "",
      })),
      experiences: (parsed.experiences || []).map((e: any) => ({
        id: crypto.randomUUID(),
        poste: e.poste || "",
        entreprise: e.entreprise || "",
        dateDebut: e.dateDebut || "",
        dateFin: e.dateFin || "",
        description: e.description || "",
      })),
      noExperience: (parsed.experiences || []).length === 0,
      skills: parsed.skills || [],
      languages: parsed.languages || [{ langue: "Français", niveau: "Natif" }],
      interests: parsed.interests || "",
    };

    if (formData.diplomas.length === 0) {
      formData.diplomas = [{ id: crypto.randomUUID(), diplome: "", ecole: "", annee: "", mention: "" }];
    }
    if (formData.experiences.length === 0) {
      formData.experiences = [{ id: crypto.randomUUID(), poste: "", entreprise: "", dateDebut: "", dateFin: "", description: "" }];
    }

    return new Response(JSON.stringify({
      formData,
      recommendations: parsed.recommendations || [],
      score: parsed.score || 50,
      summary: parsed.summary || "CV analysé avec succès.",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-parse-cv error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
