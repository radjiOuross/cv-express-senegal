import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
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

  const renderLeft = (id: string) => {
    const heading = (t: string) => <h3 style={{ fontSize: 10, textTransform: "uppercase", color: "#999", letterSpacing: 3, marginBottom: 14, fontFamily: displayFont }}>{t}</h3>;
    switch (id) {
      case "skills":
        return skills.length > 0 ? <div key={id} style={{ marginBottom: density.margin * 2 }}>{heading("Compétences")}{renderSkills(skills, customization.skillStyle, pc)}</div> : null;
      case "formation":
        return formation.length > 0 ? (
          <div key={id} style={{ marginBottom: density.margin * 2 }}>
            {heading("Formation")}
            {formation.map((f, i) => (
              <div key={i} style={{ marginBottom: density.margin }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{f.diplome}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{f.ecole}</div>
                <div style={{ fontSize: 9, color: "#aaa" }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
              </div>
            ))}
          </div>
        ) : null;
      case "languages":
        return langues.length > 0 ? (
          <div key={id}>
            {heading("Langues")}
            {langues.map((l, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11 }}>{l.langue}</span>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div key={dot} style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: dot <= levelToDots(l.niveau) ? pc : "#ddd" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null;
      default: return null;
    }
  };

  const renderRight = (id: string) => {
    const heading = (t: string) => <h3 style={{ fontSize: 10, textTransform: "uppercase", color: "#999", letterSpacing: 3, marginBottom: 14, fontFamily: displayFont }}>{t}</h3>;
    switch (id) {
      case "summary":
        return summary ? <div key={id} style={{ marginBottom: density.margin * 2 }}>{heading("Profil")}<p style={{ fontSize: 12, lineHeight: density.lineHeight, color: "#555", fontStyle: "italic" }}>{summary}</p></div> : null;
      case "experiences":
        return experiences.length > 0 ? (
          <div key={id}>
            {heading("Expériences")}
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: density.margin * 1.4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{exp.poste}</span>
                    <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>— {exp.entreprise}</span>
                  </div>
                  <span style={{ fontSize: 9, color: "#aaa", whiteSpace: "nowrap" }}>{exp.dateDebut} — {exp.dateFin}</span>
                </div>
                <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#666", marginTop: 6 }}>{exp.description}</p>
              </div>
            ))}
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: "#fafafa", padding: density.padding * 3.75, color: "#333" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `1px solid ${pc}`, paddingBottom: 20, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: displayFont, fontSize: 42, fontWeight: 700, color: "#111", lineHeight: 1, marginBottom: 6 }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40 }}>
        <div>{leftSections.map(renderLeft)}</div>
        <div>{rightSections.map(renderRight)}</div>
      </div>
    </div>
  );
};

export default CVMinimaliste;
