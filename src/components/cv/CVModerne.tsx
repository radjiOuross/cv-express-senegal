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
  const sections = getOrderedSections(customization);

  const lighten = (hex: string, amt: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + amt);
    const g = Math.min(255, ((num >> 8) & 0xFF) + amt);
    const b = Math.min(255, (num & 0xFF) + amt);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
  };

  const accentBg = lighten(pc, 220);

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, background: "#fff" }}>
      {/* Top accent bar */}
      <div style={{ height: 8, background: `linear-gradient(90deg, ${pc}, ${sc})` }} />
      
      {/* Header */}
      <div style={{ padding: "28px 40px 24px", display: "flex", alignItems: "center", gap: 24 }}>
        {customization.photoStyle !== "none" && personal.photo && (
          <div style={{ ...getPhotoStyle(customization.photoStyle, 80, pc, customization.photoBorder), boxShadow: `0 4px 16px ${pc}30`, flexShrink: 0 }}>
            <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 700, color: "#111", marginBottom: 2, letterSpacing: -0.5 }}>
            {personal.prenom} <span style={{ color: pc }}>{personal.nom}</span>
          </h1>
          <p style={{ fontSize: 13, color: pc, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{personal.poste}</p>
          <div style={{ display: "flex", gap: 16, fontSize: 9.5, color: "#666" }}>
            {personal.email && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 16, height: 16, borderRadius: "50%", background: accentBg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: pc, fontWeight: 800 }}>@</span> {personal.email}</span>}
            {personal.telephone && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 16, height: 16, borderRadius: "50%", background: accentBg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: pc, fontWeight: 800 }}>T</span> {personal.telephone}</span>}
            {personal.ville && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 16, height: 16, borderRadius: "50%", background: accentBg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: pc, fontWeight: 800 }}>A</span> {personal.ville}</span>}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: `linear-gradient(90deg, ${pc}40, transparent)`, margin: "0 40px" }} />

      {/* Body - 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 0, padding: "0" }}>
        {/* Left */}
        <div style={{ padding: "24px 28px 24px 40px" }}>
          {sections.filter(s => ["summary", "experiences"].includes(s)).map(id => {
            const h = (t: string) => (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${pc}, ${pc}cc)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{t[0]}</span>
                </div>
                <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#111", letterSpacing: 1 }}>{t}</h2>
              </div>
            );
            if (id === "summary" && summary) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {h("Profil")}
                <p style={{ fontSize: 10.5, lineHeight: 1.7, color: "#444", textAlign: "justify" }}>{summary}</p>
              </div>
            );
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {h("Expériences")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.3, padding: "12px 14px", background: i % 2 === 0 ? accentBg : "#fff", borderRadius: 8, borderLeft: `3px solid ${pc}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{exp.poste}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 10.5, color: pc, fontWeight: 600 }}>{exp.entreprise}</span>
                      <span style={{ fontSize: 8.5, color: "#888", background: "#fff", padding: "2px 8px", borderRadius: 10, border: "1px solid #eee" }}>{exp.dateDebut} — {exp.dateFin}</span>
                    </div>
                    <p style={{ fontSize: 10, lineHeight: 1.6, color: "#555" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        {/* Right */}
        <div style={{ padding: "24px 40px 24px 20px", borderLeft: `1px solid ${accentBg}` }}>
          {sections.filter(s => ["formation", "skills", "languages", "interests"].includes(s)).map(id => {
            const h = (t: string) => (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${pc}, ${pc}cc)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{t[0]}</span>
                </div>
                <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#111", letterSpacing: 1 }}>{t}</h2>
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {h("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: density.margin, padding: "10px 12px", background: accentBg, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#111" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: pc, fontWeight: 500 }}>{f.ecole}</div>
                    <div style={{ fontSize: 9, color: "#888" }}>{f.annee}{f.mention ? ` • ${f.mention}` : ""}</div>
                  </div>
                ))}
              </div>
            );
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {h("Compétences")}
                {renderSkills(skills, customization.skillStyle, pc)}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {h("Langues")}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {langues.map((l, i) => (
                    <span key={i} style={{ background: accentBg, color: pc, padding: "6px 14px", borderRadius: 20, fontSize: 10, fontWeight: 600, border: `1.5px solid ${pc}20` }}>
                      {l.langue} — {l.niveau}
                    </span>
                  ))}
                </div>
              </div>
            );
            if (id === "interests" && formData.interests) return (
              <div key={id}>
                {h("Centres d'intérêt")}
                <p style={{ fontSize: 10, lineHeight: 1.6, color: "#555" }}>{formData.interests}</p>
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CVModerne;
