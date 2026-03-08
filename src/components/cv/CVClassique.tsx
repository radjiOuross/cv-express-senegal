import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, isSectionVisible, getOrderedSections } from "./cvUtils";

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
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, color: sc }}>Compétences</h3>
            <div style={{ color: "#fff" }}>{renderSkills(skills, customization.skillStyle, sc)}</div>
          </div>
        ) : null;
      case "languages":
        return langues.length > 0 ? (
          <div key={id}>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, color: sc }}>Langues</h3>
            {langues.map((l, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, marginBottom: 4 }}>{l.langue}</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div key={dot} style={{
                      width: 8, height: 8, borderRadius: "50%",
                      backgroundColor: dot <= Math.ceil(levelToWidth(l.niveau) / 20) ? sc : "rgba(255,255,255,0.2)"
                    }} />
                  ))}
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
            <h2 style={{ fontSize: 11, textTransform: "uppercase", color: pc, letterSpacing: 2, marginBottom: 8, borderBottom: `2px solid ${pc}`, paddingBottom: 4 }}>Profil</h2>
            <p style={{ fontSize: 11, lineHeight: density.lineHeight, color: "#444" }}>{summary}</p>
          </div>
        ) : null;
      case "experiences":
        return experiences.length > 0 ? (
          <div key={id} style={{ marginBottom: density.margin * 2 }}>
            <h2 style={{ fontSize: 11, textTransform: "uppercase", color: pc, letterSpacing: 2, marginBottom: 12, borderBottom: `2px solid ${pc}`, paddingBottom: 4 }}>Expériences</h2>
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: density.margin, paddingLeft: 16, borderLeft: `2px solid ${pc}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: pc }}>{exp.poste}</div>
                <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>{exp.entreprise} • {exp.dateDebut} — {exp.dateFin}</div>
                <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#444" }}>{exp.description}</p>
              </div>
            ))}
          </div>
        ) : null;
      case "formation":
        return formation.length > 0 ? (
          <div key={id} style={{ marginBottom: density.margin * 2 }}>
            <h2 style={{ fontSize: 11, textTransform: "uppercase", color: pc, letterSpacing: 2, marginBottom: 12, borderBottom: `2px solid ${pc}`, paddingBottom: 4 }}>Formation</h2>
            {formation.map((f, i) => (
              <div key={i} style={{ marginBottom: density.margin }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{f.diplome}</div>
                <div style={{ fontSize: 10, color: "#666" }}>{f.ecole} • {f.annee}{f.mention ? ` • ${f.mention}` : ""}</div>
              </div>
            ))}
          </div>
        ) : null;
      case "interests":
        return formData.interests ? (
          <div key={id} style={{ marginBottom: density.margin * 2 }}>
            <h2 style={{ fontSize: 11, textTransform: "uppercase", color: pc, letterSpacing: 2, marginBottom: 8, borderBottom: `2px solid ${pc}`, paddingBottom: 4 }}>Centres d'intérêt</h2>
            <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#444" }}>{formData.interests}</p>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: bodyFont, fontSize: 11 }}>
      {/* Sidebar */}
      <div style={{ width: 280, backgroundColor: pc, color: "white", padding: `${density.padding * 2.5}px ${density.padding * 1.5}px`, flexShrink: 0 }}>
        {customization.photoStyle !== "none" && personal.photo && (
          <div style={{ ...getPhotoStyle(customization.photoStyle, 120, sc, customization.photoBorder), margin: "0 auto 20px" }}>
            <img src={personal.photo} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontFamily: displayFont, fontSize: 20, fontWeight: 700, color: sc, textAlign: "center", marginBottom: 4 }}>
          {personal.prenom} {personal.nom}
        </h1>
        <p style={{ textAlign: "center", fontSize: 12, color: sc, opacity: 0.8, marginBottom: 30 }}>
          {personal.poste}
        </p>

        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, color: sc }}>Contact</h3>
          {personal.email && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 10 }}>✉ {personal.email}</div>}
          {personal.telephone && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 10 }}>📞 {personal.telephone}</div>}
          {personal.ville && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 10 }}>📍 {personal.ville}</div>}
        </div>

        {sidebarSections.map(renderSidebarSection)}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: `${density.padding * 2.5}px ${density.padding * 2}px`, backgroundColor: "white", color: "#1a1a1a" }}>
        {mainSections.map(renderMainSection)}
      </div>
    </div>
  );
};

export default CVClassique;
