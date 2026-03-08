import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVCorporate = ({ formData, aiData, customization }: Props) => {
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

  const sH = (title: string) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <div style={{ background: pc, color: "#fff", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, padding: "6px 18px" }}>{title}</div>
        <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${pc}, ${accentBg})` }} />
      </div>
    </div>
  );

  const leftSections = sections.filter(s => ["skills", "languages", "interests"].includes(s));
  const rightSections = sections.filter(s => ["summary", "experiences", "formation"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, background: "#fff" }}>
      {/* Header */}
      <div style={{ background: pc, padding: "24px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {customization.photoStyle !== "none" && personal.photo && (
            <div style={{ ...getPhotoStyle(customization.photoStyle, 60, "#fff", customization.photoBorder), boxShadow: "0 2px 8px rgba(0,0,0,0.2)", flexShrink: 0 }}>
              <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{personal.prenom} {personal.nom}</h1>
            <p style={{ fontSize: 12, color: lighten(pc, 160), fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>{personal.poste}</p>
          </div>
        </div>
      </div>

      {/* Contact bar */}
      <div style={{ background: accentBg, padding: "10px 36px", display: "flex", gap: 0, fontSize: 9.5, color: "#444", borderBottom: `3px solid ${pc}` }}>
        {[
          { l: "Email", v: personal.email },
          { l: "Tél", v: personal.telephone },
          { l: "Adresse", v: personal.ville },
        ].filter(c => c.v).map((c, i, arr) => (
          <span key={i} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: pc, fontSize: 8, textTransform: "uppercase", marginRight: 4 }}>{c.l}:</span>
            <span>{c.v}</span>
            {i < arr.length - 1 && <span style={{ margin: "0 14px", color: "#ccc" }}>|</span>}
          </span>
        ))}
      </div>

      {/* Body - 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 0 }}>
        {/* Left */}
        <div style={{ padding: "24px 20px 24px 36px", background: accentBg }}>
          {leftSections.map(id => {
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {sH("Compétences")}
                {renderSkills(skills, customization.skillStyle, pc)}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {sH("Langues")}
                {langues.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "6px 10px", background: "#fff", borderRadius: 6 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: pc }}>{l.langue}</span>
                    <span style={{ fontSize: 9, color: "#888" }}>{l.niveau}</span>
                  </div>
                ))}
              </div>
            );
            if (id === "interests" && formData.interests) return (
              <div key={id}>
                {sH("Centres d'intérêt")}
                <p style={{ fontSize: 10, lineHeight: 1.6, color: "#555" }}>{formData.interests}</p>
              </div>
            );
            return null;
          })}
        </div>

        {/* Right */}
        <div style={{ padding: "24px 36px 24px 24px" }}>
          {rightSections.map(id => {
            if (id === "summary" && summary) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {sH("Profil professionnel")}
                <p style={{ fontSize: 10.5, lineHeight: 1.7, color: "#444", textAlign: "justify" }}>{summary}</p>
              </div>
            );
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {sH("Expérience professionnelle")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: pc }}>{exp.poste}</span>
                      <span style={{ fontSize: 8.5, color: "#888", background: accentBg, padding: "3px 10px", borderRadius: 10 }}>{exp.dateDebut} — {exp.dateFin}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: "#555", fontWeight: 500, marginBottom: 4 }}>{exp.entreprise}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id}>
                {sH("Formation")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {formation.map((f, i) => (
                    <div key={i} style={{ padding: "10px 12px", background: accentBg, borderRadius: 8, borderLeft: `3px solid ${pc}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#222" }}>{f.diplome}</div>
                      <div style={{ fontSize: 9.5, color: "#666" }}>{f.ecole}</div>
                      <div style={{ fontSize: 9, color: pc, fontWeight: 600 }}>{f.annee}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CVCorporate;
