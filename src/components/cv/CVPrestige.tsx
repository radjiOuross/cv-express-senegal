import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVPrestige = ({ formData, aiData, customization }: Props) => {
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
    <div style={{ marginBottom: 14, textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
        <div style={{ flex: 1, maxWidth: 60, height: 1, background: sc }} />
        <span style={{ fontFamily: displayFont, fontSize: 12, fontWeight: 600, color: pc, textTransform: "uppercase", letterSpacing: 3 }}>{title}</span>
        <div style={{ flex: 1, maxWidth: 60, height: 1, background: sc }} />
      </div>
    </div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 10.5, background: "#fff", color: "#333" }}>
      {/* Decorative top line */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${pc}, ${sc}, ${pc})` }} />

      {/* Header */}
      <div style={{ padding: "32px 50px 24px", textAlign: "center", borderBottom: `1px solid #eee` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
          {showPhoto && (
            <div style={{ ...getPhotoStyle(customization.photoStyle, 85, sc, customization.photoBorder), boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
              <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 700, color: "#1a1a1a", margin: 0, letterSpacing: 2 }}>
              {personal.prenom} {personal.nom}
            </h1>
            <div style={{ width: 50, height: 2, background: sc, margin: "8px auto" }} />
            <p style={{ fontSize: 12, color: pc, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase" }}>{personal.poste}</p>
          </div>
        </div>

        {/* Contact inline */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 24, fontSize: 9.5, color: "#777" }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.telephone && <span>{personal.telephone}</span>}
          {personal.ville && <span>{personal.ville}</span>}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 50px 30px" }}>
        {sections.map(id => {
          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Profil")}
              <p style={{ fontSize: 10.5, lineHeight: 1.75, color: "#444", textAlign: "center", maxWidth: 580, margin: "0 auto", fontStyle: "italic" }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Expérience")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin * 1.3, display: "grid", gridTemplateColumns: "140px 1fr", gap: 20 }}>
                  <div style={{ textAlign: "right", paddingTop: 2 }}>
                    <div style={{ fontSize: 9.5, color: pc, fontWeight: 600 }}>{exp.dateDebut}</div>
                    <div style={{ fontSize: 9.5, color: "#aaa" }}>{exp.dateFin}</div>
                  </div>
                  <div style={{ borderLeft: `2px solid ${sc}`, paddingLeft: 18, position: "relative" }}>
                    <div style={{ position: "absolute", left: -5, top: 4, width: 8, height: 8, borderRadius: "50%", background: pc }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{exp.poste}</div>
                    <div style={{ fontSize: 10.5, color: pc, fontWeight: 500, marginBottom: 4 }}>{exp.entreprise}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Formation")}
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: 10, display: "grid", gridTemplateColumns: "140px 1fr", gap: 20 }}>
                  <div style={{ textAlign: "right", fontSize: 10, color: pc, fontWeight: 600 }}>{f.annee}</div>
                  <div style={{ borderLeft: `2px solid ${sc}`, paddingLeft: 18, position: "relative" }}>
                    <div style={{ position: "absolute", left: -5, top: 4, width: 8, height: 8, borderRadius: "50%", background: sc }} />
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>{f.ecole}</div>
                    {f.mention && <div style={{ fontSize: 9, color: "#888" }}>{f.mention}</div>}
                  </div>
                </div>
              ))}
            </div>
          );
          if (id === "skills" && skills.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Compétences")}
              <div style={{ maxWidth: 500, margin: "0 auto" }}>{renderSkills(skills, customization.skillStyle, pc)}</div>
            </div>
          );
          if (id === "languages" && langues.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Langues")}
              <div style={{ display: "flex", justifyContent: "center", gap: 30, flexWrap: "wrap" }}>
                {langues.map((l, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "10px 20px", border: `1px solid ${sc}`, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a" }}>{l.langue}</div>
                    <div style={{ fontSize: 9, color: pc, marginTop: 2 }}>{l.niveau}</div>
                  </div>
                ))}
              </div>
            </div>
          );
          if (id === "interests" && formData.interests) return (
            <div key={id}>
              {sectionTitle("Centres d'intérêt")}
              <p style={{ fontSize: 10, lineHeight: 1.6, color: "#555", textAlign: "center" }}>{formData.interests}</p>
            </div>
          );
          return null;
        })}
      </div>

      {/* Decorative bottom */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${pc}, ${sc}, ${pc})`, marginTop: "auto" }} />
    </div>
  );
};

export default CVPrestige;
