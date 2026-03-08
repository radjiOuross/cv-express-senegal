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

  const lightBg = lighten(pc, 200);

  const badge = (title: string) => (
    <div style={{ display: "inline-block", backgroundColor: pc, color: "#fff", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, padding: "5px 16px", borderRadius: 4, marginBottom: 12 }}>{title}</div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: "#fff" }}>
      <div style={{ backgroundColor: pc, height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${density.padding * 2.5}px` }}>
        <h1 style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 700, color: "#fff" }}>{personal.prenom} {personal.nom}</h1>
        <p style={{ fontSize: 13, color: lighten(pc, 130) }}>{personal.poste}</p>
      </div>

      <div style={{ borderBottom: `2px solid ${pc}`, padding: `10px ${density.padding * 2.5}px`, display: "flex", alignItems: "center", gap: 0, fontSize: 12, color: "#444" }}>
        {[personal.email, personal.telephone, personal.ville].filter(Boolean).map((item, i, arr) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: pc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff" }}>
              {["✉", "☎", "📍"][i]}
            </div>
            <span>{item}</span>
            {i < arr.length - 1 && <span style={{ margin: "0 12px", color: "#ccc" }}>•</span>}
          </span>
        ))}
      </div>

      <div style={{ padding: `${density.padding * 1.7}px ${density.padding * 2.5}px` }}>
        {sections.map(id => {
          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
              {badge("Profil")}
              <p style={{ fontSize: 11, lineHeight: density.lineHeight, color: "#444" }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
              {badge("Expériences")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: pc }}>{exp.poste}</div>
                  <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{exp.entreprise}</div>
                  <span style={{ display: "inline-block", fontSize: 9, color: pc, backgroundColor: lightBg, borderRadius: 10, padding: "2px 10px", marginTop: 2, marginBottom: 4 }}>
                    {exp.dateDebut} — {exp.dateFin}
                  </span>
                  <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
              {badge("Formation")}
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: density.margin }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: pc }}>{f.diplome}</div>
                  <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{f.ecole}</div>
                  <span style={{ display: "inline-block", fontSize: 9, color: pc, backgroundColor: lightBg, borderRadius: 10, padding: "2px 10px", marginTop: 2 }}>
                    {f.annee}{f.mention ? ` — ${f.mention}` : ""}
                  </span>
                </div>
              ))}
            </div>
          );
          if (id === "skills" && skills.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
              {badge("Compétences")}
              {renderSkills(skills, customization.skillStyle, pc)}
            </div>
          );
          if (id === "languages" && langues.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
              {badge("Langues")}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {langues.map((l, i) => (
                  <span key={i} style={{ backgroundColor: lightBg, color: pc, padding: "4px 14px", borderRadius: 20, fontSize: 10, fontWeight: 500 }}>
                    {l.langue} — {l.niveau}
                  </span>
                ))}
              </div>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
};

export default CVCorporate;
