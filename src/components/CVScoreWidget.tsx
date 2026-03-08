import { motion, useSpring, useTransform } from "framer-motion";
import { FormData } from "@/types/cv";
import { useMemo } from "react";

interface Props {
  form: FormData;
}

const tips: { check: (f: FormData) => boolean; tip: string; points: number }[] = [
  { check: (f) => !!(f.personal.prenom && f.personal.nom), tip: "Ajoute ton prénom et nom", points: 10 },
  { check: (f) => !!f.personal.poste, tip: "Précise le poste recherché", points: 10 },
  { check: (f) => !!(f.personal.email && f.personal.telephone), tip: "Ajoute ton email et téléphone", points: 10 },
  { check: (f) => !!f.personal.photo, tip: "Ajoute une photo professionnelle", points: 5 },
  { check: (f) => f.diplomas.some((d) => d.diplome), tip: "Ajoute au moins une formation", points: 10 },
  { check: (f) => f.noExperience || f.experiences.some((e) => e.poste), tip: "Ajoute une expérience professionnelle", points: 15 },
  { check: (f) => f.experiences.some((e) => e.description.length > 50), tip: "Décris tes expériences en détail (+50 caractères)", points: 10 },
  { check: (f) => f.skills.length >= 5, tip: "Ajoute au moins 5 compétences", points: 10 },
  { check: (f) => f.languages.length >= 2, tip: "Ajoute au moins 2 langues", points: 10 },
  { check: (f) => !!f.interests, tip: "Ajoute tes centres d'intérêt", points: 5 },
  { check: (f) => !!(f.personal as any).linkedin, tip: "Ajoute ton profil LinkedIn", points: 5 },
];

const CVScoreWidget = ({ form }: Props) => {
  const { score, weakestTip } = useMemo(() => {
    let s = 0;
    let weakest = "";
    for (const t of tips) {
      if (t.check(form)) {
        s += t.points;
      } else if (!weakest) {
        weakest = t.tip;
      }
    }
    return { score: s, weakestTip: weakest };
  }, [form]);

  const springScore = useSpring(score, { stiffness: 100, damping: 20 });
  const display = useTransform(springScore, (v) => Math.round(v));

  const color = score <= 40 ? "hsl(0, 84%, 60%)" : score <= 70 ? "hsl(30, 90%, 55%)" : "hsl(149, 100%, 33%)";
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center bg-card border border-border rounded-2xl p-4 shadow-xl w-[140px]"
    >
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <motion.circle
            cx="48" cy="48" r="40" fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span className="text-xl font-bold" style={{ color }}>
            {display}
          </motion.span>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground mt-1 font-medium">Score CV</span>
      {weakestTip && (
        <p className="text-[10px] text-center text-muted-foreground mt-2 leading-tight">
          💡 {weakestTip}
        </p>
      )}
    </motion.div>
  );
};

export default CVScoreWidget;
