import { FormData, AIData } from "@/types/cv";

interface Props {
  formData: FormData;
  aiData: AIData | null;
}

const CVElegant = ({ formData, aiData }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const gold = "#C9A84C";

  const levelToSquares = (index: number) => 3 + (index % 3);

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "'Cormorant Garamond', serif", fontSize: 11, backgroundColor: "#fff", padding: "50px 50px 40px", color: "#333" }}>
      {/* Top gold line */}
      <div style={{ height: 1, backgroundColor: gold, marginBottom: 32 }} />

      {/* Name */}
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 600, textAlign: "center", color: "#111", lineHeight: 1, marginBottom: 6 }}>
        {personal.prenom} {personal.nom}
      </h1>
      <p style={{ textAlign: "center", fontSize: 12, textTransform: "uppercase", color: "#888", letterSpacing: 3, marginBottom: 16 }}>
        {personal.poste}
      </p>

      {/* Contact row */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, fontSize: 11, color: "#777", marginBottom: 16 }}>
        {[personal.ville, personal.telephone, personal.email].filter(Boolean).map((item, i, arr) => (
          <span key={i} style={{ display: "flex", alignItems: "center" }}>
            <span>{item}</span>
            {i < arr.length - 1 && <span style={{ margin: "0 12px", width: 1, height: 12, backgroundColor: "#ccc", display: "inline-block" }} />}
          </span>
        ))}
      </div>

      {/* Gold separator */}
      <div style={{ height: 1, backgroundColor: gold, marginBottom: 28 }} />

      {/* Summary */}
      {summary && (
        <p style={{ textAlign: "center", fontSize: 11, lineHeight: 1.7, color: "#555", fontStyle: "italic", marginBottom: 28, maxWidth: 600, margin: "0 auto 28px" }}>
          {summary}
        </p>
      )}

      {/* 3-column body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 28 }}>
        {/* Left: Formation + Langues */}
        <div>
          {formation.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: gold, letterSpacing: 2, marginBottom: 4 }}>Formation</h3>
              <div style={{ width: 30, height: 1.5, backgroundColor: gold, marginBottom: 12 }} />
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{f.diplome}</div>
                  <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{f.ecole}</div>
                  <div style={{ fontSize: 9, color: gold }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                </div>
              ))}
            </div>
          )}

          {langues.length > 0 && (
            <div>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: gold, letterSpacing: 2, marginBottom: 4 }}>Langues</h3>
              <div style={{ width: 30, height: 1.5, backgroundColor: gold, marginBottom: 12 }} />
              {langues.map((l, i) => (
                <div key={i} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11 }}>{l.langue}</span>
                  <span style={{ fontSize: 9, color: "#888" }}>{l.niveau}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center: Expériences */}
        <div>
          {experiences.length > 0 && (
            <div>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: gold, letterSpacing: 2, marginBottom: 4 }}>Expériences</h3>
              <div style={{ width: 30, height: 1.5, backgroundColor: gold, marginBottom: 12 }} />
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{exp.poste}</div>
                  <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{exp.entreprise}</div>
                  <div style={{ fontSize: 9, color: gold, marginBottom: 4 }}>{exp.dateDebut} — {exp.dateFin}</div>
                  <p style={{ fontSize: 10, lineHeight: 1.6, color: "#555" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Compétences + Intérêts */}
        <div>
          {skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: gold, letterSpacing: 2, marginBottom: 4 }}>Compétences</h3>
              <div style={{ width: 30, height: 1.5, backgroundColor: gold, marginBottom: 12 }} />
              {skills.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 10 }}>{s}</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1, 2, 3, 4, 5].map((sq) => (
                      <div key={sq} style={{
                        width: 7, height: 7,
                        backgroundColor: sq <= levelToSquares(i) ? gold : "#e5e5e5"
                      }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.interests && (
            <div>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: gold, letterSpacing: 2, marginBottom: 4 }}>Centres d'intérêt</h3>
              <div style={{ width: 30, height: 1.5, backgroundColor: gold, marginBottom: 12 }} />
              <p style={{ fontSize: 10, lineHeight: 1.6, color: "#555" }}>{formData.interests}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVElegant;
