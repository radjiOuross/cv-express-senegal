import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVExecutive = ({ formData, aiData, customization }: Props) => {
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
  const showPhoto = customization.photoStyle !== "none" && !!personal.photo;

  const mainSections = sections.filter(s => ["summary", "experiences", "formation"].includes(s));
  const sideSections = sections.filter(s => ["skills", "languages", "interests"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 10.5, background: "#fff", color: "#333", position: "relative" }}>
      {/* Accent top bar */}
      <div style={{ height: 6, background: pc }} />

      {/* Header */}
      <div style={{ padding: "30px 44px 26px", background: "#fafafa", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {showPhoto && (
            <div style={{ ...getPhotoStyle(customization.photoStyle, 88, pc, customization.photoBorder), flexShrink: 0, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 700, color: "#1a1a1a", margin: 0, lineHeight: 1.15, letterSpacing: 0.5 }}>
              {personal.prenom} {personal.nom}
            </h1>
            <p style={{ fontSize: 13, color: pc, fontWeight: 600, marginTop: 5, letterSpacing: 2.5, textTransform: "uppercase" }}>{personal.poste}</p>
          </div>
        </div>
        {/* Contact bar */}
        <div style={{ marginTop: 16, display: "flex", gap: 28, fontSize: 9.5, color: "#555" }}>
          {personal.email && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: pc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>@</span>
              </div>
              <span>{personal.email}</span>
            </div>
          )}
          {personal.telephone && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: pc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>T</span>
              </div>
              <span>{personal.telephone}</span>
            </div>
          )}
          {personal.ville && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: pc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>A</span>
              </div>
              <span>{personal.ville}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 235px", minHeight: 900 }}>
        {/* Main */}
        <div style={{ padding: "26px 28px 26px 44px" }}>
          {mainSections.map(id => {
            if (id === "summary" && summary) return (
              <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 4, height: 20, background: pc, borderRadius: 2 }} />
                  <span style={{ fontFamily: displayFont, fontSize: 14, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: 1.5 }}>Profil</span>
                </div>
                <p style={{ fontSize: 10.5, lineHeight: 1.7, color: "#444", textAlign: "justify", paddingLeft: 14 }}>{summary}</p>
              </div>
            );
            if (id === "experiences" && experiences.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 20, background: pc, borderRadius: 2 }} />
                  <span style={{ fontFamily: displayFont, fontSize: 14, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: 1.5 }}>Experience professionnelle</span>
                </div>
                {experiences.map((exp, i) => (
                  <div key={i} style={{ marginBottom: density.margin * 1.3, paddingLeft: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{exp.poste}</div>
                        <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginTop: 1 }}>{exp.entreprise}</div>
                      </div>
                      <div style={{ fontSize: 9, color: "#fff", background: pc, padding: "3px 10px", borderRadius: 12, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, marginLeft: 10 }}>
                        {exp.dateDebut} — {exp.dateFin}
                      </div>
                    </div>
                    <p style={{ fontSize: 10, lineHeight: 1.7, color: "#555", marginTop: 6, textAlign: "justify" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            );
            if (id === "formation" && formation.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 1.8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 20, background: pc, borderRadius: 2 }} />
                  <span style={{ fontFamily: displayFont, fontSize: 14, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: 1.5 }}>Formation</span>
                </div>
                {formation.map((f, i) => (
                  <div key={i} style={{ marginBottom: 12, paddingLeft: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{f.diplome}</div>
                      <div style={{ fontSize: 10.5, color: "#666", marginTop: 1 }}>{f.ecole}</div>
                      {f.mention && <div style={{ fontSize: 9, color: pc, fontWeight: 500, marginTop: 2 }}>{f.mention}</div>}
                    </div>
                    <div style={{ fontSize: 9, color: pc, fontWeight: 600, background: `${pc}12`, padding: "3px 10px", borderRadius: 12, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {f.annee}
                    </div>
                  </div>
                ))}
              </div>
            );
            return null;
          })}
        </div>

        {/* Sidebar */}
        <div style={{ background: "#f5f5f5", padding: "26px 22px", borderLeft: "1px solid #e8e8e8" }}>
          {sideSections.map(id => {
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.5 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: pc, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, paddingBottom: 6, borderBottom: `2px solid ${pc}` }}>Competences</div>
                {renderSkills(skills, customization.skillStyle, pc)}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.5 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: pc, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, paddingBottom: 6, borderBottom: `2px solid ${pc}` }}>Langues</div>
                {langues.map((l, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: "#333" }}>{l.langue}</span>
                      <span style={{ fontSize: 9, color: "#888" }}>{l.niveau}</span>
                    </div>
                    <div style={{ height: 3, background: "#ddd", borderRadius: 2 }}>
                      <div style={{ height: "100%", borderRadius: 2, background: pc, width: l.niveau === "Natif" || l.niveau === "Courant" ? "95%" : l.niveau === "Avancé" ? "80%" : l.niveau === "Intermédiaire" ? "60%" : "35%" }} />
                    </div>
                  </div>
                ))}
              </div>
            );
            if (id === "interests" && formData.interests) return (
              <div key={id}>
                <div style={{ fontSize: 11, fontWeight: 700, color: pc, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, paddingBottom: 6, borderBottom: `2px solid ${pc}` }}>Centres d'interet</div>
                <p style={{ fontSize: 10, lineHeight: 1.65, color: "#555" }}>{formData.interests}</p>
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CVExecutive;
