import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, isSectionVisible, getOrderedSections } from "./cvUtils";

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

  const sections = getOrderedSections(customization);

  const renderSection = (id: string, side: "left" | "right") => {
    const sectionH = (title: string) => (
      <h2 style={{ fontSize: 11, textTransform: "uppercase", color: pc, letterSpacing: 2, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        {title} <span style={{ flex: 1, height: 1, backgroundColor: pc }} />
      </h2>
    );

    switch (id) {
      case "summary":
        if (side !== "left" || !summary) return null;
        return (
          <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
            {sectionH("Profil")}
            <p style={{ fontSize: 11, lineHeight: density.lineHeight, color: "#444" }}>{summary}</p>
          </div>
        );
      case "formation":
        if (side !== "left") return null;
        return formation.length > 0 ? (
          <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
            {sectionH("Formation")}
            {formation.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: density.margin }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: pc, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{f.diplome}</div>
                  <div style={{ fontSize: 10, color: "#666" }}>{f.ecole} • {f.annee}</div>
                </div>
              </div>
            ))}
          </div>
        ) : null;
      case "skills":
        if (side !== "left") return null;
        return skills.length > 0 ? (
          <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
            {sectionH("Compétences")}
            {renderSkills(skills, customization.skillStyle, pc)}
          </div>
        ) : null;
      case "languages":
        if (side !== "left") return null;
        return langues.length > 0 ? (
          <div key={id}>
            {sectionH("Langues")}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {langues.map((l, i) => (
                <span key={i} style={{ backgroundColor: `${pc}15`, color: pc, padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 500 }}>
                  {l.langue} — {l.niveau}
                </span>
              ))}
            </div>
          </div>
        ) : null;
      case "experiences":
        if (side !== "right") return null;
        return experiences.length > 0 ? (
          <div key={id}>
            {sectionH("Expériences")}
            {experiences.map((exp, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: density.margin * 1.4 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: pc, flexShrink: 0 }} />
                  {i < experiences.length - 1 && <div style={{ width: 2, flex: 1, backgroundColor: pc, opacity: 0.3 }} />}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{exp.poste}</div>
                  <div style={{ fontSize: 10, color: pc, fontWeight: 500, marginBottom: 4 }}>{exp.entreprise}</div>
                  <div style={{ fontSize: 9, color: "#999", marginBottom: 4 }}>{exp.dateDebut} — {exp.dateFin}</div>
                  <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: "white" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${pc}, ${darken(pc)})`, padding: `${density.padding * 2.2}px ${density.padding * 2.5}px`, color: "white", display: "flex", alignItems: "center", gap: 24 }}>
        {customization.photoStyle !== "none" && personal.photo && (
          <div style={getPhotoStyle(customization.photoStyle, 90, "#fff", customization.photoBorder)}>
            <img src={personal.photo} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div>
          <h1 style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{personal.prenom} {personal.nom}</h1>
          <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>{personal.poste}</p>
          <div style={{ display: "flex", gap: 16, fontSize: 10, opacity: 0.85 }}>
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.telephone && <span>📞 {personal.telephone}</span>}
            {personal.ville && <span>📍 {personal.ville}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", padding: `${density.padding * 2}px ${density.padding * 2.5}px`, gap: 32 }}>
        <div style={{ flex: 1, borderRight: "1px solid #eee", paddingRight: 32 }}>
          {sections.filter(s => !["experiences"].includes(s)).map(id => renderSection(id, "left"))}
        </div>
        <div style={{ flex: 1 }}>
          {sections.filter(s => s === "experiences").map(id => renderSection(id, "right"))}
        </div>
      </div>
    </div>
  );
};

export default CVModerne;
