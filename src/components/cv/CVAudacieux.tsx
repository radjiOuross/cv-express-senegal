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

const CircleProgress = ({ percent, label, color }: { percent: number; label: string; color: string }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 10 }}>
      <svg width={44} height={44} viewBox="0 0 44 44">
        <circle cx={22} cy={22} r={r} fill="none" stroke="#2a2a4a" strokeWidth={3} />
        <circle cx={22} cy={22} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 22 22)" strokeLinecap="round" />
        <text x={22} y={22} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={9} fontWeight={700}>
          {percent}%
        </text>
      </svg>
      <span style={{ fontSize: 9, color: "#ccc", marginTop: 2 }}>{label}</span>
    </div>
  );
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

  const darken = (hex: string) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - 40);
    const g = Math.max(0, ((num >> 8) & 0xFF) - 40);
    const b = Math.max(0, (num & 0xFF) - 40);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
  };

  const bg1 = darken(darken(pc));
  const bg2 = darken(pc);

  const sidebarSections = sections.filter(s => ["skills", "languages"].includes(s));
  const mainSections = sections.filter(s => ["summary", "experiences", "formation", "interests"].includes(s));

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: bodyFont, fontSize: 11, backgroundColor: bg1 }}>
      <div style={{ width: 260, backgroundColor: bg2, padding: `${density.padding * 2.2}px ${density.padding * 1.3}px`, flexShrink: 0 }}>
        {customization.photoStyle !== "none" && personal.photo && (
          <div style={{ ...getPhotoStyle(customization.photoStyle, 100, sc, customization.photoBorder), margin: "0 auto 16px" }}>
            <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 4 }}>
          {personal.prenom}<br />{personal.nom}
        </h1>
        <p style={{ textAlign: "center", fontSize: 11, textTransform: "uppercase", color: sc, letterSpacing: 2, marginBottom: 24 }}>{personal.poste}</p>

        <div style={{ marginBottom: 28 }}>
          {[personal.email, personal.telephone, personal.ville].filter(Boolean).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: sc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>
                {["✉", "📞", "📍"][i]}
              </div>
              <span style={{ fontSize: 10, color: "#ccc" }}>{item}</span>
            </div>
          ))}
        </div>

        {sidebarSections.map(id => {
          if (id === "skills" && skills.length > 0) return (
            <div key={id} style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: sc, letterSpacing: 2, marginBottom: 12 }}>Compétences</h3>
              <div style={{ color: "#ddd" }}>{renderSkills(skills, customization.skillStyle, sc)}</div>
            </div>
          );
          if (id === "languages" && langues.length > 0) return (
            <div key={id}>
              <h3 style={{ fontSize: 10, textTransform: "uppercase", color: sc, letterSpacing: 2, marginBottom: 12 }}>Langues</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {langues.map((l, i) => <CircleProgress key={i} percent={levelToPercent(l.niveau)} label={l.langue} color={sc} />)}
              </div>
            </div>
          );
          return null;
        })}
      </div>

      <div style={{ flex: 1, padding: `${density.padding * 2.2}px ${density.padding * 2}px`, color: "#eee" }}>
        {mainSections.map(id => {
          const sectionH = (t: string) => <h2 style={{ fontSize: 12, textTransform: "uppercase", color: sc, letterSpacing: 2, marginBottom: 8, paddingLeft: 12, borderLeft: `3px solid ${sc}` }}>{t}</h2>;
          if (id === "summary" && summary) return (
            <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
              {sectionH("Profil")}
              <p style={{ fontSize: 11, lineHeight: density.lineHeight, color: "#bbb" }}>{summary}</p>
            </div>
          );
          if (id === "experiences" && experiences.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
              {sectionH("Expériences")}
              {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: density.margin }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{exp.poste}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{exp.entreprise}</div>
                  <span style={{ display: "inline-block", fontSize: 9, color: "#fff", backgroundColor: sc, borderRadius: 4, padding: "2px 8px", marginTop: 2, marginBottom: 4 }}>
                    {exp.dateDebut} — {exp.dateFin}
                  </span>
                  <p style={{ fontSize: 10, lineHeight: density.lineHeight, color: "#aaa" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          );
          if (id === "formation" && formation.length > 0) return (
            <div key={id} style={{ marginBottom: density.margin * 1.7 }}>
              {sectionH("Formation")}
              {formation.map((f, i) => (
                <div key={i} style={{ marginBottom: density.margin }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{f.diplome}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{f.ecole}</div>
                  <span style={{ display: "inline-block", fontSize: 9, color: "#fff", backgroundColor: sc, borderRadius: 4, padding: "2px 8px", marginTop: 2 }}>
                    {f.annee}{f.mention ? ` — ${f.mention}` : ""}
                  </span>
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

export default CVAudacieux;
