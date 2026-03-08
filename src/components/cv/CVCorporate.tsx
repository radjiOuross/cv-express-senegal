import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles } from "@/types/customization";
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

  const accentBg = lighten(pc, 215);

  const sectionH = (title: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 14 }}>
      <div style={{ backgroundColor: pc, color: "#fff", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, padding: "5px 16px", borderRadius: "4px 0 0 4px" }}>{title}</div>
      <div style={{ flex: 1, height: 2, backgroundColor: pc }} />
    </div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: "#fff" }}>
      {/* Header */}
      <div style={{ backgroundColor: pc, padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 0.5, marginBottom: 2 }}>{personal.prenom} {personal.nom}</h1>
          <p style={{ fontSize: 13, color: lighten(pc, 150), fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>{personal.poste}</p>
        </div>
      </div>

      {/* Contact bar */}
      <div style={{ backgroundColor: accentBg, padding: "10px 40px", display: "flex", alignItems: "center", gap: 0, fontSize: 10, color: "#444", borderBottom: `2px solid ${pc}` }}>
        {[
          { label: "Email", value: personal.email },
          { label: "Tél", value: personal.telephone },
          { label: "Adresse", value: personal.ville },
        ].filter(c => c.value).map((c, i, arr) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 700, color: pc, fontSize: 9, textTransform: "uppercase" }}>{c.label}:</span>
            <span>{c.value}</span>
            {i < arr.length - 1 && <span style={{ margin: "0 16px", color: "#ccc" }}>|</span>}
          </span>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: "24px 40px" }}>
        {sections.map(id => {
          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
              {sectionH("Profil professionnel")}
              <p style={{ fontSize: 10.5, lineHeight: density.lineHeight, color: "#444", textAlign: "justify" }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
              {sectionH("Expérience professionnelle")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin * 1.2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: pc }}>{exp.poste}</span>
                    <span style={{ fontSize: 9, color: "#888", backgroundColor: accentBg, padding: "2px 10px", borderRadius: 10 }}>
                      {exp.dateDebut} — {exp.dateFin}
                    </span>
                  </div>
                  <div style={{ fontSize: 10.5, color: "#666", fontWeight: 500, marginBottom: 4 }}>{exp.entreprise}</div>
                  <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
              {sectionH("Formation")}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {formation.map((f, i) => (
                  <div key={i} style={{ padding: "10px 14px", backgroundColor: accentBg, borderRadius: 6, borderLeft: `3px solid ${pc}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#222" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>{f.ecole}</div>
                    <div style={{ fontSize: 9, color: pc, fontWeight: 500 }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                  </div>
                ))}
              </div>
            </div>
          );
          if (id === "skills" && skills.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
              {sectionH("Compétences")}
              {renderSkills(skills, customization.skillStyle, pc)}
            </div>
          );
          if (id === "languages" && langues.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
              {sectionH("Langues")}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {langues.map((l, i) => (
                  <span key={i} style={{ backgroundColor: accentBg, color: pc, padding: "6px 16px", borderRadius: 20, fontSize: 10, fontWeight: 600, border: `1px solid ${pc}25` }}>
                    {l.langue} — {l.niveau}
                  </span>
                ))}
              </div>
            </div>
          );
          if (id === "interests" && formData.interests) return (
            <div key={id}>
              {sectionH("Centres d'intérêt")}
              <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{formData.interests}</p>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
};

export default CVCorporate;
