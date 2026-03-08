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
    <>
      <h3 style={{ fontSize: 10, textTransform: "uppercase", color: sc, letterSpacing: 2, marginBottom: 4 }}>{title}</h3>
      <div style={{ width: 30, height: 1.5, backgroundColor: sc, marginBottom: 12 }} />
    </>
  );

  const leftSections = sections.filter(s => ["formation", "languages"].includes(s));
  const centerSections = sections.filter(s => ["experiences"].includes(s));
  const rightSections = sections.filter(s => ["skills", "interests"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: "#fff", padding: `${density.padding * 3}px`, color: "#333" }}>
      <div style={{ height: 1, backgroundColor: sc, marginBottom: 32 }} />
      <h1 style={{ fontFamily: displayFont, fontSize: 48, fontWeight: 600, textAlign: "center", color: "#111", lineHeight: 1, marginBottom: 6 }}>
        {personal.prenom} {personal.nom}
      </h1>
      <p style={{ textAlign: "center", fontSize: 12, textTransform: "uppercase", color: "#888", letterSpacing: 3, marginBottom: 16 }}>{personal.poste}</p>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, fontSize: 11, color: "#777", marginBottom: 16 }}>
        {[personal.ville, personal.telephone, personal.email].filter(Boolean).map((item, i, arr) => (
          <span key={i} style={{ display: "flex", alignItems: "center" }}>
            <span>{item}</span>
            {i < arr.length - 1 && <span style={{ margin: "0 12px", width: 1, height: 12, backgroundColor: "#ccc", display: "inline-block" }} />}
          </span>
        ))}
      </div>

      <div style={{ height: 1, backgroundColor: sc, marginBottom: 28 }} />

      {summary && sections.includes("summary") && (
        <p style={{ textAlign: "center", fontSize: 11, lineHeight: density.lineHeight, color: "#555", fontStyle: "italic", marginBottom: 28, maxWidth: 600, margin: "0 auto 28px" }}>{summary}</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 28 }}>
        <div>
          {leftSections.map(id => {
            if (id === "formation" && formation.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
                {sectionH("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 0.7 }}>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{f.ecole}</div>
                    <div style={{ fontSize: 9, color: sc }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                  </div>
                ))}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id}>
                {sectionH("Langues")}
                {langues.map((l, i) => (
                  <div key={i} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11 }}>{l.langue}</span>
                    <span style={{ fontSize: 9, color: "#888" }}>{l.niveau}</span>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        <div>
          {centerSections.map(id => {
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id}>
                {sectionH("Expériences")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{exp.poste}</div>
                    <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{exp.entreprise}</div>
                    <div style={{ fontSize: 9, color: sc, marginBottom: 4 }}>{exp.dateDebut} — {exp.dateFin}</div>
                    <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{exp.description}</p>
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
