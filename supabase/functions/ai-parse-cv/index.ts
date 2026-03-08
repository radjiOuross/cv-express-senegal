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
    const mimeType = fileType;

    const userContent: any[] = [
      {
        type: "text",
        text: `Tu es un expert RH sénégalais. Analyse ce CV uploadé et:
1. Extrais TOUTES les données structurées (nom, prénom, poste, email, téléphone, ville, formations, expériences, compétences, langues, centres d'intérêt)
2. Évalue la qualité du CV (score sur 100)
3. Donne des recommandations précises pour l'améliorer

Le fichier est: ${fileName} (${fileType})

Utilise l'outil extract_cv_data pour retourner les données.`,
      },
    ];

    if (isImage) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${mimeType};base64,${fileBase64}` },
      });
    } else {
      userContent.push({
        type: "text",
        text: `[Contenu du fichier en base64 - type: ${mimeType}]\n${fileBase64.substring(0, 50000)}`,
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Tu es un expert RH qui analyse des CV. Tu dois extraire les données et donner des recommandations. Utilise l'outil fourni pour structurer ta réponse.",
          },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_cv_data",
              description: "Extraire les données structurées d'un CV et fournir des recommandations",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Score de qualité du CV de 0 à 100" },
                  summary: { type: "string", description: "Résumé court de l'évaluation du CV (2 phrases max)" },
                  personal: {
                    type: "object",
                    properties: {
                      prenom: { type: "string" },
                      nom: { type: "string" },
                      poste: { type: "string" },
                      email: { type: "string" },
                      telephone: { type: "string" },
                      ville: { type: "string" },
                    },
                    required: ["prenom", "nom", "poste"],
                  },
                  diplomas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        diplome: { type: "string" },
                        ecole: { type: "string" },
                        annee: { type: "string" },
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
                        poste: { type: "string" },
                        entreprise: { type: "string" },
                        dateDebut: { type: "string" },
                        dateFin: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["poste", "entreprise"],
                    },
                  },
                  skills: { type: "array", items: { type: "string" } },
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
                  interests: { type: "string" },
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

    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    let parsed;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("Failed to parse tool call arguments");
    }

    // Build FormData structure
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

    // Ensure at least one diploma/experience entry
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
