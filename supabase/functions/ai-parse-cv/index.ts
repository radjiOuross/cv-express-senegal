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
        text: `Tu es un extracteur de données de CV. Ta mission est d'extraire FIDÈLEMENT et EXACTEMENT les informations présentes sur ce CV, SANS RIEN MODIFIER, INVENTER ou REFORMULER.

RÈGLES STRICTES :
- Extrais les informations TELLES QUELLES, mot pour mot
- NE MODIFIE PAS les noms, prénoms, emails, téléphones, adresses
- NE MODIFIE PAS les intitulés de poste - copie exactement ce qui est écrit
- NE MODIFIE PAS les compétences listées - copie la liste exacte du CV
- N'INVENTE PAS de compétences supplémentaires, même si tu penses qu'elles sont pertinentes
- Pour les expériences, copie les dates EXACTES (format original), l'entreprise EXACTE, le poste EXACT
- Pour les descriptions d'expériences, copie le texte EXACT ou résume fidèlement sans ajouter d'informations
- NE CHANGE PAS les niveaux de langue indiqués
- Si une information n'est pas présente sur le CV, laisse le champ vide - N'INVENTE RIEN

POUR LES RECOMMANDATIONS (champ "recommendations") :
- C'est le SEUL endroit où tu peux donner ton avis d'expert RH
- Suggère des améliorations de formulation (type "improvement")
- Signale les sections manquantes (type "missing") 
- Donne des conseils pratiques (type "tip")
- Chaque recommandation doit être précise et actionnable

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
            content: `Tu es un extracteur fidèle de données de CV. Tu ne modifies JAMAIS les informations du candidat. Tu copies exactement ce qui est sur le CV. Les recommandations sont le seul endroit où tu donnes ton expertise. Tu ne dois JAMAIS inventer des compétences, changer des intitulés de poste, modifier des contacts ou reformuler des expériences.`,
          },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_cv_data",
              description: "Extraire FIDÈLEMENT les données d'un CV sans rien modifier, et fournir des recommandations d'amélioration séparément",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Score de qualité du CV de 0 à 100 basé sur la présentation, la complétude et la clarté" },
                  summary: { type: "string", description: "Résumé court de l'évaluation du CV (2 phrases max) - c'est TON évaluation, pas le résumé du candidat" },
                  personal: {
                    type: "object",
                    description: "Informations personnelles EXACTES telles qu'elles apparaissent sur le CV",
                    properties: {
                      prenom: { type: "string", description: "Prénom EXACT du candidat" },
                      nom: { type: "string", description: "Nom EXACT du candidat" },
                      poste: { type: "string", description: "Intitulé de poste EXACT tel qu'écrit sur le CV" },
                      email: { type: "string", description: "Email EXACT" },
                      telephone: { type: "string", description: "Numéro de téléphone EXACT" },
                      ville: { type: "string", description: "Ville/adresse EXACTE" },
                    },
                    required: ["prenom", "nom", "poste"],
                  },
                  diplomas: {
                    type: "array",
                    description: "Formations EXACTES telles qu'elles apparaissent sur le CV",
                    items: {
                      type: "object",
                      properties: {
                        diplome: { type: "string", description: "Intitulé EXACT du diplôme" },
                        ecole: { type: "string", description: "Nom EXACT de l'établissement" },
                        annee: { type: "string", description: "Année ou période EXACTE telle qu'écrite" },
                        mention: { type: "string" },
                      },
                      required: ["diplome", "ecole", "annee"],
                    },
                  },
                  experiences: {
                    type: "array",
                    description: "Expériences professionnelles EXACTES telles qu'elles apparaissent sur le CV",
                    items: {
                      type: "object",
                      properties: {
                        poste: { type: "string", description: "Intitulé de poste EXACT tel qu'écrit sur le CV" },
                        entreprise: { type: "string", description: "Nom EXACT de l'entreprise" },
                        dateDebut: { type: "string", description: "Date de début EXACTE telle qu'écrite" },
                        dateFin: { type: "string", description: "Date de fin EXACTE telle qu'écrite (ou 'Présent' / 'Actuel' si en cours)" },
                        description: { type: "string", description: "Description EXACTE des missions telle qu'écrite sur le CV" },
                      },
                      required: ["poste", "entreprise"],
                    },
                  },
                  skills: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Liste EXACTE des compétences telles qu'elles apparaissent sur le CV - NE PAS en ajouter"
                  },
                  languages: {
                    type: "array",
                    description: "Langues EXACTES telles qu'elles apparaissent sur le CV",
                    items: {
                      type: "object",
                      properties: {
                        langue: { type: "string" },
                        niveau: { type: "string" },
                      },
                      required: ["langue", "niveau"],
                    },
                  },
                  interests: { type: "string", description: "Centres d'intérêt EXACTS tels qu'écrits sur le CV" },
                  recommendations: {
                    type: "array",
                    description: "Tes recommandations d'expert pour AMÉLIORER le CV - c'est ici que tu donnes tes suggestions",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["improvement", "missing", "tip"], description: "improvement = reformulation suggérée, missing = section/info manquante, tip = conseil pratique" },
                        section: { type: "string", description: "La section du CV concernée" },
                        message: { type: "string", description: "Ta recommandation détaillée et actionnable" },
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
