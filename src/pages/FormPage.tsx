import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadFormData, saveFormData } from "@/lib/storage";
import { FormData, Diploma, Experience } from "@/types/cv";
import StepPersonal from "@/components/form/StepPersonal";
import StepEducation from "@/components/form/StepEducation";
import StepExperience from "@/components/form/StepExperience";
import StepSkills from "@/components/form/StepSkills";
import { Check } from "lucide-react";

const STEP_LABELS = ["Infos personnelles", "Formation", "Expérience", "Compétences"];

const defaultForm: FormData = {
  personal: { prenom: "", nom: "", poste: "", email: "", telephone: "", ville: "", photo: undefined },
  diplomas: [{ id: crypto.randomUUID(), diplome: "", ecole: "", annee: "", mention: "" }],
  experiences: [{ id: crypto.randomUUID(), poste: "", entreprise: "", dateDebut: "", dateFin: "", description: "" }],
  noExperience: false,
  skills: [],
  languages: [{ langue: "Français", niveau: "Natif" }],
  interests: "",
};

const FormPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(() => {
    const saved = loadFormData();
    return { ...defaultForm, ...saved } as FormData;
  });

  useEffect(() => {
    saveFormData(form);
  }, [form]);

  const updatePersonal = (personal: FormData["personal"]) => setForm((f) => ({ ...f, personal }));
  const updateDiplomas = (diplomas: Diploma[]) => setForm((f) => ({ ...f, diplomas }));
  const updateExperiences = (experiences: Experience[]) => setForm((f) => ({ ...f, experiences }));
  const setNoExperience = (noExperience: boolean) => setForm((f) => ({ ...f, noExperience }));
  const updateSkills = (skills: string[]) => setForm((f) => ({ ...f, skills }));
  const updateLanguages = (languages: FormData["languages"]) => setForm((f) => ({ ...f, languages }));
  const updateInterests = (interests: string) => setForm((f) => ({ ...f, interests }));

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleGenerate = () => {
    saveFormData(form);
    navigate("/generation");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          CVExpress
        </span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-12">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={i < step ? "step-indicator-done" : i === step ? "step-indicator-active" : "step-indicator-inactive"}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs mt-2 hidden md:block ${i === step ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div className={`w-12 md:w-20 h-0.5 mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && <StepPersonal data={form.personal} onChange={updatePersonal} />}
            {step === 1 && <StepEducation diplomas={form.diplomas} onChange={updateDiplomas} />}
            {step === 2 && (
              <StepExperience
                experiences={form.experiences}
                noExperience={form.noExperience}
                onChange={updateExperiences}
                onToggleNoExperience={setNoExperience}
              />
            )}
            {step === 3 && (
              <StepSkills
                skills={form.skills}
                languages={form.languages}
                interests={form.interests}
                onSkillsChange={updateSkills}
                onLanguagesChange={updateLanguages}
                onInterestsChange={updateInterests}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-10">
          <button
            onClick={prev}
            disabled={step === 0}
            className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium disabled:opacity-30 transition-opacity"
          >
            Précédent
          </button>
          {step < 3 ? (
            <button onClick={next} className="btn-primary-sm">
              Suivant
            </button>
          ) : (
            <button onClick={handleGenerate} className="btn-primary">
              Générer mon CV avec l'IA 🤖
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FormPage;
