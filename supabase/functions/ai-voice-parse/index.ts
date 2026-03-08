import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { type } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let transcript = body.transcript;

    // If audio is provided (MediaRecorder recording), transcribe it first
    if (body.audio && !transcript) {
      const mimeType = body.mimeType || "audio/webm";

      // Use Gemini multimodal to transcribe audio
      const transcribeResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Transcris exactement ce que la personne dit dans cet audio en français. Retourne uniquement la transcription texte brute, rien d'autre." },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${body.audio}`,
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!transcribeResponse.ok) {
        const status = transcribeResponse.status;
        console.error("Transcription error:", status, await transcribeResponse.text());
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`Transcription error: ${status}`);
      }

      const transcribeData = await transcribeResponse.json();
      transcript = transcribeData.choices?.[0]?.message?.content?.trim() || "";
      console.log("Transcribed audio:", transcript);

      if (!transcript) {
        return new Response(JSON.stringify({ parsed: {} }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    if (!transcript) {
      return new Response(JSON.stringify({ parsed: {} }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Now extract structured data from transcript
    let prompt = "";
    if (type === "personal") {
      prompt = `Extrait les informations personnelles de ce texte en français et retourne UNIQUEMENT ce JSON sans markdown:
{"prenom":"","nom":"","poste":"","email":"","telephone":"","ville":""}
Laisse vide les champs non mentionnés. Texte: "${transcript}"`;
    } else {
      prompt = `Extrait les informations d'expérience professionnelle de ce texte en français et retourne UNIQUEMENT ce JSON sans markdown:
{"poste":"","entreprise":"","dateDebut":"","dateFin":"","description":""}
Laisse vide les champs non mentionnés. Texte: "${transcript}"`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Tu retournes uniquement du JSON valide sans formatage markdown." },
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

    let parsed;
    try { parsed = JSON.parse(content); } catch { parsed = {}; }

    return new Response(JSON.stringify({ parsed }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-voice-parse error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
