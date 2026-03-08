import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVElegant = ({ formData, aiData, customization }: Props) => {
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

  const leftSections = sections.filter(s => ["formation", "languages", "interests"].includes(s));
  const rightSections = sections.filter(s => ["experiences", "skills"].includes(s));

  const sH = (title: string) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, background: sc, transform: "rotate(45deg)" }} />
        <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: "#333", letterSpacing: 3, fontFamily: displayFont }}>{title}</h3>
      </div>
      <div style={{ marginTop: 6, display: "flex", gap: 4, alignItems: "center" }}>
        <div style={{ width: 30, height: 1.5, background: sc }} />
        <div style={{ flex: 1, height: 0.5, background: "#ddd" }} />
      </div>
    </div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, background: "#fff", color: "#333" }}>
      {/* Top ornament */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 48px", paddingTop: 36 }}>
        <div style={{ flex: 1, height: 0.5, background: sc }} />
        <div style={{ width: 10, height: 10, border: `1.5px solid ${sc}`, transform: "rotate(45deg)", margin: "0 16px" }} />
        <div style={{ flex: 1, height: 0.5, background: sc }} />
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px 48px 24px" }}>
        <h1 style={{ fontFamily: displayFont, fontSize: 42, fontWeight: 300, color: "#111", lineHeight: 1.1, marginBottom: 6 }}>
          {personal.prenom} <span style={{ fontWeight: 700 }}>{personal.nom}</span>
        </h1>
        <p style={{ fontSize: 12, textTransform: "uppercase", color: sc, letterSpacing: 5, fontWeight: 500, marginBottom: 14 }}>{personal.poste}</p>
        
        {/* Contact */}
        <div style={{ display: "flex", justifyContent: "center", gap: 0, fontSize: 9.5, color: "#777" }}>
          {[personal.email, personal.telephone, personal.ville].filter(Boolean).map((item, i, arr) => (
            <span key={i} style={{ display: "flex", alignItems: "center" }}>
              <span>{item}</span>
              {i < arr.length - 1 && <span style={{ margin: "0 14px", width: 4, height: 4, background: sc, borderRadius: "50%", display: "inline-block" }} />}
            </span>
          ))}
        </div>
      </div>

      {/* Ornament */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 48px", marginBottom: 8 }}>
        <div style={{ flex: 1, height: 0.5, background: sc }} />
        <div style={{ width: 10, height: 10, border: `1.5px solid ${sc}`, transform: "rotate(45deg)", margin: "0 16px" }} />
        <div style={{ flex: 1, height: 0.5, background: sc }} />
      </div>

      {/* Summary centered */}
      {summary && sections.includes("summary") && (
        <div style={{ padding: "16px 72px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 10.5, lineHeight: 1.75, color: "#555", fontStyle: "italic" }}>{summary}</p>
        </div>
      )}

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 0, padding: "0 48px 36px" }}>
        {/* Left */}
        <div style={{ paddingRight: 24, borderRight: `0.5px solid #e5e5e5` }}>
          {leftSections.map(id => {
            if (id === "formation" && formation.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {sH("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: density.margin }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#222" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{f.ecole}</div>
                    <div style={{ fontSize: 9, color: sc, fontWeight: 500 }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                  </div>
                ))}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {sH("Langues")}
                {langues.map((l, i) => (
                  <div key={i} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 500 }}>{l.langue}</span>
                    <span style={{ fontSize: 9, color: sc, fontStyle: "italic", fontWeight: 500 }}>{l.niveau}</span>
                  </div>
                ))}
              </div>
            );
            if (id === "interests" && formData.interests) return (
              <div key={id}>
                {sH("Centres d'intérêt")}
                <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555" }}>{formData.interests}</p>
              </div>
            );
            return null;
          })}
        </div>

        {/* Right */}
        <div style={{ paddingLeft: 24 }}>
          {rightSections.map(id => {
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {sH("Expériences professionnelles")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111" }}>{exp.poste}</span>
                      <span style={{ fontSize: 9, color: sc, fontWeight: 500, fontStyle: "italic" }}>{exp.dateDebut} — {exp.dateFin}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: "#888", fontStyle: "italic", marginBottom: 4 }}>{exp.entreprise}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            if (id === "skills" && skills.length > 0) return (
              <div key={id}>
                {sH("Compétences")}
                {renderSkills(skills, customization.skillStyle, sc)}
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CVElegant;
