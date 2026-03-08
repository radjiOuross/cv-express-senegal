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
    <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 0 }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${sc})` }} />
      <span style={{ fontFamily: displayFont, fontSize: 11.5, fontWeight: 700, color: pc, textTransform: "uppercase", letterSpacing: 4, padding: "0 18px" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${sc}, transparent)` }} />
    </div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 10.5, background: "#fff", color: "#333" }}>
      {/* Decorative top border */}
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent 5%, ${sc} 20%, ${pc} 50%, ${sc} 80%, transparent 95%)` }} />

      {/* Header */}
      <div style={{ padding: "36px 56px 28px", textAlign: "center" }}>
        {showPhoto && (
          <div style={{ display: "inline-block", marginBottom: 14 }}>
            <div style={{ padding: 3, border: `1.5px solid ${sc}`, borderRadius: customization.photoStyle === "circle" ? "50%" : 14, display: "inline-block" }}>
              <div style={{ ...getPhotoStyle(customization.photoStyle, 90, "transparent", false), border: "none" }}>
                <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>
        )}
        <h1 style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 700, color: "#1a1a1a", margin: 0, letterSpacing: 3, lineHeight: 1.15 }}>
          {personal.prenom} <span style={{ fontWeight: 400 }}>{personal.nom}</span>
        </h1>
        <div style={{ width: 50, height: 2, background: sc, margin: "10px auto", borderRadius: 1 }} />
        <p style={{ fontSize: 11.5, color: pc, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase", margin: 0 }}>{personal.poste}</p>

        {/* Contact inline */}
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 6, fontSize: 9, color: "#777", flexWrap: "wrap" }}>
          {personal.email && <span style={{ padding: "3px 12px", border: `1px solid #e0e0e0`, borderRadius: 14 }}>{personal.email}</span>}
          {personal.telephone && <span style={{ padding: "3px 12px", border: `1px solid #e0e0e0`, borderRadius: 14 }}>{personal.telephone}</span>}
          {personal.ville && <span style={{ padding: "3px 12px", border: `1px solid #e0e0e0`, borderRadius: 14 }}>{personal.ville}</span>}
        </div>
      </div>

      <div style={{ height: 1, background: "#eee", margin: "0 56px" }} />

      {/* Content */}
      <div style={{ padding: "22px 56px 36px" }}>
        {sections.map(id => {
          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
              {sectionTitle("Profil")}
              <p style={{ fontSize: 10.5, lineHeight: 1.8, color: "#555", textAlign: "center", maxWidth: 560, margin: "0 auto", fontStyle: "italic" }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
              {sectionTitle("Experience")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin * 1.5, display: "grid", gridTemplateColumns: "125px 1fr", gap: 0 }}>
                  {/* Date column */}
                  <div style={{ textAlign: "right", paddingRight: 20, paddingTop: 2, borderRight: `1.5px solid ${sc}`, position: "relative" }}>
                    <div style={{ position: "absolute", right: -4.5, top: 5, width: 8, height: 8, borderRadius: "50%", background: pc, border: "2px solid #fff", boxShadow: `0 0 0 1.5px ${sc}` }} />
                    <div style={{ fontSize: 9.5, color: pc, fontWeight: 700, lineHeight: 1.4 }}>{exp.dateDebut}</div>
                    <div style={{ fontSize: 9, color: "#aaa" }}>{exp.dateFin}</div>
                  </div>
                  {/* Content column */}
                  <div style={{ paddingLeft: 20 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.25 }}>{exp.poste}</div>
                    <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginTop: 2, marginBottom: 5 }}>{exp.entreprise}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.7, color: "#666", textAlign: "justify", margin: 0 }}>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
              {sectionTitle("Formation")}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                {formation.map((f, i) => (
                  <div key={i} style={{ flex: "1 1 280px", maxWidth: 320, padding: "14px 18px", border: `1px solid #e8e8e8`, borderRadius: 10, borderTop: `3px solid ${sc}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#777", marginTop: 3 }}>{f.ecole}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontSize: 9, color: pc, fontWeight: 700 }}>{f.annee}</span>
                      {f.mention && <span style={{ fontSize: 8.5, color: "#999" }}>{f.mention}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          if (id === "skills" && skills.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
              {sectionTitle("Competences")}
              <div style={{ maxWidth: 520, margin: "0 auto" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 9.5, fontWeight: 600, background: `${pc}0D`, color: pc, border: `1px solid ${pc}25` }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          );
          if (id === "languages" && langues.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
              {sectionTitle("Langues")}
              <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
                {langues.map((l, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "10px 24px", borderRadius: 10, border: `1px solid #e0e0e0`, minWidth: 100 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1a1a1a" }}>{l.langue}</div>
                    <div style={{ fontSize: 8.5, color: pc, fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{l.niveau}</div>
                  </div>
                ))}
              </div>
            </div>
          );
          if (id === "interests" && formData.interests) return (
            <div key={id}>
              {sectionTitle("Centres d'interet")}
              <p style={{ fontSize: 10, lineHeight: 1.7, color: "#666", textAlign: "center", maxWidth: 500, margin: "0 auto" }}>{formData.interests}</p>
            </div>
          );
          return null;
        })}
      </div>

      {/* Bottom border */}
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent 5%, ${sc} 20%, ${pc} 50%, ${sc} 80%, transparent 95%)`, marginTop: "auto" }} />
    </div>
  );
};

export default CVPrestige;
