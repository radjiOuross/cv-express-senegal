export interface PersonalInfo {
  prenom: string;
  nom: string;
  poste: string;
  email: string;
  telephone: string;
  ville: string;
  photo?: string;
}

export interface Diploma {
  id: string;
  diplome: string;
  ecole: string;
  annee: string;
  mention: string;
}

export interface Experience {
  id: string;
  poste: string;
  entreprise: string;
  dateDebut: string;
  dateFin: string;
  description: string;
}

export interface FormData {
  personal: PersonalInfo;
  diplomas: Diploma[];
  experiences: Experience[];
  noExperience: boolean;
  skills: string[];
  languages: { langue: string; niveau: string }[];
  interests: string;
}

export interface AIData {
  summary: string;
  experiences_optimisees: {
    poste: string;
    entreprise: string;
    dateDebut: string;
    dateFin: string;
    description: string;
  }[];
  competences: string[];
  formation: {
    diplome: string;
    ecole: string;
    annee: string;
    mention: string;
  }[];
  langues: { langue: string; niveau: string }[];
}

export type TemplateName = "classique" | "moderne" | "minimaliste";

export const SENEGAL_CITIES = [
  "Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor",
  "Tambacounda", "Kolda", "Matam", "Fatick", "Kaffrine",
  "Kédougou", "Sédhiou", "Diourbel", "Louga", "Rufisque",
  "Pikine", "Guédiawaye", "Mbour", "Richard-Toll", "Touba"
];

export const LANGUAGE_LEVELS = [
  "Débutant", "Intermédiaire", "Avancé", "Courant", "Natif"
];
