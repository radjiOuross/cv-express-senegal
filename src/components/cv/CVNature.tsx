import { FormData, AIData } from "@/types/cv";

interface Props {
  formData: FormData;
  aiData: AIData | null;
}

const levelToDots = (niveau: string) => {
  const map: Record<string, number> = { "Débutant": 1, "Intermédiaire": 2, "Avancé": 3, "Courant": 4, "Natif": 5 };
  return map[niveau] || 3;
};

const CVNature = ({ formData, aiData }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const green = "#2d6a4f";
  const lightGreen = "#95d5b2";
  const cream = "#f5f0e8";

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "'DM Sans', sans-serif", fontSize: 11, backgroundColor: cream }}>
      {/* Header */}
      <div style={{ backgroundColor: green, padding: "36px 40px", color: "#fff" }}>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: 36, fontWeight: 400, marginBottom: 4 }}>
          {personal.prenom} {personal.nom}
        </h1>
        <p style={{ fontSize: 13, color: lightGreen, marginBottom: 12 }}>{personal.poste}</p>
        <div style={{ display: "flex", gap: 20, fontSize: 10, color: "#fff", opacity: 0.9 }}>
          {personal.email && <span>🌿 {personal.email}</span>}
          {personal.telephone && <span>🌿 {personal.telephone}</span>}
          {personal.ville && <span>🌿 {personal.ville}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", padding: "28px 32px", gap: 24 }}>
        {/* Left */}
        <div style={{ width: "35%", flexShrink: 0 }}>
          <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {personal.photo && (
              <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", margin: "0 auto 16px", border: `3px solid ${green}` }}>
                <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {summary && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 11, textTransform: "uppercase", color: green, letterSpacing: 1, marginBottom: 8 }}>🌿 Profil</h3>
                <p style={{ fontSize: 10, lineHeight: 1.6, color: "#555" }}>{summary}</p>
              </div>
            )}

            {skills.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 11, textTransform: "uppercase", color: green, letterSpacing: 1, marginBottom: 8 }}>🌿 Compétences</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{ backgroundColor: "#e8f5e9", color: green, padding: "4px 10px", borderRadius: 16, fontSize: 9, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {langues.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 11, textTransform: "uppercase", color: green, letterSpacing: 1, marginBottom: 8 }}>🌿 Langues</h3>
                {langues.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 10 }}>{l.langue}</span>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3, 4, 5].map((d) => (
                        <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: d <= levelToDots(l.niveau) ? green : "#ddd" }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.interests && (
              <div>
                <h3 style={{ fontSize: 11, textTransform: "uppercase", color: green, letterSpacing: 1, marginBottom: 8 }}>🌿 Centres d'intérêt</h3>
                <p style={{ fontSize: 10, lineHeight: 1.5, color: "#555" }}>{formData.interests}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ flex: 1 }}>
          {experiences.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 11, textTransform: "uppercase", color: green, letterSpacing: 1, marginBottom: 12 }}>🌿 Expériences</h3>
              {experiences.map((exp, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: green, flexShrink: 0 }} />
                    {i < experiences.length - 1 && <div style={{ width: 2, flex: 1, backgroundColor: green, opacity: 0.25 }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#222" }}>{exp.poste}</div>
                    <div style={{ fontSize: 10, color: green, fontWeight: 500 }}>{exp.entreprise}</div>
                    <div style={{ fontSize: 9, color: "#999", marginBottom: 4 }}>{exp.dateDebut} — {exp.dateFin}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.5, color: "#555" }}>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formation.length > 0 && (
            <div>
              <h3 style={{ fontSize: 11, textTransform: "uppercase", color: green, letterSpacing: 1, marginBottom: 12 }}>🌿 Formation</h3>
              {formation.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: green, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#777" }}>{f.ecole} • {f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVNature;
