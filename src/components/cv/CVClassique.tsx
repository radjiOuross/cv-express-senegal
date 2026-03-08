import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVClassique = ({ formData, aiData, customization }: Props) => {
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

  const levelToWidth = (niveau: string) => {
    const map: Record<string, number> = { "Débutant": 20, "Intermédiaire": 40, "Avancé": 60, "Courant": 80, "Natif": 100 };
    return map[niveau] || 50;
  };

  const sidebarSections = getOrderedSections(customization).filter(s => ["skills", "languages"].includes(s));
  const mainSections = getOrderedSections(customization).filter(s => ["summary", "experiences", "formation", "interests"].includes(s));

  const renderSidebarSection = (id: string) => {
    switch (id) {
      case "skills":
        return skills.length > 0 ? (
          <div key={id} style={{ marginBottom: density.margin * 2 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, color: sc, borderBottom: `1px solid ${sc}40`, paddingBottom: 6 }}>Compétences</h3>
            <div style={{ color: "rgba(255,255,255,0.9)" }}>{renderSkills(skills, customization.skillStyle, sc)}</div>
          </div>
        ) : null;
      case "languages":
        return langues.length > 0 ? (
          <div key={id}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, color: sc, borderBottom: `1px solid ${sc}40`, paddingBottom: 6 }}>Langues</h3>
            {langues.map((l, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 500 }}>{l.langue}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>{l.niveau}</span>
                </div>
                <div style={{ height: 3, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${levelToWidth(l.niveau)}%`, backgroundColor: sc, borderRadius: 2, transition: "width 0.3s" }} />
                </div>
              </div>
            ))}
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const renderMainSection = (id: string) => {
    switch (id) {
      case "summary":
        return summary ? (
          <div key={id} style={{ marginBottom: density.margin * 2 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: pc, letterSpacing: 1.5, marginBottom: 10, paddingBottom: 6, borderBottom: `2.5px solid ${pc}` }}>Profil professionnel</h2>
            <p style={{ fontSize: 10.5, lineHeight: density.lineHeight, color: "#444", textAlign: "justify" }}>{summary}</p>
          </div>
        ) : null;
      case "experiences":
        return experiences.length > 0 ? (
          <div key={id} style={{ marginBottom: density.margin * 2 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: pc, letterSpacing: 1.5, marginBottom: 14, paddingBottom: 6, borderBottom: `2.5px solid ${pc}` }}>Expérience professionnelle</h2>
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: density.margin * 1.2, paddingLeft: 14, borderLeft: `3px solid ${pc}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{exp.poste}</span>
                  <span style={{ fontSize: 9, color: "#888", whiteSpace: "nowrap", fontStyle: "italic" }}>{exp.dateDebut} — {exp.dateFin}</span>
                </div>
                <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginBottom: 4 }}>{exp.entreprise}</div>
                <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555", textAlign: "justify" }}>{exp.description}</p>
              </div>
            ))}
          </div>
        ) : null;
      case "formation":
        return formation.length > 0 ? (
          <div key={id} style={{ marginBottom: density.margin * 2 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: pc, letterSpacing: 1.5, marginBottom: 14, paddingBottom: 6, borderBottom: `2.5px solid ${pc}` }}>Formation</h2>
            {formation.map((f, i) => (
              <div key={i} style={{ marginBottom: density.margin, paddingLeft: 14, borderLeft: `3px solid ${pc}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{f.diplome}</span>
                  <span style={{ fontSize: 9, color: "#888", fontStyle: "italic" }}>{f.annee}</span>
                </div>
                <div style={{ fontSize: 10, color: "#666" }}>{f.ecole}{f.mention ? ` — ${f.mention}` : ""}</div>
              </div>
            ))}
          </div>
        ) : null;
      case "interests":
        return formData.interests ? (
          <div key={id} style={{ marginBottom: density.margin * 2 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: pc, letterSpacing: 1.5, marginBottom: 10, paddingBottom: 6, borderBottom: `2.5px solid ${pc}` }}>Centres d'intérêt</h2>
            <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{formData.interests}</p>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: bodyFont, fontSize: 11 }}>
      {/* Sidebar */}
      <div style={{ width: 270, backgroundColor: pc, color: "white", padding: "40px 24px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        {customization.photoStyle !== "none" && personal.photo && (
          <div style={{ ...getPhotoStyle(customization.photoStyle, 110, sc, customization.photoBorder), margin: "0 auto 20px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
            <img src={personal.photo} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.2, marginBottom: 4 }}>
          {personal.prenom}<br />{personal.nom}
        </h1>
        <p style={{ textAlign: "center", fontSize: 11, color: sc, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 28 }}>
          {personal.poste}
        </p>

        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, color: sc, borderBottom: `1px solid ${sc}40`, paddingBottom: 6 }}>Contact</h3>
          {personal.email && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 10 }}>
              <span style={{ color: sc, fontWeight: 700, fontSize: 12, lineHeight: 1 }}>@</span>
              <span style={{ wordBreak: "break-all", lineHeight: 1.4, color: "rgba(255,255,255,0.9)" }}>{personal.email}</span>
            </div>
          )}
          {personal.telephone && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 10 }}>
              <span style={{ color: sc, fontWeight: 700, fontSize: 11 }}>T</span>
              <span style={{ color: "rgba(255,255,255,0.9)" }}>{personal.telephone}</span>
            </div>
          )}
          {personal.ville && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 10 }}>
              <span style={{ color: sc, fontWeight: 700, fontSize: 11 }}>A</span>
              <span style={{ color: "rgba(255,255,255,0.9)" }}>{personal.ville}</span>
            </div>
          )}
        </div>

        {sidebarSections.map(renderSidebarSection)}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "40px 32px", backgroundColor: "white", color: "#1a1a1a" }}>
        {mainSections.map(renderMainSection)}
      </div>
    </div>
  );
};

export default CVClassique;
