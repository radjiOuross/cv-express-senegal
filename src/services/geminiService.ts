const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      })
    }
  );
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

export function getCoachSystemPrompt(cvDataJson: string): string {
  return `Tu es Coach CVExpress, un coach carrière expert et bienveillant spécialisé dans le marché de l'emploi sénégalais et ouest-africain.

Tu connais parfaitement:
- Les entreprises sénégalaises: Sonatel, Wave, Orange, CBAO, Ecobank, BICIS, Groupe Bolloré, Total Sénégal, Gainde 2000, Air Sénégal, AIBD, ONAS...
- Les salaires moyens par secteur en FCFA
- Les codes culturels professionnels au Sénégal
- Les plateformes d'emploi locales: Emploi.sn, Jobartoo
- Le droit du travail sénégalais basique
- Les spécificités du marché UEMOA/CEDEAO

CV complet du candidat que tu coaches: ${cvDataJson}

Règles de communication:
- Toujours en français, ton chaleureux et encourageant
- Réponses courtes et actionnables (max 120 mots)
- Donne toujours au moins 1 conseil concret
- Utilise des emojis avec modération
- Si tu génères un template email/lettre: formate-le clairement entre guillemets
- Ne sois jamais négatif, toujours constructif`;
}

export function getVideoScriptPrompt(cvDataJson: string): string {
  return `Rédige un script de présentation professionnelle de 60 secondes (exactement 140-160 mots) pour ce candidat.

Règles STRICTES:
- Commence par une accroche mémorable et personnelle
- Cite 1-2 réalisations concrètes avec chiffres si possible
- Exprime clairement la valeur unique du candidat
- Adapte le ton au secteur d'activité
- Termine par un appel à l'action chaleureux
- Style: naturel, conversationnel, pas robotique
- Adapté au marché sénégalais et professionnel africain
- PAS de formules génériques comme 'Je suis motivé'

Retourne UNIQUEMENT le texte du script, sans titre ni JSON.

CV: ${cvDataJson}`;
}

export async function callCoach(userMessage: string, history: { role: string; content: string }[], cvDataJson: string): Promise<string> {
  const systemPrompt = getCoachSystemPrompt(cvDataJson);
  const conversationText = history.map(m => `${m.role === 'user' ? 'Candidat' : 'Coach'}: ${m.content}`).join('\n');
  const fullPrompt = `${systemPrompt}\n\nHistorique de conversation:\n${conversationText}\n\nCandidat: ${userMessage}\n\nCoach:`;
  return callGemini(fullPrompt);
}

export async function generateVideoScript(cvDataJson: string): Promise<string> {
  const prompt = getVideoScriptPrompt(cvDataJson);
  return callGemini(prompt);
}
