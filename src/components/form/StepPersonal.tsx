import { PersonalInfo, SENEGAL_CITIES } from "@/types/cv";
import { User, Mail, Phone, MapPin, Briefcase, Camera } from "lucide-react";
import { useRef } from "react";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const StepPersonal = ({ data, onChange }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof PersonalInfo, value: string) => onChange({ ...data, [key]: value });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...data, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">Informations personnelles</h2>
      <p className="text-muted-foreground mb-8">Commence par tes coordonnées de base.</p>

      {/* Photo */}
      <div className="flex items-center gap-4 mb-8">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center cursor-pointer overflow-hidden border-2 border-border hover:border-primary transition-colors"
        >
          {data.photo ? (
            <img src={data.photo} alt="Photo" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div>
          <button onClick={() => fileRef.current?.click()} className="text-sm text-primary font-medium">
            Ajouter une photo
          </button>
          <p className="text-xs text-muted-foreground">Optionnel · JPG ou PNG</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="form-label"><User className="w-3.5 h-3.5 inline mr-1.5" />Prénom</label>
          <input className="form-input" placeholder="Amadou" value={data.prenom} onChange={(e) => update("prenom", e.target.value)} />
        </div>
        <div>
          <label className="form-label">Nom</label>
          <input className="form-input" placeholder="Diallo" value={data.nom} onChange={(e) => update("nom", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="form-label"><Briefcase className="w-3.5 h-3.5 inline mr-1.5" />Poste recherché</label>
          <input className="form-input" placeholder="Développeur Web" value={data.poste} onChange={(e) => update("poste", e.target.value)} />
        </div>
        <div>
          <label className="form-label"><Mail className="w-3.5 h-3.5 inline mr-1.5" />Email</label>
          <input className="form-input" type="email" placeholder="amadou@email.com" value={data.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <label className="form-label"><Phone className="w-3.5 h-3.5 inline mr-1.5" />Téléphone</label>
          <input className="form-input" placeholder="+221 77 123 45 67" value={data.telephone} onChange={(e) => update("telephone", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="form-label"><MapPin className="w-3.5 h-3.5 inline mr-1.5" />Ville</label>
          <select className="form-input" value={data.ville} onChange={(e) => update("ville", e.target.value)}>
            <option value="">Sélectionner une ville</option>
            {SENEGAL_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StepPersonal;
