import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const levelToDots = (niveau: string) => {
  const map: Record<string, number> = { "Débutant": 1, "Intermédiaire": 2, "Avancé": 3, "Courant": 4, "Natif": 5 };
  return map[niveau] || 3;
};

const CVMinimaliste = ({ formData, aiData, customization }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const pc = customization.colors.primary;
  const density = getDensityStyles(customization.density);
  const displayFont = `'${customization.font.display}', serif`;
  const bodyFont = `'${customization.font.body}', sans-serif`;
  const sections = getOrderedSections(customization);

  const leftSections = sections.filter(s => ["skills", "formation", "languages"].includes(s));
  const rightSections = sections.filter(s => ["summary", "experiences", "interests"].includes(s));

  const heading = (t: string) => (
    <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#333", letterSpacing: 2, marginBottom: 14, fontFamily: displayFont, paddingBottom: 6, borderBottom: `1.5px solid ${pc}` }}>{t}</h3>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: "#fff", padding: "48px 44px", color: "#333" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 20, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: displayFont, fontSize: 38, fontWeight: 300, color: "#111", lineHeight: 1.1, marginBottom: 6, letterSpacing: -0.5 }}>
            <span style={{ fontWeight: 700 }}>{personal.prenom}</span> {personal.nom}
          </h1>
          <p style={{ fontSize: 13, color: pc, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>{personal.poste}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#666", lineHeight: 2 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.telephone && <div>{personal.telephone}</div>}
          {personal.ville && <div>{personal.ville}</div>}
        </div>
      </div>

      <div style={{ height: 2, backgroundColor: pc, marginBottom: 28 }} />

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: 36 }}>
        <div>
          {leftSections.map(id => {
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {heading("Compétences")}
                {renderSkills(skills, customization.skillStyle, pc)}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {heading("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#222" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>{f.ecole}</div>
                    <div style={{ fontSize: 9, color: pc, fontWeight: 500 }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                  </div>
                ))}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {heading("Langues")}
                {langues.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 500 }}>{l.langue}</span>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div key={dot} style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: dot <= levelToDots(l.niveau) ? pc : "#e0e0e0" }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        <div>
          {rightSections.map(id => {
            if (id === "summary" && summary) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {heading("Profil")}
                <p style={{ fontSize: 10.5, lineHeight: density.lineHeight, color: "#444", textAlign: "justify" }}>{summary}</p>
              </div>
            );
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {heading("Expérience professionnelle")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{exp.poste}</span>
                      <span style={{ fontSize: 9, color: "#999", whiteSpace: "nowrap" }}>{exp.dateDebut} — {exp.dateFin}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginBottom: 4 }}>{exp.entreprise}</div>
                    <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            if (id === "interests" && formData.interests) return (
              <div key={id}>
                {heading("Centres d'intérêt")}
                <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{formData.interests}</p>
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CVMinimaliste;
