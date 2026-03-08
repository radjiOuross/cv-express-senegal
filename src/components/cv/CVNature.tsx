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

  const cream = "#faf8f3";

  const leftSections = sections.filter(s => ["summary", "skills", "languages", "interests"].includes(s));
  const rightSections = sections.filter(s => ["experiences", "formation"].includes(s));

  const heading = (t: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: pc }} />
      <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: pc, letterSpacing: 1.5 }}>{t}</h3>
      <div style={{ flex: 1, height: 0.5, backgroundColor: `${pc}40` }} />
    </div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: cream }}>
      {/* Header */}
      <div style={{ backgroundColor: pc, padding: "32px 40px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 300, marginBottom: 4, letterSpacing: 0.5 }}>
            <span style={{ fontWeight: 700 }}>{personal.prenom}</span> {personal.nom}
          </h1>
          <p style={{ fontSize: 13, color: "#fff", opacity: 0.85, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>{personal.poste}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: "rgba(255,255,255,0.8)", lineHeight: 2 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.telephone && <div>{personal.telephone}</div>}
          {personal.ville && <div>{personal.ville}</div>}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", padding: "24px 28px", gap: 24 }}>
        {/* Left sidebar */}
        <div style={{ width: "34%", flexShrink: 0 }}>
          <div style={{ backgroundColor: "#fff", borderRadius: 10, padding: "20px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", border: `1px solid ${pc}15` }}>
            {customization.photoStyle !== "none" && personal.photo && (
              <div style={{ ...getPhotoStyle(customization.photoStyle, 80, pc, customization.photoBorder), margin: "0 auto 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {leftSections.map(id => {
              if (id === "summary" && summary) return (
                <div key={id} style={{ marginBottom: density.margin * 1.4 }}>
                  {heading("Profil")}
                  <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555", textAlign: "justify" }}>{summary}</p>
                </div>
              );
              if (id === "skills" && skills.length > 0) return (
                <div key={id} style={{ marginBottom: density.margin * 1.4 }}>
                  {heading("Compétences")}
                  {renderSkills(skills, customization.skillStyle, pc)}
                </div>
              );
              if (id === "languages" && langues.length > 0) return (
                <div key={id} style={{ marginBottom: density.margin * 1.4 }}>
                  {heading("Langues")}
                  {langues.map((l, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 500 }}>{l.langue}</span>
                      <div style={{ display: "flex", gap: 3 }}>
                        {[1, 2, 3, 4, 5].map(d => (
                          <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: d <= levelToDots(l.niveau) ? pc : "#ddd" }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
              if (id === "interests" && formData.interests) return (
                <div key={id}>
                  {heading("Centres d'intérêt")}
                  <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{formData.interests}</p>
                </div>
              );
              return null;
            })}
          </div>
        </div>

        {/* Right content */}
        <div style={{ flex: 1 }}>
          {rightSections.map(id => {
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
                {heading("Expérience professionnelle")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ position: "relative", paddingLeft: 18, marginBottom: density.margin * 1.2, borderLeft: `2px solid ${pc}30` }}>
                    <div style={{ position: "absolute", left: -5, top: 2, width: 8, height: 8, borderRadius: "50%", backgroundColor: pc }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#222" }}>{exp.poste}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 10.5, color: pc, fontWeight: 600 }}>{exp.entreprise}</span>
                      <span style={{ fontSize: 9, color: "#999", fontStyle: "italic" }}>{exp.dateDebut} — {exp.dateFin}</span>
                    </div>
                    <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555", textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id}>
                {heading("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ position: "relative", paddingLeft: 18, marginBottom: density.margin, borderLeft: `2px solid ${pc}30` }}>
                    <div style={{ position: "absolute", left: -5, top: 2, width: 8, height: 8, borderRadius: "50%", backgroundColor: pc }} />
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#222" }}>{f.diplome}</div>
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
