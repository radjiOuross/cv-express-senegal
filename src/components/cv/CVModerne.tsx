import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVModerne = ({ formData, aiData, customization }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const pc = customization.colors.primary;
  const sc = customization.colors.secondary;
  const density = getDensityStyles(customization.density);
  const displayFont = `'${customization.font.display}', serif`;
  const bodyFont = `'${customization.font.body}', sans-serif`;

  const darken = (hex: string) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - 30);
    const g = Math.max(0, ((num >> 8) & 0xFF) - 30);
    const b = Math.max(0, (num & 0xFF) - 30);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
  };

  const lighten = (hex: string, amt: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + amt);
    const g = Math.min(255, ((num >> 8) & 0xFF) + amt);
    const b = Math.min(255, (num & 0xFF) + amt);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
  };

  const sections = getOrderedSections(customization);
  const accentBg = lighten(pc, 210);

  const sectionHeader = (title: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 4, height: 20, backgroundColor: pc, borderRadius: 2 }} />
      <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: pc, letterSpacing: 1.5 }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: "white" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${pc}, ${darken(pc)})`, padding: "32px 40px", color: "white", display: "flex", alignItems: "center", gap: 28 }}>
        {customization.photoStyle !== "none" && personal.photo && (
          <div style={{ ...getPhotoStyle(customization.photoStyle, 90, "#fff", customization.photoBorder), boxShadow: "0 4px 16px rgba(0,0,0,0.25)", flexShrink: 0 }}>
            <img src={personal.photo} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 700, marginBottom: 4, letterSpacing: 0.5 }}>{personal.prenom} {personal.nom}</h1>
          <p style={{ fontSize: 14, opacity: 0.9, fontWeight: 500, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>{personal.poste}</p>
          <div style={{ display: "flex", gap: 24, fontSize: 10, opacity: 0.85 }}>
            {personal.email && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontWeight: 700 }}>@</span> {personal.email}</span>}
            {personal.telephone && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontWeight: 700 }}>T</span> {personal.telephone}</span>}
            {personal.ville && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontWeight: 700 }}>A</span> {personal.ville}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {/* Left column */}
        <div style={{ padding: "28px 24px 28px 40px", borderRight: `1px solid ${accentBg}` }}>
          {sections.filter(s => ["summary", "formation", "skills", "languages"].includes(s)).map(id => {
            if (id === "summary" && summary) return (
              <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
                {sectionHeader("Profil")}
                <p style={{ fontSize: 10.5, lineHeight: density.lineHeight, color: "#444", textAlign: "justify" }}>{summary}</p>
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
                {sectionHeader("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: density.margin, padding: "8px 12px", backgroundColor: accentBg, borderRadius: 6, borderLeft: `3px solid ${pc}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: pc, fontWeight: 500 }}>{f.ecole}</div>
                    <div style={{ fontSize: 9, color: "#888" }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                  </div>
                ))}
              </div>
            );
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
                {sectionHeader("Compétences")}
                {renderSkills(skills, customization.skillStyle, pc)}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id}>
                {sectionHeader("Langues")}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {langues.map((l, i) => (
                    <span key={i} style={{ backgroundColor: accentBg, color: pc, padding: "5px 14px", borderRadius: 20, fontSize: 10, fontWeight: 600, border: `1px solid ${pc}30` }}>
                      {l.langue} — {l.niveau}
                    </span>
                  ))}
                </div>
              </div>
            );
            return null;
          })}
        </div>

        {/* Right column */}
        <div style={{ padding: "28px 40px 28px 24px" }}>
          {sections.filter(s => s === "experiences").map(id => experiences.length > 0 ? (
            <div key={id}>
              {sectionHeader("Expérience professionnelle")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ position: "relative", paddingLeft: 20, marginBottom: density.margin * 1.4, borderLeft: `2px solid ${accentBg}` }}>
                  <div style={{ position: "absolute", left: -5, top: 2, width: 8, height: 8, borderRadius: "50%", backgroundColor: pc }} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{exp.poste}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 10.5, color: pc, fontWeight: 600 }}>{exp.entreprise}</span>
                    <span style={{ fontSize: 9, color: "#999", fontStyle: "italic" }}>{exp.dateDebut} — {exp.dateFin}</span>
                  </div>
                  <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          ) : null)}

          {sections.filter(s => s === "interests").map(id => formData.interests ? (
            <div key={id} style={{ marginTop: density.margin * 1.5 }}>
              {sectionHeader("Centres d'intérêt")}
              <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{formData.interests}</p>
            </div>
          ) : null)}
        </div>
      </div>
    </div>
  );
};

export default CVModerne;
