import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RR_BASE = "https://rxresu.me/api/openapi";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const API_KEY = Deno.env.get("REACTIVE_RESUME_API_KEY");
    if (!API_KEY) throw new Error("REACTIVE_RESUME_API_KEY is not configured");

    const { formData, aiData, template, customization } = await req.json();

    const personal = formData?.personal || {};
    const experiences = aiData?.experiences_optimisees || formData?.experiences || [];
    const diplomas = aiData?.formation || formData?.diplomas || [];
    const skills = aiData?.competences || formData?.skills || [];
    const languages = aiData?.langues || formData?.languages || [];
    const summary = aiData?.summary || "";
    const interests = formData?.interests || "";

    // Map template names to Reactive Resume templates
    const templateMap: Record<string, string> = {
      executive: "azurill",
      creative: "chikorita",
      prestige: "glalie",
      tech: "onyx",
    };

    // Map to Reactive Resume ResumeData schema
    const resumeData = {
      basics: {
        name: `${personal.prenom || ""} ${personal.nom || ""}`.trim(),
        headline: personal.poste || "",
        email: personal.email || "",
        phone: personal.telephone || "",
        location: personal.ville || "",
        website: { url: "", label: "" },
        customFields: [],
      },
      picture: {
        hidden: !personal.photo || customization?.photoStyle === "none",
        url: personal.photo || "",
        size: 128,
        rotation: 0,
        aspectRatio: 1,
        borderRadius: customization?.photoStyle === "circle" ? 50 : customization?.photoStyle === "rounded" ? 12 : 0,
        borderColor: customization?.colors?.primary || "#00A651",
        borderWidth: customization?.photoBorder ? 2 : 0,
        shadowColor: "",
        shadowWidth: 0,
      },
      summary: {
        title: "Profil Professionnel",
        columns: 1,
        hidden: false,
        content: summary,
      },
      sections: {
        experience: {
          title: "Expériences Professionnelles",
          columns: 1,
          hidden: false,
          items: experiences.map((exp: any, i: number) => ({
            id: `exp-${i}`,
            hidden: false,
            company: exp.entreprise || "",
            position: exp.poste || "",
            location: "",
            period: `${exp.dateDebut || ""} — ${exp.dateFin || "Présent"}`,
            website: { url: "", label: "" },
            description: exp.description || "",
            options: { showLinkInTitle: false },
          })),
        },
        education: {
          title: "Formation",
          columns: 1,
          hidden: false,
          items: diplomas.map((d: any, i: number) => ({
            id: `edu-${i}`,
            hidden: false,
            school: d.ecole || "",
            degree: d.diplome || "",
            area: d.mention || "",
            grade: "",
            location: "",
            period: d.annee || "",
            website: { url: "", label: "" },
            description: "",
            options: { showLinkInTitle: false },
          })),
        },
        skills: {
          title: "Compétences",
          columns: 2,
          hidden: false,
          items: skills.map((s: string, i: number) => ({
            id: `skill-${i}`,
            hidden: false,
            icon: "",
            name: s,
            proficiency: "Avancé",
            level: 4,
            keywords: [],
            options: { showLinkInTitle: false },
          })),
        },
        languages: {
          title: "Langues",
          columns: 2,
          hidden: false,
          items: languages.map((l: any, i: number) => ({
            id: `lang-${i}`,
            hidden: false,
            language: l.langue || "",
            fluency: l.niveau || "",
            level: l.niveau === "Natif" ? 5 : l.niveau === "Courant" ? 4 : l.niveau === "Avancé" ? 3 : l.niveau === "Intermédiaire" ? 2 : 1,
            options: { showLinkInTitle: false },
          })),
        },
        interests: {
          title: "Centres d'intérêt",
          columns: 2,
          hidden: !interests,
          items: interests ? interests.split(",").map((item: string, i: number) => ({
            id: `int-${i}`,
            hidden: false,
            icon: "",
            name: item.trim(),
            keywords: [],
            options: { showLinkInTitle: false },
          })) : [],
        },
        profiles: { title: "Profils", columns: 1, hidden: true, items: [] },
        projects: { title: "Projets", columns: 1, hidden: true, items: [] },
        awards: { title: "Prix", columns: 1, hidden: true, items: [] },
        certifications: { title: "Certifications", columns: 1, hidden: true, items: [] },
        publications: { title: "Publications", columns: 1, hidden: true, items: [] },
        volunteer: { title: "Bénévolat", columns: 1, hidden: true, items: [] },
        references: { title: "Références", columns: 1, hidden: true, items: [] },
      },
      customSections: [],
      metadata: {
        template: templateMap[template] || "azurill",
        layout: {
          sidebarWidth: 35,
          pages: [
            {
              fullWidth: true,
              main: ["experience", "education", "projects"],
              sidebar: ["skills", "languages", "interests"],
            },
          ],
        },
        css: { enabled: false, value: "" },
        page: {
          gapX: 24,
          gapY: 24,
          marginX: 36,
          marginY: 36,
          format: "a4",
          locale: "fr-FR",
          hideIcons: false,
        },
        design: {
          level: { icon: "", type: "filled" },
          colors: {
            primary: customization?.colors?.primary || "#00A651",
            text: "#1a1a1a",
            background: "#ffffff",
          },
        },
        typography: {
          body: {
            fontFamily: "Open Sans",
            fontWeights: ["400", "600"],
            fontSize: 13,
            lineHeight: 1.5,
          },
          heading: {
            fontFamily: "Playfair Display",
            fontWeights: ["600", "700"],
            fontSize: 16,
            lineHeight: 1.3,
          },
        },
        notes: "",
      },
    };

    // Step 1: Import resume
    console.log("Importing resume to Reactive Resume...");
    const importRes = await fetch(`${RR_BASE}/resumes/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ data: resumeData }),
    });

    if (!importRes.ok) {
      const errorText = await importRes.text();
      console.error("Import error:", importRes.status, errorText);
      throw new Error(`Reactive Resume import failed [${importRes.status}]: ${errorText}`);
    }

    const resumeId = await importRes.text();
    const cleanId = resumeId.replace(/"/g, "");
    console.log("Resume imported with ID:", cleanId);

    // Step 2: Export as PDF
    console.log("Exporting resume as PDF...");
    const pdfRes = await fetch(`${RR_BASE}/resumes/${cleanId}/pdf`, {
      headers: { "x-api-key": API_KEY },
    });

    if (!pdfRes.ok) {
      const errorText = await pdfRes.text();
      console.error("PDF export error:", pdfRes.status, errorText);
      throw new Error(`Reactive Resume PDF export failed [${pdfRes.status}]: ${errorText}`);
    }

    const pdfUrl = await pdfRes.text();
    console.log("PDF URL:", pdfUrl);

    // Step 3: Delete the resume to keep account clean
    try {
      await fetch(`${RR_BASE}/resumes/${cleanId}`, {
        method: "DELETE",
        headers: { "x-api-key": API_KEY },
      });
    } catch (e) {
      console.warn("Cleanup delete failed:", e);
    }

    return new Response(JSON.stringify({ pdfUrl: pdfUrl.replace(/"/g, ""), resumeId: cleanId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("reactive-resume-export error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
