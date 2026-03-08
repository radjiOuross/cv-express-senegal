import { Diploma } from "@/types/cv";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface Props {
  diplomas: Diploma[];
  onChange: (diplomas: Diploma[]) => void;
}

const StepEducation = ({ diplomas, onChange }: Props) => {
  const add = () =>
    onChange([...diplomas, { id: crypto.randomUUID(), diplome: "", ecole: "", annee: "", mention: "" }]);

  const remove = (id: string) => onChange(diplomas.filter((d) => d.id !== id));

  const update = (id: string, key: keyof Diploma, value: string) =>
    onChange(diplomas.map((d) => (d.id === id ? { ...d, [key]: value } : d)));

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        <GraduationCap className="w-6 h-6 inline mr-2" />Formation
      </h2>
      <p className="text-muted-foreground mb-8">Ajoute tes diplômes et formations.</p>

      <div className="space-y-6">
        {diplomas.map((d, i) => (
          <div key={d.id} className="glass-card relative">
            {diplomas.length > 1 && (
              <button onClick={() => remove(d.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="text-sm text-primary font-medium mb-4">Diplôme {i + 1}</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Diplôme</label>
                <input className="form-input" placeholder="Master en Informatique" value={d.diplome} onChange={(e) => update(d.id, "diplome", e.target.value)} />
              </div>
              <div>
                <label className="form-label">École / Université</label>
                <input className="form-input" placeholder="Université Cheikh Anta Diop" value={d.ecole} onChange={(e) => update(d.id, "ecole", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Année</label>
                <input className="form-input" placeholder="2023" value={d.annee} onChange={(e) => update(d.id, "annee", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Mention</label>
                <input className="form-input" placeholder="Bien" value={d.mention} onChange={(e) => update(d.id, "mention", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={add} className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline">
        <Plus className="w-4 h-4" /> Ajouter un diplôme
      </button>
    </div>
  );
};

export default StepEducation;
