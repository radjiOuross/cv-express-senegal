import { FormData, AIData } from "@/types/cv";

interface Props {
  formData: FormData;
  aiData: AIData | null;
}

const levelToDots = (niveau: string) => {
  const map: Record<string, number> = { "Débutant": 1, "Intermédiaire": 2, "Avancé": 3, "Courant": 4, "Natif": 5 };
  return map[niveau] || 3;
};

const CVMinimaliste = ({ formData, aiData }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "'Cormorant Garamond', serif", fontSize: 11, backgroundColor: "#fafafa", padding: 60, color: "#333" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #222", paddingBottom: 20, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: "#111", lineHeight: 1, marginBottom: 6 }}>
            {personal.prenom} {personal.nom}
          </h1>
          <p style={{ fontSize: 14, color: "#666", fontStyle: "italic" }}>{personal.poste}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#888", lineHeight: 1.8 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.telephone && <div>{personal.telephone}</div>}
          {personal.ville && <div>{personal.ville}</div>}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40 }}>
        {/* Left */}
        <div>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: "#999", letterSpacing: 3, marginBottom: 14, fontFamily: "'Cormorant Garamond', serif" }}>Compétences</h3>
              {skills.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11 }}>{s}</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div key={dot} style={{
                        width: 6, height: 6, borderRadius: "50%",
                        backgroundColor: dot <= 3 + (i % 2) ? "#333" : "#ddd"
                      }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formation */}
          {formation.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: "#999", letterSpacing: 3, marginBottom: 14, fontFamily: "'Cormorant Garamond', serif" }}>Formation</h3>
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{f.diplome}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{f.ecole}</div>
                  <div style={{ fontSize: 9, color: "#aaa" }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {langues.length > 0 && (
            <div>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: "#999", letterSpacing: 3, marginBottom: 14, fontFamily: "'Cormorant Garamond', serif" }}>Langues</h3>
              {langues.map((l, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 11 }}>{l.langue}</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div key={dot} style={{
                        width: 6, height: 6, borderRadius: "50%",
                        backgroundColor: dot <= levelToDots(l.niveau) ? "#333" : "#ddd"
                      }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div>
          {summary && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: "#999", letterSpacing: 3, marginBottom: 14, fontFamily: "'Cormorant Garamond', serif" }}>Profil</h3>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "#555", fontStyle: "italic" }}>{summary}</p>
            </div>
          )}

          {experiences.length > 0 && (
            <div>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: "#999", letterSpacing: 3, marginBottom: 14, fontFamily: "'Cormorant Garamond', serif" }}>Expériences</h3>
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{exp.poste}</span>
                      <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>— {exp.entreprise}</span>
                    </div>
                    <span style={{ fontSize: 9, color: "#aaa", whiteSpace: "nowrap" }}>{exp.dateDebut} — {exp.dateFin}</span>
                  </div>
                  <p style={{ fontSize: 10, lineHeight: 1.6, color: "#666", marginTop: 6 }}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVMinimaliste;
