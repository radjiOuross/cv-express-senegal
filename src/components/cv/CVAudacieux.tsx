import { FormData, AIData } from "@/types/cv";

interface Props {
  formData: FormData;
  aiData: AIData | null;
}

const levelToPercent = (niveau: string) => {
  const map: Record<string, number> = { "Débutant": 20, "Intermédiaire": 40, "Avancé": 60, "Courant": 80, "Natif": 100 };
  return map[niveau] || 50;
};

const CircleProgress = ({ percent, label }: { percent: number; label: string }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 10 }}>
      <svg width={44} height={44} viewBox="0 0 44 44">
        <circle cx={22} cy={22} r={r} fill="none" stroke="#2a2a4a" strokeWidth={3} />
        <circle cx={22} cy={22} r={r} fill="none" stroke="#e94560" strokeWidth={3}
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 22 22)" strokeLinecap="round" />
        <text x={22} y={22} textAnchor="middle" dominantBaseline="central" fill="#e94560" fontSize={9} fontWeight={700}>
          {percent}%
        </text>
      </svg>
      <span style={{ fontSize: 9, color: "#ccc", marginTop: 2 }}>{label}</span>
    </div>
  );
};

const CVAudacieux = ({ formData, aiData }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const red = "#e94560";

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, backgroundColor: "#1a1a2e" }}>
      {/* Sidebar */}
      <div style={{ width: 260, backgroundColor: "#16213e", padding: "36px 22px", flexShrink: 0 }}>
        {personal.photo && (
          <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto 16px", border: `3px solid ${red}` }}>
            <img src={personal.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 4 }}>
          {personal.prenom}<br />{personal.nom}
        </h1>
        <p style={{ textAlign: "center", fontSize: 11, textTransform: "uppercase", color: red, letterSpacing: 2, marginBottom: 24 }}>
          {personal.poste}
        </p>

        {/* Contact */}
        <div style={{ marginBottom: 28 }}>
          {[personal.email, personal.telephone, personal.ville].filter(Boolean).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>
                {["✉", "📞", "📍"][i]}
              </div>
              <span style={{ fontSize: 10, color: "#ccc" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", color: red, letterSpacing: 2, marginBottom: 12 }}>Compétences</h3>
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: "#ddd", marginBottom: 3 }}>{s}</div>
                <div style={{ height: 4, backgroundColor: "#2a2a4a", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${65 + (i * 7) % 35}%`, backgroundColor: red, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {langues.length > 0 && (
          <div>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", color: red, letterSpacing: 2, marginBottom: 12 }}>Langues</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {langues.map((l, i) => (
                <CircleProgress key={i} percent={levelToPercent(l.niveau)} label={l.langue} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "36px 32px", color: "#eee" }}>
        {summary && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 12, textTransform: "uppercase", color: red, letterSpacing: 2, marginBottom: 8, paddingLeft: 12, borderLeft: `3px solid ${red}` }}>Profil</h2>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: "#bbb" }}>{summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 12, textTransform: "uppercase", color: red, letterSpacing: 2, marginBottom: 12, paddingLeft: 12, borderLeft: `3px solid ${red}` }}>Expériences</h2>
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{exp.poste}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{exp.entreprise}</div>
                <span style={{ display: "inline-block", fontSize: 9, color: "#fff", backgroundColor: red, borderRadius: 4, padding: "2px 8px", marginTop: 2, marginBottom: 4 }}>
                  {exp.dateDebut} — {exp.dateFin}
                </span>
                <p style={{ fontSize: 10, lineHeight: 1.5, color: "#aaa" }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {formation.length > 0 && (
          <div>
            <h2 style={{ fontSize: 12, textTransform: "uppercase", color: red, letterSpacing: 2, marginBottom: 12, paddingLeft: 12, borderLeft: `3px solid ${red}` }}>Formation</h2>
            {formation.map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{f.diplome}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{f.ecole}</div>
                <span style={{ display: "inline-block", fontSize: 9, color: "#fff", backgroundColor: red, borderRadius: 4, padding: "2px 8px", marginTop: 2 }}>
                  {f.annee}{f.mention ? ` — ${f.mention}` : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CVAudacieux;
