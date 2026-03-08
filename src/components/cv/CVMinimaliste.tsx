import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVMinimaliste = ({ formData, aiData, customization }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const pc = customization.colors.primary;
  const density = getDensityStyles(customization.density);
  const displayFont = `'${customization.font.display}', serif`;
  const bodyFont = `'${customization.font.body}', sans-serif`;
  const sections = getOrderedSections(customization);

  const levelToDots = (niveau: string) => {
    const map: Record<string, number> = { "Débutant": 1, "Intermédiaire": 2, "Avancé": 3, "Courant": 4, "Natif": 5 };
    return map[niveau] || 3;
  };

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 11, background: "#fafafa", padding: "48px 48px", color: "#2d2d2d" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: displayFont, fontSize: 44, fontWeight: 300, color: "#111", lineHeight: 1, marginBottom: 4, letterSpacing: -1 }}>
          {personal.prenom} <span style={{ fontWeight: 800 }}>{personal.nom}</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
          <p style={{ fontSize: 14, color: pc, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" }}>{personal.poste}</p>
        </div>
      </div>

      {/* Contact bar */}
      <div style={{ display: "flex", gap: 20, fontSize: 10, color: "#666", padding: "12px 0", borderTop: `2px solid ${pc}`, borderBottom: "1px solid #e0e0e0", marginBottom: 28 }}>
        {personal.email && <span>{personal.email}</span>}
        {personal.telephone && <><span style={{ color: "#ccc" }}>|</span><span>{personal.telephone}</span></>}
        {personal.ville && <><span style={{ color: "#ccc" }}>|</span><span>{personal.ville}</span></>}
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.4fr", gap: 36 }}>
        {/* Left */}
        <div>
          {sections.filter(s => ["skills", "formation", "languages"].includes(s)).map(id => {
            const h = (t: string) => (
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: pc, letterSpacing: 2.5, marginBottom: 4 }}>{t}</h3>
                <div style={{ width: 20, height: 2, background: pc }} />
              </div>
            );
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
                {h("Compétences")}
                {renderSkills(skills, customization.skillStyle, pc)}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
                {h("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: density.margin }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#222" }}>{f.diplome}</div>
                    <div style={{ fontSize: 9.5, color: "#777" }}>{f.ecole}</div>
                    <div style={{ fontSize: 9, color: pc, fontWeight: 600 }}>{f.annee}</div>
                  </div>
                ))}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
                {h("Langues")}
                {langues.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 500 }}>{l.langue}</span>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(d => (
                        <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: d <= levelToDots(l.niveau) ? pc : "#ddd" }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        {/* Right */}
        <div>
          {sections.filter(s => ["summary", "experiences", "interests"].includes(s)).map(id => {
            const h = (t: string) => (
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: pc, letterSpacing: 2.5, marginBottom: 4 }}>{t}</h3>
                <div style={{ width: 20, height: 2, background: pc }} />
              </div>
            );
            if (id === "summary" && summary) return (
              <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
                {h("Profil")}
                <p style={{ fontSize: 10.5, lineHeight: 1.7, color: "#444", textAlign: "justify" }}>{summary}</p>
              </div>
            );
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
                {h("Expérience professionnelle")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.4, paddingBottom: density.margin, borderBottom: i < experiences.length - 1 ? "1px solid #eee" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111" }}>{exp.poste}</span>
                      <span style={{ fontSize: 9, color: "#999", whiteSpace: "nowrap" }}>{exp.dateDebut} — {exp.dateFin}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginBottom: 4 }}>{exp.entreprise}</div>
                    <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555", textAlign: "justify" }}>{exp.description}</p>
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
    </div>
  );
};

export default CVMinimaliste;
