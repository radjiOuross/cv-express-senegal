import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const levelToDots = (niveau: string) => {
  const map: Record<string, number> = { "Débutant": 1, "Intermédiaire": 2, "Avancé": 3, "Courant": 4, "Natif": 5 };
  return map[niveau] || 3;
};

const CVNature = ({ formData, aiData, customization }: Props) => {
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

  const lighten = (hex: string, amt: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + amt);
    const g = Math.min(255, ((num >> 8) & 0xFF) + amt);
    const b = Math.min(255, (num & 0xFF) + amt);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
  };

  const softBg = lighten(pc, 195);

  const leftSections = sections.filter(s => ["summary", "skills", "languages", "interests"].includes(s));
  const rightSections = sections.filter(s => ["experiences", "formation"].includes(s));

  const h = (t: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: `linear-gradient(135deg, ${pc}, ${lighten(pc, 60)})` }} />
      <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: pc, letterSpacing: 1.5 }}>{t}</h3>
      <div style={{ flex: 1, height: 0.5, background: `${pc}30` }} />
    </div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, background: "#faf8f2" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${pc}, ${lighten(pc, 30)})`, padding: "28px 36px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `4px solid ${lighten(pc, 60)}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {customization.photoStyle !== "none" && personal.photo && (
            <div style={{ ...getPhotoStyle(customization.photoStyle, 70, "#fff", customization.photoBorder), boxShadow: "0 4px 16px rgba(0,0,0,0.2)", flexShrink: 0 }}>
              <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 300, marginBottom: 2, letterSpacing: 0.5 }}>
              <span style={{ fontWeight: 700 }}>{personal.prenom}</span> {personal.nom}
            </h1>
            <p style={{ fontSize: 12, opacity: 0.9, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>{personal.poste}</p>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 9.5, opacity: 0.85, lineHeight: 2 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.telephone && <div>{personal.telephone}</div>}
          {personal.ville && <div>{personal.ville}</div>}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", padding: "24px 28px", gap: 24 }}>
        {/* Left */}
        <div style={{ width: "34%", flexShrink: 0 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: `1px solid ${softBg}` }}>
            {leftSections.map(id => {
              if (id === "summary" && summary) return (
                <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
                  {h("Profil")}
                  <p style={{ fontSize: 10, lineHeight: 1.7, color: "#555", textAlign: "justify" }}>{summary}</p>
                </div>
              );
              if (id === "skills" && skills.length > 0) return (
                <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
                  {h("Compétences")}
                  {renderSkills(skills, customization.skillStyle, pc)}
                </div>
              );
              if (id === "languages" && langues.length > 0) return (
                <div key={id} style={{ marginBottom: density.margin * 1.5 }}>
                  {h("Langues")}
                  {langues.map((l, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 500 }}>{l.langue}</span>
                      <div style={{ display: "flex", gap: 3 }}>
                        {[1, 2, 3, 4, 5].map(d => (
                          <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: d <= levelToDots(l.niveau) ? pc : "#e0e0e0" }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
              if (id === "interests" && formData.interests) return (
                <div key={id}>
                  {h("Centres d'intérêt")}
                  <p style={{ fontSize: 10, lineHeight: 1.6, color: "#555" }}>{formData.interests}</p>
                </div>
              );
              return null;
            })}
          </div>
        </div>

        {/* Right */}
        <div style={{ flex: 1 }}>
          {rightSections.map(id => {
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {h("Expérience professionnelle")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ position: "relative", paddingLeft: 18, marginBottom: density.margin * 1.3, borderLeft: `2px solid ${softBg}` }}>
                    <div style={{ position: "absolute", left: -5.5, top: 2, width: 9, height: 9, borderRadius: "50%", background: pc, border: "2px solid #faf8f2" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#222" }}>{exp.poste}</span>
                      <span style={{ fontSize: 8.5, color: "#999", fontStyle: "italic" }}>{exp.dateDebut} — {exp.dateFin}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginBottom: 4 }}>{exp.entreprise}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id}>
                {h("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ position: "relative", paddingLeft: 18, marginBottom: density.margin, borderLeft: `2px solid ${softBg}` }}>
                    <div style={{ position: "absolute", left: -5.5, top: 2, width: 9, height: 9, borderRadius: "50%", background: pc, border: "2px solid #faf8f2" }} />
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#222" }}>{f.diplome}</div>
                    <div style={{ fontSize: 10, color: "#777" }}>{f.ecole} — {f.annee}{f.mention ? ` (${f.mention})` : ""}</div>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CVNature;
