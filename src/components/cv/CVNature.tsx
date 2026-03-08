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

  const cream = "#f5f0e8";
  const lightAccent = lighten(pc, 160);

  const leftSections = sections.filter(s => ["summary", "skills", "languages", "interests"].includes(s));
  const rightSections = sections.filter(s => ["experiences", "formation"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, backgroundColor: cream }}>
      <div style={{ backgroundColor: pc, padding: `${density.padding * 2.2}px ${density.padding * 2.5}px`, color: "#fff" }}>
        <h1 style={{ fontFamily: displayFont, fontSize: 36, fontWeight: 400, marginBottom: 4 }}>{personal.prenom} {personal.nom}</h1>
        <p style={{ fontSize: 13, color: sc, marginBottom: 12 }}>{personal.poste}</p>
        <div style={{ display: "flex", gap: 20, fontSize: 10, color: "#fff", opacity: 0.9 }}>
          {personal.email && <span>🌿 {personal.email}</span>}
          {personal.telephone && <span>🌿 {personal.telephone}</span>}
          {personal.ville && <span>🌿 {personal.ville}</span>}
        </div>
      </div>

      <div style={{ display: "flex", padding: `${density.padding * 1.7}px ${density.padding * 2}px`, gap: 24 }}>
        <div style={{ width: "35%", flexShrink: 0 }}>
          <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: density.padding * 1.5, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {customization.photoStyle !== "none" && personal.photo && (
              <div style={{ ...getPhotoStyle(customization.photoStyle, 90, pc, customization.photoBorder), margin: "0 auto 16px" }}>
                <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {leftSections.map(id => {
              const heading = (t: string) => <h3 style={{ fontSize: 11, textTransform: "uppercase", color: pc, letterSpacing: 1, marginBottom: 8 }}>🌿 {t}</h3>;
              if (id === "summary" && summary) return (
                <div key={id} style={{ marginBottom: density.margin * 1.4 }}>
                  {heading("Profil")}
                  <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{summary}</p>
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
                      <span style={{ fontSize: 10 }}>{l.langue}</span>
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

        <div style={{ flex: 1 }}>
          {rightSections.map(id => {
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
                <h3 style={{ fontSize: 11, textTransform: "uppercase", color: pc, letterSpacing: 1, marginBottom: 12 }}>🌿 Expériences</h3>
                {experiences.map((exp, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: density.margin }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: pc, flexShrink: 0 }} />
                      {i < experiences.length - 1 && <div style={{ width: 2, flex: 1, backgroundColor: pc, opacity: 0.25 }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#222" }}>{exp.poste}</div>
                      <div style={{ fontSize: 10, color: pc, fontWeight: 500 }}>{exp.entreprise}</div>
                      <div style={{ fontSize: 9, color: "#999", marginBottom: 4 }}>{exp.dateDebut} — {exp.dateFin}</div>
                      <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#555" }}>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id}>
                <h3 style={{ fontSize: 11, textTransform: "uppercase", color: pc, letterSpacing: 1, marginBottom: 12 }}>🌿 Formation</h3>
                {formation.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: density.margin }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: pc, flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{f.diplome}</div>
                      <div style={{ fontSize: 10, color: "#777" }}>{f.ecole} • {f.annee}{f.mention ? ` — ${f.mention}` : ""}</div>
                    </div>
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
