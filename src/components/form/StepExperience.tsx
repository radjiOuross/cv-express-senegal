import { Experience } from "@/types/cv";
import { Plus, Trash2, Building2 } from "lucide-react";

interface Props {
  experiences: Experience[];
  noExperience: boolean;
  onChange: (experiences: Experience[]) => void;
  onToggleNoExperience: (val: boolean) => void;
}

const StepExperience = ({ experiences, noExperience, onChange, onToggleNoExperience }: Props) => {
  const add = () =>
    onChange([...experiences, { id: crypto.randomUUID(), poste: "", entreprise: "", dateDebut: "", dateFin: "", description: "" }]);

  const remove = (id: string) => onChange(experiences.filter((e) => e.id !== id));

  const update = (id: string, key: keyof Experience, value: string) =>
    onChange(experiences.map((e) => (e.id === id ? { ...e, [key]: value } : e)));

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        <Building2 className="w-6 h-6 inline mr-2" />Expérience professionnelle
      </h2>
      <p className="text-muted-foreground mb-6">Décris tes expériences de travail.</p>

      <label className="flex items-center gap-3 mb-8 cursor-pointer">
        <input
          type="checkbox"
          checked={noExperience}
          onChange={(e) => onToggleNoExperience(e.target.checked)}
          className="w-4 h-4 rounded border-border accent-primary"
        />
        <span className="text-sm text-muted-foreground">Pas encore d'expérience professionnelle</span>
      </label>

      {!noExperience && (
        <>
          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <div key={exp.id} className="glass-card relative">
                {experiences.length > 1 && (
                  <button onClick={() => remove(exp.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="text-sm text-primary font-medium mb-4">Expérience {i + 1}</div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Poste</label>
                    <input className="form-input" placeholder="Chef de projet" value={exp.poste} onChange={(e) => update(exp.id, "poste", e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Entreprise</label>
                    <input className="form-input" placeholder="Sonatel" value={exp.entreprise} onChange={(e) => update(exp.id, "entreprise", e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Date début</label>
                    <input className="form-input" placeholder="Jan 2022" value={exp.dateDebut} onChange={(e) => update(exp.id, "dateDebut", e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Date fin</label>
                    <input className="form-input" placeholder="Présent" value={exp.dateFin} onChange={(e) => update(exp.id, "dateFin", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Description</label>
                    <textarea className="form-input min-h-[80px]" placeholder="Décris tes responsabilités..." value={exp.description} onChange={(e) => update(exp.id, "description", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={add} className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline">
            <Plus className="w-4 h-4" /> Ajouter une expérience
          </button>
        </>
      )}
    </div>
  );
};

export default StepExperience;
