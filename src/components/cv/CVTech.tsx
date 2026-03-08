import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVTech = ({ formData, aiData, customization }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const pc = customization.colors.primary;
  const sc = customization.colors.secondary;
  const density = getDensityStyles(customization.density);
  const displayFont = `'${customization.font.display}', sans-serif`;
  const bodyFont = `'${customization.font.body}', sans-serif`;
  const sections = getOrderedSections(customization);
  const showPhoto = customization.photoStyle !== "none" && !!personal.photo;

  const sectionTitle = (title: string) => (
    <div style={{ marginBottom: 14 }}>
      <span style={{ fontFamily: displayFont, fontSize: 11, fontWeight: 700, color: pc, textTransform: "uppercase", letterSpacing: 3, borderBottom: `2px solid ${pc}`, paddingBottom: 4 }}>{title}</span>
    </div>
  );

  const leftSections = sections.filter(s => ["summary", "experiences", "formation"].includes(s));
  const rightSections = sections.filter(s => ["skills", "languages", "interests"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 10.5, background: "#0f0f0f", color: "#e0e0e0" }}>
      {/* Header */}
      <div style={{ padding: "32px 36px 24px", display: "flex", alignItems: "center", gap: 20, borderBottom: `1px solid #222` }}>
        {showPhoto && (
          <div style={{ ...getPhotoStyle(customization.photoStyle, 75, pc, customization.photoBorder), flexShrink: 0 }}>
            <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 700, color: "#fff", margin: 0 }}>
            {personal.prenom} <span style={{ color: pc }}>{personal.nom}</span>
          </h1>
          <p style={{ fontSize: 12, color: pc, fontWeight: 500, marginTop: 3, letterSpacing: 2, textTransform: "uppercase" }}>{personal.poste}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 9.5, color: "#888", lineHeight: 1.9 }}>
          {personal.email && <div style={{ color: pc }}>{personal.email}</div>}
          {personal.telephone && <div>{personal.telephone}</div>}
          {personal.ville && <div>{personal.ville}</div>}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 230px" }}>
        {/* Main */}
        <div style={{ padding: "24px 24px 24px 36px", borderRight: `1px solid #1a1a1a` }}>
          {leftSections.map(id => {
            if (id === "summary" && summary) return (
              <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
                {sectionTitle("Profil")}
                <p style={{ fontSize: 10.5, lineHeight: 1.75, color: "#aaa", textAlign: "justify" }}>{summary}</p>
              </div>
            );
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
                {sectionTitle("Expérience")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.2, padding: "12px 14px", background: "#161616", borderRadius: 8, borderLeft: `3px solid ${pc}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{exp.poste}</span>
                      <span style={{ fontSize: 9, color: "#666", fontFamily: "monospace" }}>{exp.dateDebut} — {exp.dateFin}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: pc, fontWeight: 500, marginBottom: 6 }}>{exp.entreprise}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.65, color: "#999", textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id}>
                {sectionTitle("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: 10, padding: "10px 14px", background: "#161616", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#777" }}>{f.ecole} — <span style={{ color: pc }}>{f.annee}</span></div>
                    {f.mention && <div style={{ fontSize: 9, color: "#555" }}>{f.mention}</div>}
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        {/* Sidebar */}
        <div style={{ padding: "24px 24px 24px 20px", background: "#0a0a0a" }}>
          {rightSections.map(id => {
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {sectionTitle("Skills")}
                {renderSkills(skills, customization.skillStyle, pc)}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {sectionTitle("Langues")}
                {langues.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "6px 10px", background: "#161616", borderRadius: 6 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: "#ddd" }}>{l.langue}</span>
                    <span style={{ fontSize: 9, color: pc }}>{l.niveau}</span>
                  </div>
                ))}
              </div>
            );
            if (id === "interests" && formData.interests) return (
              <div key={id}>
                {sectionTitle("Intérêts")}
                <p style={{ fontSize: 10, lineHeight: 1.6, color: "#777" }}>{formData.interests}</p>
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CVTech;
