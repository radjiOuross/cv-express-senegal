import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const langNames: Record<string, string> = { en: "English", es: "Spanish", ar: "Arabic" };

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { aiData, targetLang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langName = langNames[targetLang] || targetLang;
    const prompt = `Translate and culturally adapt this CV data to ${langName}.
Rules:
- Translate ALL text (summary, job descriptions, skills, education)
- Keep proper names (person name, company names) unchanged
- Adapt date formats to target language convention
- For English: use action verbs (Developed, Managed, Optimized)
- For Arabic: note right-to-left layout
- Keep section structure identical
Return ONLY valid JSON with same structure, all text translated. No markdown.
CV data: ${JSON.stringify(aiData)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Return only valid JSON without markdown formatting." },
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
    let content = data.choices?.[0]?.message?.content || "{}";
    content = content.replace(/```json|```/g, "").trim();

    let translated;
    try { translated = JSON.parse(content); } catch { translated = aiData; }

    return new Response(JSON.stringify({ translated }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-translate-cv error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
