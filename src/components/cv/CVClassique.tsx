import { FormData, AIData } from "@/types/cv";
import { Mail, Phone, MapPin } from "lucide-react";

interface Props {
  formData: FormData;
  aiData: AIData | null;
}

const CVClassique = ({ formData, aiData }: Props) => {
  const { personal } = formData;
  const experiences = aiData?.experiences_optimisees || formData.experiences;
  const skills = aiData?.competences || formData.skills;
  const formation = aiData?.formation || formData.diplomas;
  const langues = aiData?.langues || formData.languages;
  const summary = aiData?.summary || "";

  const levelToWidth = (niveau: string) => {
    const map: Record<string, number> = { "Débutant": 20, "Intermédiaire": 40, "Avancé": 60, "Courant": 80, "Natif": 100 };
    return map[niveau] || 50;
  };

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: "Inter, sans-serif", fontSize: 11 }}>
      {/* Sidebar */}
      <div style={{ width: 280, backgroundColor: "#1B3A6B", color: "white", padding: "40px 24px", flexShrink: 0 }}>
        {personal.photo && (
          <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", margin: "0 auto 20px", border: "3px solid #E8B84B" }}>
            <img src={personal.photo} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#E8B84B", textAlign: "center", marginBottom: 4 }}>
          {personal.prenom} {personal.nom}
        </h1>
        <p style={{ textAlign: "center", fontSize: 12, color: "#E8B84B", opacity: 0.8, marginBottom: 30 }}>
          {personal.poste}
        </p>

        {/* Contact */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, color: "#E8B84B" }}>Contact</h3>
          {personal.email && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 10 }}>✉ {personal.email}</div>}
          {personal.telephone && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 10 }}>📞 {personal.telephone}</div>}
          {personal.ville && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 10 }}>📍 {personal.ville}</div>}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, color: "#E8B84B" }}>Compétences</h3>
            {skills.map((skill, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, marginBottom: 4 }}>{skill}</div>
                <div style={{ height: 4, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${70 + (i * 5) % 30}%`, backgroundColor: "#E8B84B", borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {langues.length > 0 && (
          <div>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, color: "#E8B84B" }}>Langues</h3>
            {langues.map((l, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, marginBottom: 4 }}>{l.langue}</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div key={dot} style={{
                      width: 8, height: 8, borderRadius: "50%",
                      backgroundColor: dot <= Math.ceil(levelToWidth(l.niveau) / 20) ? "#E8B84B" : "rgba(255,255,255,0.2)"
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "40px 32px", backgroundColor: "white", color: "#1a1a1a" }}>
        {summary && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#1B3A6B", letterSpacing: 2, marginBottom: 8, borderBottom: "2px solid #1B3A6B", paddingBottom: 4 }}>Profil</h2>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: "#444" }}>{summary}</p>
          </div>
        )}

        {/* Experiences */}
        {experiences.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#1B3A6B", letterSpacing: 2, marginBottom: 12, borderBottom: "2px solid #1B3A6B", paddingBottom: 4 }}>Expériences</h2>
            {experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: "2px solid #1B3A6B" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1B3A6B" }}>{exp.poste}</div>
                <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
                  {exp.entreprise} • {exp.dateDebut} — {exp.dateFin}
                </div>
                <p style={{ fontSize: 10, lineHeight: 1.5, color: "#444" }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Formation */}
        {formation.length > 0 && (
          <div>
            <h2 style={{ fontSize: 11, textTransform: "uppercase", color: "#1B3A6B", letterSpacing: 2, marginBottom: 12, borderBottom: "2px solid #1B3A6B", paddingBottom: 4 }}>Formation</h2>
            {formation.map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{f.diplome}</div>
                <div style={{ fontSize: 10, color: "#666" }}>{f.ecole} • {f.annee}{f.mention ? ` • ${f.mention}` : ""}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CVClassique;
