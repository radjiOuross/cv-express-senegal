import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVExecutive = ({ formData, aiData, customization }: Props) => {
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
  const showPhoto = customization.photoStyle !== "none" && !!personal.photo;

  const sectionTitle = (title: string) => (
    <div style={{ marginBottom: 12, borderBottom: `2px solid ${pc}`, paddingBottom: 6 }}>
      <span style={{ fontFamily: displayFont, fontSize: 13, fontWeight: 700, color: pc, textTransform: "uppercase", letterSpacing: 2 }}>{title}</span>
    </div>
  );

  const mainSections = sections.filter(s => ["summary", "experiences", "formation"].includes(s));
  const sideSections = sections.filter(s => ["skills", "languages", "interests"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 10.5, background: "#fff", color: "#2d2d2d" }}>
      {/* Header */}
      <div style={{ padding: "36px 40px 28px", display: "flex", alignItems: "center", gap: 24, borderBottom: `3px solid ${pc}` }}>
        {showPhoto && (
          <div style={{ ...getPhotoStyle(customization.photoStyle, 80, pc, customization.photoBorder), boxShadow: "0 4px 14px rgba(0,0,0,0.12)", flexShrink: 0 }}>
            <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 700, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>
            {personal.prenom} <span style={{ color: pc }}>{personal.nom}</span>
          </h1>
          <p style={{ fontSize: 13, color: "#555", fontWeight: 500, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{personal.poste}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 9.5, color: "#666", lineHeight: 1.8 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.telephone && <div>{personal.telephone}</div>}
          {personal.ville && <div>{personal.ville}</div>}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", minHeight: 900 }}>
        {/* Main column */}
        <div style={{ padding: "24px 30px 24px 40px" }}>
          {mainSections.map(id => {
            if (id === "summary" && summary) return (
              <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
                {sectionTitle("Profil")}
                <p style={{ fontSize: 10.5, lineHeight: 1.7, color: "#444", textAlign: "justify" }}>{summary}</p>
              </div>
            );
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
                {sectionTitle("Expérience professionnelle")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin, paddingLeft: 14, borderLeft: `2px solid ${pc}20` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{exp.poste}</span>
                      <span style={{ fontSize: 9, color: "#888", whiteSpace: "nowrap" }}>{exp.dateDebut} — {exp.dateFin}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginBottom: 4 }}>{exp.entreprise}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
                {sectionTitle("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: 10, paddingLeft: 14, borderLeft: `2px solid ${pc}20` }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1a1a1a" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>{f.ecole} — {f.annee}</div>
                    {f.mention && <div style={{ fontSize: 9, color: pc }}>{f.mention}</div>}
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        {/* Sidebar */}
        <div style={{ padding: "24px 24px 24px 0", borderLeft: `1px solid #eee` }}>
          <div style={{ paddingLeft: 20 }}>
            {sideSections.map(id => {
              if (id === "skills" && skills.length > 0) return (
                <div key={id} style={{ marginBottom: density.margin * 2 }}>
                  {sectionTitle("Compétences")}
                  {renderSkills(skills, customization.skillStyle, pc)}
                </div>
              );
              if (id === "languages" && langues.length > 0) return (
                <div key={id} style={{ marginBottom: density.margin * 2 }}>
                  {sectionTitle("Langues")}
                  {langues.map((l, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600 }}>{l.langue}</span>
                      <span style={{ fontSize: 9.5, color: "#888" }}>{l.niveau}</span>
                    </div>
                  ))}
                </div>
              );
              if (id === "interests" && formData.interests) return (
                <div key={id}>
                  {sectionTitle("Centres d'intérêt")}
                  <p style={{ fontSize: 10, lineHeight: 1.6, color: "#555" }}>{formData.interests}</p>
                </div>
              );
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVExecutive;
