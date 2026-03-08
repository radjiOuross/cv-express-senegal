import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const levelToPercent = (niveau: string) => {
  const map: Record<string, number> = { "Débutant": 20, "Intermédiaire": 40, "Avancé": 60, "Courant": 80, "Natif": 100 };
  return map[niveau] || 50;
};

const CVAudacieux = ({ formData, aiData, customization }: Props) => {
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

  const darken = (hex: string, amt = 40) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - amt);
    const g = Math.max(0, ((num >> 8) & 0xFF) - amt);
    const b = Math.max(0, (num & 0xFF) - amt);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
  };

  const sidebarBg = "#1a1a2e";
  const mainBg = "#16213e";

  const sidebarSections = sections.filter(s => ["skills", "languages"].includes(s));
  const mainSections = sections.filter(s => ["summary", "experiences", "formation", "interests"].includes(s));

  const sectionH = (t: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 18, backgroundColor: sc, borderRadius: 2 }} />
      <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: sc, letterSpacing: 2 }}>{t}</h2>
    </div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: bodyFont, fontSize: 11 }}>
      {/* Sidebar */}
      <div style={{ width: 260, backgroundColor: sidebarBg, padding: "36px 22px", flexShrink: 0 }}>
        {customization.photoStyle !== "none" && personal.photo && (
          <div style={{ ...getPhotoStyle(customization.photoStyle, 100, sc, customization.photoBorder), margin: "0 auto 20px", boxShadow: `0 4px 20px rgba(0,0,0,0.4)` }}>
            <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.2, marginBottom: 4 }}>
          {personal.prenom}<br />{personal.nom}
        </h1>
        <p style={{ textAlign: "center", fontSize: 11, textTransform: "uppercase", color: sc, letterSpacing: 2, fontWeight: 500, marginBottom: 28 }}>{personal.poste}</p>

        {/* Contact */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: sc, letterSpacing: 1.5, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${sc}30` }}>Contact</h3>
          {personal.email && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 10, color: "#ccc" }}>
              <span style={{ color: sc, fontWeight: 700, fontSize: 11 }}>@</span>
              <span style={{ wordBreak: "break-all", lineHeight: 1.4 }}>{personal.email}</span>
            </div>
          )}
          {personal.telephone && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 10, color: "#ccc" }}>
              <span style={{ color: sc, fontWeight: 700, fontSize: 11 }}>T</span>
              <span>{personal.telephone}</span>
            </div>
          )}
          {personal.ville && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 10, color: "#ccc" }}>
              <span style={{ color: sc, fontWeight: 700, fontSize: 11 }}>A</span>
              <span>{personal.ville}</span>
            </div>
          )}
        </div>

        {sidebarSections.map(id => {
          if (id === "skills" && skills.length > 0) return (
            <div key={id} style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: sc, letterSpacing: 1.5, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${sc}30` }}>Compétences</h3>
              <div style={{ color: "#ddd" }}>{renderSkills(skills, customization.skillStyle, sc)}</div>
            </div>
          );
          if (id === "languages" && langues.length > 0) return (
            <div key={id}>
              <h3 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: sc, letterSpacing: 1.5, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${sc}30` }}>Langues</h3>
              {langues.map((l, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: "#ddd" }}>{l.langue}</span>
                    <span style={{ fontSize: 9, color: sc }}>{l.niveau}</span>
                  </div>
                  <div style={{ height: 3, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${levelToPercent(l.niveau)}%`, backgroundColor: sc, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          );
          return null;
        })}
      </div>

      {/* Main */}
      <div style={{ flex: 1, backgroundColor: mainBg, padding: "36px 30px", color: "#eee" }}>
        {mainSections.map(id => {
          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
              {sectionH("Profil")}
              <p style={{ fontSize: 10.5, lineHeight: density.lineHeight, color: "#bbb", textAlign: "justify" }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
              {sectionH("Expérience professionnelle")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin * 1.2 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{exp.poste}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 10.5, color: sc, fontWeight: 500 }}>{exp.entreprise}</span>
                    <span style={{ fontSize: 9, color: "#888", backgroundColor: "rgba(255,255,255,0.06)", padding: "2px 10px", borderRadius: 10 }}>
                      {exp.dateDebut} — {exp.dateFin}
                    </span>
                  </div>
                  <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#aaa", textAlign: "justify" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
              {sectionH("Formation")}
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: density.margin, padding: "8px 12px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 6, borderLeft: `3px solid ${sc}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{f.diplome}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{f.ecole}</div>
                  <div style={{ fontSize: 9, color: sc }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                </div>
              ))}
            </div>
          );
          if (id === "interests" && formData.interests) return (
            <div key={id}>
              {sectionH("Centres d'intérêt")}
              <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#aaa" }}>{formData.interests}</p>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
};

export default CVAudacieux;
