import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";
import { renderSkills, getOrderedSections } from "./cvUtils";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

const CVCreative = ({ formData, aiData, customization }: Props) => {
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

  const leftSections = sections.filter(s => ["skills", "languages", "interests"].includes(s));
  const rightSections = sections.filter(s => ["summary", "experiences", "formation"].includes(s));

  // Lighter shade for sidebar text
  const sidebarTextLight = "rgba(255,255,255,0.82)";
  const sidebarTextMuted = "rgba(255,255,255,0.6)";

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: bodyFont, fontSize: 10.5, background: "#fff", display: "grid", gridTemplateColumns: "270px 1fr" }}>
      {/* ===== LEFT SIDEBAR ===== */}
      <div style={{ background: pc, color: "#fff", position: "relative", overflow: "hidden" }}>
        {/* Decorative shapes */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: 60, left: -30, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        {/* Photo + Identity */}
        <div style={{ padding: "40px 28px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          {showPhoto && (
            <div style={{ display: "inline-block", marginBottom: 18, padding: 4, borderRadius: customization.photoStyle === "circle" ? "50%" : 14, border: "2px solid rgba(255,255,255,0.3)" }}>
              <div style={{ ...getPhotoStyle(customization.photoStyle, 105, "transparent", false), border: "none" }}>
                <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          )}
          <h1 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, margin: 0, lineHeight: 1.2, letterSpacing: 0.5 }}>
            {personal.prenom}
          </h1>
          <h1 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 300, margin: "2px 0 0", letterSpacing: 0.5 }}>
            {personal.nom}
          </h1>
          <div style={{ width: 36, height: 2.5, background: sc, margin: "12px auto", borderRadius: 2 }} />
          <p style={{ fontSize: 10.5, color: sidebarTextLight, letterSpacing: 2, textTransform: "uppercase", fontWeight: 500 }}>{personal.poste}</p>
        </div>

        {/* Contact */}
        <div style={{ margin: "0 20px", padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14, color: sc }}>Contact</div>
          {personal.email && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ fontSize: 8, fontWeight: 700 }}>@</span>
              </div>
              <span style={{ fontSize: 9.5, color: sidebarTextLight, wordBreak: "break-all", lineHeight: 1.5 }}>{personal.email}</span>
            </div>
          )}
          {personal.telephone && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 8, fontWeight: 700 }}>T</span>
              </div>
              <span style={{ fontSize: 9.5, color: sidebarTextLight }}>{personal.telephone}</span>
            </div>
          )}
          {personal.ville && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 8, fontWeight: 700 }}>L</span>
              </div>
              <span style={{ fontSize: 9.5, color: sidebarTextLight }}>{personal.ville}</span>
            </div>
          )}
        </div>

        {/* Sidebar sections */}
        <div style={{ padding: "18px 20px 30px" }}>
          {leftSections.map(id => {
            if (id === "skills" && skills.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.5 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14, color: sc }}>Competences</div>
                {skills.map((s, i) => (
                  <div key={i} style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 10, marginBottom: 4, color: sidebarTextLight, fontWeight: 500 }}>{s}</div>
                    <div style={{ height: 3, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${70 + (i * 8) % 30}%`, backgroundColor: sc, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            );
            if (id === "languages" && langues.length > 0) return (
              <div key={id} style={{ marginBottom: density.margin * 2.5 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14, color: sc }}>Langues</div>
                {langues.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: "#fff" }}>{l.langue}</span>
                    <span style={{ fontSize: 8.5, color: sc, fontWeight: 600, background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 10 }}>{l.niveau}</span>
                  </div>
                ))}
              </div>
            );
            if (id === "interests" && formData.interests) return (
              <div key={id}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 14, color: sc }}>Interets</div>
                <p style={{ fontSize: 9.5, lineHeight: 1.7, color: sidebarTextMuted }}>{formData.interests}</p>
              </div>
            );
            return null;
          })}
        </div>
      </div>

      {/* ===== RIGHT CONTENT ===== */}
      <div style={{ padding: "38px 40px 30px 34px" }}>
        {rightSections.map(id => {
          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${pc}12`, border: `2px solid ${pc}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: pc }} />
                </div>
                <span style={{ fontFamily: displayFont, fontSize: 15, fontWeight: 700, color: "#1a1a1a", letterSpacing: 0.5 }}>Profil</span>
              </div>
              <p style={{ fontSize: 10.5, lineHeight: 1.75, color: "#555", textAlign: "justify", paddingLeft: 36 }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 2.2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${pc}12`, border: `2px solid ${pc}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: pc }} />
                </div>
                <span style={{ fontFamily: displayFont, fontSize: 15, fontWeight: 700, color: "#1a1a1a", letterSpacing: 0.5 }}>Experiences</span>
              </div>
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin * 1.5, paddingLeft: 36, position: "relative" }}>
                  {/* Timeline line */}
                  {i < experiences.length - 1 && (
                    <div style={{ position: "absolute", left: 12, top: 8, bottom: -density.margin * 1.5, width: 1.5, background: `${pc}20` }} />
                  )}
                  {/* Timeline dot */}
                  <div style={{ position: "absolute", left: 8, top: 4, width: 10, height: 10, borderRadius: "50%", background: "#fff", border: `2.5px solid ${pc}` }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.25 }}>{exp.poste}</div>
                      <div style={{ fontSize: 10.5, color: pc, fontWeight: 600, marginTop: 2 }}>{exp.entreprise}</div>
                    </div>
                    <span style={{ fontSize: 8.5, color: "#888", background: "#f0f0f0", padding: "3px 10px", borderRadius: 10, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {exp.dateDebut} — {exp.dateFin}
                    </span>
                  </div>
                  <p style={{ fontSize: 10, lineHeight: 1.7, color: "#666", marginTop: 6, textAlign: "justify" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${pc}12`, border: `2px solid ${pc}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: pc }} />
                </div>
                <span style={{ fontFamily: displayFont, fontSize: 15, fontWeight: 700, color: "#1a1a1a", letterSpacing: 0.5 }}>Formation</span>
              </div>
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: 14, paddingLeft: 36, position: "relative" }}>
                  <div style={{ position: "absolute", left: 8, top: 4, width: 10, height: 10, borderRadius: "50%", background: "#fff", border: `2.5px solid ${sc}` }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{f.diplome}</div>
                      <div style={{ fontSize: 10.5, color: "#666", marginTop: 1 }}>{f.ecole}</div>
                      {f.mention && <div style={{ fontSize: 9, color: pc, fontWeight: 500, marginTop: 2 }}>{f.mention}</div>}
                    </div>
                    <span style={{ fontSize: 9, color: pc, fontWeight: 700 }}>{f.annee}</span>
                  </div>
                </div>
              ))}
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
};

export default CVCreative;
