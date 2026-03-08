import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVTech = ({ formData, aiData, customization }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const pc = customization.colors.primary;
  const sc = customization.colors.secondary;
  const density = getDensityStyles(customization.density);
  const displayFont = `'${customization.font.display}', sans-serif`;
  const bodyFont = `'${customization.font.body}', sans-serif`;
  const sections = getOrderedSections(customization);
  const showPhoto = customization.photoStyle !== "none" && !!personal.photo;

  const leftSections = sections.filter(s => ["summary", "experiences", "formation"].includes(s));
  const rightSections = sections.filter(s => ["skills", "languages", "interests"].includes(s));

  const sidebarLabel = (title: string) => (
    <div style={{ marginBottom: 12 }}>
      <span style={{ fontFamily: displayFont, fontSize: 10, fontWeight: 700, color: pc, textTransform: "uppercase", letterSpacing: 3 }}>{title}</span>
      <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg, ${pc}, transparent)`, marginTop: 5 }} />
    </div>
  );

  const mainLabel = (title: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ fontFamily: displayFont, fontSize: 13, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: 2 }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
    </div>
  );

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 10.5, background: "#111", color: "#ccc" }}>
      {/* Header */}
      <div style={{ padding: "32px 38px", display: "flex", alignItems: "center", gap: 22, borderBottom: `1px solid #222` }}>
        {showPhoto && (
          <div style={{ ...getPhotoStyle(customization.photoStyle, 78, pc, customization.photoBorder), flexShrink: 0, boxShadow: `0 0 0 2px #111, 0 0 0 4px ${pc}40` }}>
            <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.15 }}>
            {personal.prenom} <span style={{ color: pc }}>{personal.nom}</span>
          </h1>
          <p style={{ fontSize: 11.5, color: pc, fontWeight: 500, marginTop: 4, letterSpacing: 3, textTransform: "uppercase" }}>{personal.poste}</p>
        </div>
        {/* Contact right */}
        <div style={{ textAlign: "right", fontSize: 9.5, lineHeight: 2 }}>
          {personal.email && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
              <span style={{ color: "#888" }}>{personal.email}</span>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: pc }} />
            </div>
          )}
          {personal.telephone && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
              <span style={{ color: "#888" }}>{personal.telephone}</span>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: pc }} />
            </div>
          )}
          {personal.ville && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
              <span style={{ color: "#888" }}>{personal.ville}</span>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: pc }} />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 225px" }}>
        {/* Main */}
        <div style={{ padding: "26px 24px 26px 38px" }}>
          {leftSections.map(id => {
            if (id === "summary" && summary) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {mainLabel("Profil")}
                <p style={{ fontSize: 10.5, lineHeight: 1.8, color: "#999", textAlign: "justify" }}>{summary}</p>
              </div>
            );
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2 }}>
                {mainLabel("Experience")}
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.4, padding: "14px 16px", background: "#181818", borderRadius: 8, borderLeft: `3px solid ${pc}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>{exp.poste}</div>
                        <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginTop: 2 }}>{exp.entreprise}</div>
                      </div>
                      <span style={{ fontSize: 8.5, color: "#555", fontFamily: "monospace", whiteSpace: "nowrap", background: "#1e1e1e", padding: "3px 8px", borderRadius: 4, flexShrink: 0 }}>
                        {exp.dateDebut} — {exp.dateFin}
                      </span>
                    </div>
                    <p style={{ fontSize: 10, lineHeight: 1.7, color: "#888", marginTop: 8, textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id}>
                {mainLabel("Formation")}
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: "12px 16px", background: "#181818", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>{f.diplome}</div>
                      <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>{f.ecole}</div>
                      {f.mention && <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{f.mention}</div>}
                    </div>
                    <span style={{ fontSize: 9, color: pc, fontWeight: 700, fontFamily: "monospace" }}>{f.annee}</span>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        {/* Sidebar */}
        <div style={{ padding: "26px 24px 26px 20px", background: "#0d0d0d", borderLeft: "1px solid #1a1a1a" }}>
          {rightSections.map(id => {
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.5 }}>
                {sidebarLabel("Skills")}
                {skills.map((s, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: "#ccc", fontWeight: 500 }}>{s}</span>
                    </div>
                    <div style={{ height: 3, background: "#222", borderRadius: 2 }}>
                      <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${pc}, ${sc})`, width: `${70 + (i * 9) % 30}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.5 }}>
                {sidebarLabel("Langues")}
                {langues.map((l, i) => (
                  <div key={i} style={{ marginBottom: 10, padding: "8px 10px", background: "#181818", borderRadius: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: "#ddd" }}>{l.langue}</span>
                      <span style={{ fontSize: 8.5, color: pc, fontWeight: 600 }}>{l.niveau}</span>
                    </div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(d => {
                        const level = l.niveau === "Natif" || l.niveau === "Courant" ? 5 : l.niveau === "Avancé" ? 4 : l.niveau === "Intermédiaire" ? 3 : 2;
                        return <div key={d} style={{ flex: 1, height: 3, borderRadius: 1, background: d <= level ? pc : "#2a2a2a" }} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
            if (id === "interests" && formData.interests) return (
              <div key={id}>
                {sidebarLabel("Interets")}
                <p style={{ fontSize: 9.5, lineHeight: 1.7, color: "#666" }}>{formData.interests}</p>
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CVTech;
