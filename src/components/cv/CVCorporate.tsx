import { FormData, AIData } from "@/types/cv";

interface Props {
  formData: FormData;
  aiData: AIData | null;
}

const CVCorporate = ({ formData, aiData }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const blue = "#003580";
  const lightBlue = "#7eb3ff";

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "'DM Sans', sans-serif", fontSize: 11, backgroundColor: "#fff" }}>
      {/* Header */}
      <div style={{ backgroundColor: blue, height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{personal.prenom} {personal.nom}</h1>
        <p style={{ fontSize: 13, color: lightBlue }}>{personal.poste}</p>
      </div>

      {/* Contact row */}
      <div style={{ borderBottom: `2px solid ${blue}`, padding: "10px 40px", display: "flex", alignItems: "center", gap: 0, fontSize: 12, color: "#444" }}>
        {[personal.email, personal.telephone, personal.ville].filter(Boolean).map((item, i, arr) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff" }}>
              {["✉", "☎", "📍"][i]}
            </div>
            <span>{item}</span>
            {i < arr.length - 1 && <span style={{ margin: "0 12px", color: "#ccc" }}>•</span>}
          </span>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: "28px 40px" }}>
        {summary && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "inline-block", backgroundColor: blue, color: "#fff", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, padding: "5px 16px", borderRadius: 4, marginBottom: 10 }}>Profil</div>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: "#444" }}>{summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "inline-block", backgroundColor: blue, color: "#fff", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, padding: "5px 16px", borderRadius: 4, marginBottom: 12 }}>Expériences</div>
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: blue }}>{exp.poste}</div>
                <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{exp.entreprise}</div>
                <span style={{ display: "inline-block", fontSize: 9, color: blue, backgroundColor: "#e8f0fe", borderRadius: 10, padding: "2px 10px", marginTop: 2, marginBottom: 4 }}>
                  {exp.dateDebut} — {exp.dateFin}
                </span>
                <p style={{ fontSize: 10, lineHeight: 1.5, color: "#555" }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {formation.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "inline-block", backgroundColor: blue, color: "#fff", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, padding: "5px 16px", borderRadius: 4, marginBottom: 12 }}>Formation</div>
            {formation.map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: blue }}>{f.diplome}</div>
                <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{f.ecole}</div>
                <span style={{ display: "inline-block", fontSize: 9, color: blue, backgroundColor: "#e8f0fe", borderRadius: 10, padding: "2px 10px", marginTop: 2 }}>
                  {f.annee}{f.mention ? ` — ${f.mention}` : ""}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Skills grid */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "inline-block", backgroundColor: blue, color: "#fff", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, padding: "5px 16px", borderRadius: 4, marginBottom: 12 }}>Compétences</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ backgroundColor: "#e8f0fe", color: blue, padding: "6px 12px", borderRadius: 6, fontSize: 10, fontWeight: 500, textAlign: "center" }}>{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {langues.length > 0 && (
          <div>
            <div style={{ display: "inline-block", backgroundColor: blue, color: "#fff", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, padding: "5px 16px", borderRadius: 4, marginBottom: 12 }}>Langues</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {langues.map((l, i) => (
                <span key={i} style={{ backgroundColor: "#e8f0fe", color: blue, padding: "4px 14px", borderRadius: 20, fontSize: 10, fontWeight: 500 }}>
                  {l.langue} — {l.niveau}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVCorporate;
