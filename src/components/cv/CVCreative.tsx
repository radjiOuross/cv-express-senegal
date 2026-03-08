import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVCreative = ({ formData, aiData, customization }: Props) => {
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
    <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: pc, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
      </div>
      <span style={{ fontFamily: displayFont, fontSize: 14, fontWeight: 700, color: "#1a1a1a", letterSpacing: 0.5 }}>{title}</span>
    </div>
  );

  const leftSections = sections.filter(s => ["skills", "languages", "interests"].includes(s));
  const rightSections = sections.filter(s => ["summary", "experiences", "formation"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 10.5, background: "#fff", display: "grid", gridTemplateColumns: "260px 1fr" }}>
      {/* Left sidebar */}
      <div style={{ background: pc, color: "#fff", padding: "0", position: "relative" }}>
        {/* Photo area */}
        <div style={{ padding: "36px 24px 20px", textAlign: "center" }}>
          {showPhoto && (
            <div style={{ display: "inline-block", marginBottom: 16 }}>
              <div style={{ ...getPhotoStyle(customization.photoStyle, 110, "#fff", customization.photoBorder), margin: "0 auto", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
                <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          )}
          <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{personal.prenom}</h1>
          <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 300, margin: "2px 0 8px" }}>{personal.nom}</h1>
          <div style={{ width: 40, height: 2, background: sc, margin: "0 auto 10px" }} />
          <p style={{ fontSize: 11, opacity: 0.9, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>{personal.poste}</p>
        </div>

        {/* Contact */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid rgba(255,255,255,0.15)`, borderBottom: `1px solid rgba(255,255,255,0.15)` }}>
          <div style={{ fontSize: 10, opacity: 0.85, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Contact</div>
          {personal.email && <div style={{ fontSize: 9.5, marginBottom: 8, opacity: 0.9, wordBreak: "break-all" }}>{personal.email}</div>}
          {personal.telephone && <div style={{ fontSize: 9.5, marginBottom: 8, opacity: 0.9 }}>{personal.telephone}</div>}
          {personal.ville && <div style={{ fontSize: 9.5, opacity: 0.9 }}>{personal.ville}</div>}
        </div>

        {/* Left sidebar sections */}
        <div style={{ padding: "20px 24px" }}>
          {leftSections.map(id => {
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, opacity: 0.85 }}>Compétences</div>
                <div style={{ filter: "brightness(10)" }}>{renderSkills(skills, customization.skillStyle, "#fff")}</div>
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, opacity: 0.85 }}>Langues</div>
                {langues.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 10 }}>
                    <span style={{ fontWeight: 600 }}>{l.langue}</span>
                    <span style={{ opacity: 0.75, fontSize: 9 }}>{l.niveau}</span>
                  </div>
                ))}
              </div>
            );
            if (id === "interests" && formData.interests) return (
              <div key={id}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, opacity: 0.85 }}>Intérêts</div>
                <p style={{ fontSize: 9.5, lineHeight: 1.6, opacity: 0.85 }}>{formData.interests}</p>
              </div>
            );
            return null;
          })}
        </div>
      </div>

      {/* Right content */}
      <div style={{ padding: "36px 36px 24px 30px" }}>
        {rightSections.map(id => {
          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Profil")}
              <p style={{ fontSize: 10.5, lineHeight: 1.75, color: "#444", textAlign: "justify", paddingLeft: 38 }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Expériences")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin * 1.2, paddingLeft: 38 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{exp.poste}</span>
                    <span style={{ fontSize: 9, color: pc, fontWeight: 600, background: `${pc}10`, padding: "2px 8px", borderRadius: 10 }}>{exp.dateDebut} — {exp.dateFin}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: "#888", fontWeight: 500, marginBottom: 4 }}>{exp.entreprise}</div>
                  <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id}>
              {sectionTitle("Formation")}
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: 12, paddingLeft: 38 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1a1a1a" }}>{f.diplome}</div>
                  <div style={{ fontSize: 10, color: "#666" }}>{f.ecole} — <span style={{ color: pc, fontWeight: 600 }}>{f.annee}</span></div>
                  {f.mention && <div style={{ fontSize: 9, color: "#888" }}>{f.mention}</div>}
                </div>
              ))}
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
};

export default CVCreative;
