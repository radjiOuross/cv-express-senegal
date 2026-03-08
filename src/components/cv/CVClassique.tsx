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

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: bodyFont, fontSize: 11, background: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: 280, background: `linear-gradient(180deg, ${pc} 0%, ${pc}dd 100%)`, color: "white", padding: "0", flexShrink: 0, position: "relative" }}>
        {/* Decorative top accent */}
        <div style={{ height: 6, background: sc, width: "100%" }} />
        
        <div style={{ padding: "28px 24px" }}>
          {/* Photo */}
          {customization.photoStyle !== "none" && personal.photo && (
            <div style={{ margin: "0 auto 20px", position: "relative" }}>
              <div style={{ ...getPhotoStyle(customization.photoStyle, 120, sc, customization.photoBorder), margin: "0 auto", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
                <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          )}

          {/* Name */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 6 }}>
              {personal.prenom}<br /><span style={{ fontWeight: 400 }}>{personal.nom}</span>
            </h1>
            <div style={{ width: 40, height: 2, background: sc, margin: "8px auto" }} />
            <p style={{ fontSize: 11, color: sc, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5 }}>{personal.poste}</p>
          </div>

          {/* Contact */}
          <div style={{ marginBottom: 28, padding: "16px", background: "rgba(255,255,255,0.08)", borderRadius: 8 }}>
            <h3 style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: sc, marginBottom: 12 }}>CONTACT</h3>
            {personal.email && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 9.5 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: sc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: pc, fontWeight: 800, flexShrink: 0 }}>@</div>
                <span style={{ wordBreak: "break-all", lineHeight: 1.5, color: "rgba(255,255,255,0.9)" }}>{personal.email}</span>
              </div>
            )}
            {personal.telephone && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 9.5 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: sc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: pc, fontWeight: 800, flexShrink: 0 }}>T</div>
                <span style={{ color: "rgba(255,255,255,0.9)" }}>{personal.telephone}</span>
              </div>
            )}
            {personal.ville && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 9.5 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: sc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: pc, fontWeight: 800, flexShrink: 0 }}>A</div>
                <span style={{ color: "rgba(255,255,255,0.9)" }}>{personal.ville}</span>
              </div>
            )}
          </div>

          {/* Sidebar sections */}
          {sidebarSections.map(id => {
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: sc, marginBottom: 14, paddingBottom: 6, borderBottom: `1px solid rgba(255,255,255,0.15)` }}>COMPÉTENCES</h3>
                <div style={{ color: "rgba(255,255,255,0.9)" }}>{renderSkills(skills, customization.skillStyle, sc)}</div>
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id}>
                <h3 style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: sc, marginBottom: 14, paddingBottom: 6, borderBottom: `1px solid rgba(255,255,255,0.15)` }}>LANGUES</h3>
                {langues.map((l, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 500 }}>{l.langue}</span>
                      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>{l.niveau}</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.12)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${levelToWidth(l.niveau)}%`, background: `linear-gradient(90deg, ${sc}, ${sc}aa)`, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "34px 36px", background: "#fff" }}>
        {mainSections.map(id => {
          const sectionTitle = (title: string) => (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", color: pc, letterSpacing: 1, fontFamily: displayFont, whiteSpace: "nowrap" }}>{title}</h2>
              <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg, ${pc}, transparent)` }} />
            </div>
          );

          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Profil")}
              <p style={{ fontSize: 10.5, lineHeight: 1.7, color: "#444", textAlign: "justify", paddingLeft: 2 }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Expérience professionnelle")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin * 1.3, position: "relative", paddingLeft: 16, borderLeft: `2.5px solid ${pc}20` }}>
                  <div style={{ position: "absolute", left: -5, top: 2, width: 8, height: 8, borderRadius: "50%", background: pc }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a1a" }}>{exp.poste}</span>
                    <span style={{ fontSize: 9, color: "#999", whiteSpace: "nowrap", fontStyle: "italic", background: `${pc}08`, padding: "2px 8px", borderRadius: 10 }}>{exp.dateDebut} — {exp.dateFin}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginBottom: 4 }}>{exp.entreprise}</div>
                  <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {sectionTitle("Formation")}
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: density.margin, paddingLeft: 16, borderLeft: `2.5px solid ${pc}20`, position: "relative" }}>
                  <div style={{ position: "absolute", left: -5, top: 2, width: 8, height: 8, borderRadius: "50%", background: pc }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{f.diplome}</span>
                    <span style={{ fontSize: 9, color: pc, fontWeight: 500 }}>{f.annee}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#666" }}>{f.ecole}{f.mention ? ` — ${f.mention}` : ""}</div>
                </div>
              ))}
            </div>
          );
          if (id === "interests" && formData.interests) return (
            <div key={id}>
              {sectionTitle("Centres d'intérêt")}
              <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555", paddingLeft: 2 }}>{formData.interests}</p>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
};

export default CVClassique;
