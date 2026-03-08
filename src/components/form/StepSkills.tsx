import { useState } from "react";
import { LANGUAGE_LEVELS } from "@/types/cv";
import { Plus, X, Zap, Globe, Heart } from "lucide-react";

interface Props {
  skills: string[];
  languages: { langue: string; niveau: string }[];
  interests: string;
  onSkillsChange: (skills: string[]) => void;
  onLanguagesChange: (languages: { langue: string; niveau: string }[]) => void;
  onInterestsChange: (interests: string) => void;
}

const StepSkills = ({ skills, languages, interests, onSkillsChange, onLanguagesChange, onInterestsChange }: Props) => {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onSkillsChange([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => onSkillsChange(skills.filter((s) => s !== skill));

  const addLanguage = () => onLanguagesChange([...languages, { langue: "", niveau: "Intermédiaire" }]);
  const removeLanguage = (i: number) => onLanguagesChange(languages.filter((_, idx) => idx !== i));
  const updateLanguage = (i: number, key: "langue" | "niveau", value: string) =>
    onLanguagesChange(languages.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)));

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        <Zap className="w-6 h-6 inline mr-2" />Compétences & Langues
      </h2>
      <p className="text-muted-foreground mb-8">La touche finale de ton CV.</p>

      {/* Skills */}
      <div className="mb-8">
        <label className="form-label">Compétences</label>
        <div className="flex gap-2 mb-3">
          <input
            className="form-input flex-1"
            placeholder="Ex: Microsoft Office, Gestion de projet..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          />
          <button onClick={addSkill} className="btn-primary-sm">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="tag-chip">
              {skill}
              <button onClick={() => removeSkill(skill)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="mb-8">
        <label className="form-label"><Globe className="w-3.5 h-3.5 inline mr-1.5" />Langues</label>
        <div className="space-y-3">
          {languages.map((lang, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                className="form-input flex-1"
                placeholder="Wolof, Anglais..."
                value={lang.langue}
                onChange={(e) => updateLanguage(i, "langue", e.target.value)}
              />
              <select
                className="form-input w-40"
                value={lang.niveau}
                onChange={(e) => updateLanguage(i, "niveau", e.target.value)}
              >
                {LANGUAGE_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {languages.length > 1 && (
                <button onClick={() => removeLanguage(i)} className="text-muted-foreground hover:text-destructive">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addLanguage} className="mt-3 flex items-center gap-2 text-primary font-medium hover:underline text-sm">
          <Plus className="w-4 h-4" /> Ajouter une langue
        </button>
      </div>

      {/* Interests */}
      <div>
        <label className="form-label"><Heart className="w-3.5 h-3.5 inline mr-1.5" />Centres d'intérêt</label>
        <input
          className="form-input"
          placeholder="Lecture, Football, Voyages..."
          value={interests}
          onChange={(e) => onInterestsChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default StepSkills;
