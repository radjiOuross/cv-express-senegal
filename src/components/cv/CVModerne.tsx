import { FormData, AIData } from "@/types/cv";

interface Props {
  formData: FormData;
  aiData: AIData | null;
}

const CVModerne = ({ formData, aiData }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "Inter, sans-serif", fontSize: 11, backgroundColor: "white" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #00A651, #007a3d)", padding: "36px 40px", color: "white", display: "flex", alignItems: "center", gap: 24 }}>
        {personal.photo && (
          <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", border: "3px solid white", flexShrink: 0 }}>
            <img src={personal.photo} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{personal.prenom} {personal.nom}</h1>
          <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>{personal.poste}</p>
          <div style={{ display: "flex", gap: 16, fontSize: 10, opacity: 0.85 }}>
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.telephone && <span>📞 {personal.telephone}</span>}
            {personal.ville && <span>📍 {personal.ville}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", padding: "32px 40px", gap: 32 }}>
        {/* Left */}
        <div style={{ flex: 1, borderRight: "1px solid #eee", paddingRight: 32 }}>
          {summary && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#00A651", letterSpacing: 2, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                Profil <span style={{ flex: 1, height: 1, backgroundColor: "#00A651" }} />
              </h2>
              <p style={{ fontSize: 11, lineHeight: 1.6, color: "#444" }}>{summary}</p>
            </div>
          )}

          {/* Formation */}
          {formation.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#00A651", letterSpacing: 2, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                Formation <span style={{ flex: 1, height: 1, backgroundColor: "#00A651" }} />
              </h2>
              {formation.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#00A651", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>{f.ecole} • {f.annee}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#00A651", letterSpacing: 2, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                Compétences <span style={{ flex: 1, height: 1, backgroundColor: "#00A651" }} />
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ backgroundColor: "#00A65115", color: "#00A651", padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {langues.length > 0 && (
            <div>
              <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#00A651", letterSpacing: 2, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                Langues <span style={{ flex: 1, height: 1, backgroundColor: "#00A651" }} />
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {langues.map((l, i) => (
                  <span key={i} style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 500 }}>
                    {l.langue} — {l.niveau}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right - Experiences */}
        <div style={{ flex: 1 }}>
          {experiences.length > 0 && (
            <div>
              <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#00A651", letterSpacing: 2, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                Expériences <span style={{ flex: 1, height: 1, backgroundColor: "#00A651" }} />
              </h2>
              {experiences.map((exp, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#00A651", flexShrink: 0 }} />
                    {i < experiences.length - 1 && <div style={{ width: 2, flex: 1, backgroundColor: "#00A651", opacity: 0.3 }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{exp.poste}</div>
                    <div style={{ fontSize: 10, color: "#00A651", fontWeight: 500, marginBottom: 4 }}>{exp.entreprise}</div>
                    <div style={{ fontSize: 9, color: "#999", marginBottom: 4 }}>{exp.dateDebut} — {exp.dateFin}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.5, color: "#555" }}>{exp.description}</p>
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

export default CVModerne;
