import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const levelToWidth = (niveau: string) => {
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

  const sidebarSections = sections.filter(s => ["skills", "languages"].includes(s));
  const mainSections = sections.filter(s => ["summary", "experiences", "formation", "interests"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: bodyFont, fontSize: 11 }}>
      {/* Sidebar - Dark */}
      <div style={{ width: 270, background: "linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)", padding: 0, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        {/* Accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: `linear-gradient(180deg, transparent, ${sc}, transparent)` }} />
        
        <div style={{ padding: "32px 22px 32px 26px" }}>
          {customization.photoStyle !== "none" && personal.photo && (
            <div style={{ ...getPhotoStyle(customization.photoStyle, 100, sc, customization.photoBorder), margin: "0 auto 20px", boxShadow: `0 0 20px ${sc}30` }}>
              <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 6 }}>
              {personal.prenom}<br /><span style={{ color: sc }}>{personal.nom}</span>
            </h1>
            <div style={{ display: "inline-block", padding: "4px 16px", border: `1px solid ${sc}`, borderRadius: 20 }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", color: sc, letterSpacing: 2, fontWeight: 600 }}>{personal.poste}</p>
            </div>
          </div>

          {/* Contact */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: sc, marginBottom: 12 }}>CONTACT</div>
            {personal.email && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: sc, marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.7)", wordBreak: "break-all", lineHeight: 1.4 }}>{personal.email}</span>
              </div>
            )}
            {personal.telephone && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: sc, flexShrink: 0 }} />
                <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.7)" }}>{personal.telephone}</span>
              </div>
            )}
            {personal.ville && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: sc, flexShrink: 0 }} />
                <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.7)" }}>{personal.ville}</span>
              </div>
            )}
          </div>

          {sidebarSections.map(id => {
            const h = (t: string) => (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: sc, marginBottom: 6 }}>{t}</div>
                <div style={{ width: "100%", height: 0.5, background: `linear-gradient(90deg, ${sc}, transparent)` }} />
              </div>
            );
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: 24 }}>
                {h("COMPÉTENCES")}
                <div style={{ color: "rgba(255,255,255,0.85)" }}>{renderSkills(skills, customization.skillStyle, sc)}</div>
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id}>
                {h("LANGUES")}
                {langues.map((l, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: "#ddd" }}>{l.langue}</span>
                      <span style={{ fontSize: 8, color: sc }}>{l.niveau}</span>
                    </div>
                    <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1 }}>
                      <div style={{ height: "100%", width: `${levelToWidth(l.niveau)}%`, background: `linear-gradient(90deg, ${sc}, ${sc}66)`, borderRadius: 1 }} />
                    </div>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>
      </div>

      {/* Main - Dark blue */}
      <div style={{ flex: 1, background: "linear-gradient(180deg, #16213e 0%, #1a1a3e 100%)", padding: "32px 32px", color: "#e8e8e8" }}>
        {mainSections.map(id => {
          const h = (t: string) => (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 3, height: 20, background: sc, borderRadius: 2 }} />
              <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#fff", letterSpacing: 1.5 }}>{t}</h2>
              <div style={{ flex: 1, height: 0.5, background: `linear-gradient(90deg, ${sc}40, transparent)` }} />
            </div>
          );
          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {h("Profil")}
              <p style={{ fontSize: 10.5, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", textAlign: "justify" }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {h("Expériences")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin * 1.3, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, borderLeft: `3px solid ${sc}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{exp.poste}</span>
                    <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "2px 10px", borderRadius: 10 }}>{exp.dateDebut} — {exp.dateFin}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: sc, fontWeight: 500, marginBottom: 4 }}>{exp.entreprise}</div>
                  <p style={{ fontSize: 10, lineHeight: 1.65, color: "rgba(255,255,255,0.6)" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2 }}>
              {h("Formation")}
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: density.margin, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>{f.diplome}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{f.ecole}</div>
                  <div style={{ fontSize: 9, color: sc, fontWeight: 500 }}>{f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                </div>
              ))}
            </div>
          );
          if (id === "interests" && formData.interests) return (
            <div key={id}>
              {h("Centres d'intérêt")}
              <p style={{ fontSize: 10, lineHeight: 1.65, color: "rgba(255,255,255,0.6)" }}>{formData.interests}</p>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
};

export default CVAudacieux;
