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

  const sectionH = (title: string) => (
    <div style={{ marginBottom: 14 }}>
      <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: sc, letterSpacing: 3, marginBottom: 4, fontFamily: displayFont }}>{title}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 24, height: 2, backgroundColor: sc }} />
        <div style={{ flex: 1, height: 0.5, backgroundColor: `${sc}40` }} />
      </div>
    </div>
  );

  const leftSections = sections.filter(s => ["formation", "languages"].includes(s));
  const centerSections = sections.filter(s => ["experiences"].includes(s));
  const rightSections = sections.filter(s => ["skills", "interests"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: "#fff", padding: "44px 40px", color: "#333" }}>
      {/* Top decorative line */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 0.5, backgroundColor: sc }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", border: `1.5px solid ${sc}` }} />
        <div style={{ flex: 1, height: 0.5, backgroundColor: sc }} />
      </div>

      {/* Name */}
      <h1 style={{ fontFamily: displayFont, fontSize: 40, fontWeight: 300, textAlign: "center", color: "#111", lineHeight: 1.1, marginBottom: 6 }}>
        {personal.prenom} <span style={{ fontWeight: 700 }}>{personal.nom}</span>
      </h1>
      <p style={{ textAlign: "center", fontSize: 12, textTransform: "uppercase", color: sc, letterSpacing: 4, fontWeight: 500, marginBottom: 16 }}>{personal.poste}</p>

      {/* Contact row */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, fontSize: 10, color: "#666", marginBottom: 16 }}>
        {[personal.email, personal.telephone, personal.ville].filter(Boolean).map((item, i, arr) => (
          <span key={i} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: 500 }}>{item}</span>
            {i < arr.length - 1 && <span style={{ margin: "0 16px", width: 4, height: 4, borderRadius: "50%", backgroundColor: sc, display: "inline-block" }} />}
          </span>
        ))}
      </div>

      {/* Bottom decorative line */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 0.5, backgroundColor: sc }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", border: `1.5px solid ${sc}` }} />
        <div style={{ flex: 1, height: 0.5, backgroundColor: sc }} />
      </div>

      {/* Summary */}
      {summary && sections.includes("summary") && (
        <p style={{ textAlign: "center", fontSize: 10.5, lineHeight: density.lineHeight, color: "#555", fontStyle: "italic", marginBottom: 28, maxWidth: 580, margin: "0 auto 28px", paddingBottom: 20, borderBottom: `0.5px solid ${sc}40` }}>{summary}</p>
      )}

      {/* Three columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 28 }}>
        <div>
          {leftSections.map(id => {
            if (id === "formation" && formation.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
                {sectionH("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 0.8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#222" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#777", fontStyle: "italic" }}>{f.ecole}</div>
                    <div style={{ fontSize: 9, color: sc, fontWeight: 500 }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                  </div>
                ))}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id}>
                {sectionH("Langues")}
                {langues.map((l, i) => (
                  <div key={i} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 500 }}>{l.langue}</span>
                    <span style={{ fontSize: 9, color: sc, fontStyle: "italic" }}>{l.niveau}</span>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        <div style={{ borderLeft: `0.5px solid ${sc}30`, borderRight: `0.5px solid ${sc}30`, paddingLeft: 24, paddingRight: 24 }}>
          {centerSections.map(id => {
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id}>
                {sectionH("Expériences")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{exp.poste}</div>
                    <div style={{ fontSize: 10, color: sc, fontWeight: 500, fontStyle: "italic" }}>{exp.entreprise}</div>
                    <div style={{ fontSize: 9, color: "#999", marginBottom: 4 }}>{exp.dateDebut} — {exp.dateFin}</div>
                    <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        <div>
          {rightSections.map(id => {
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
                {sectionH("Compétences")}
                {renderSkills(skills, customization.skillStyle, sc)}
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
    </div>
  );
};

export default CVElegant;
