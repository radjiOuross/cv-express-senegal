import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, Sparkles, Layout, Download, Check } from "lucide-react";
import cvMockup1 from "@/assets/cv-mockup-1.png";
import cvMockup2 from "@/assets/cv-mockup-2.png";
import cvMockup3 from "@/assets/cv-mockup-3.png";

const steps = [
  { icon: FileText, label: "Remplis", desc: "Tes informations" },
  { icon: Sparkles, label: "IA optimise", desc: "Contenu amélioré" },
  { icon: Layout, label: "Choisis", desc: "Ton template" },
  { icon: Download, label: "Télécharge", desc: "Ton CV en PDF" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-2xl font-bold text-primary tracking-tight">CVExpress</span>
        <button onClick={() => navigate("/creer")} className="btn-primary-sm">
          Commencer
        </button>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-12 pb-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-[56px] leading-tight font-bold text-foreground mb-6">
              Crée ton CV professionnel en 2 minutes
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              L'IA transforme tes informations en CV parfait. Conçu pour les chercheurs d'emploi au Sénégal.
            </p>
            <button onClick={() => navigate("/creer")} className="btn-primary text-lg">
              Créer mon CV — 2 000 FCFA
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-end gap-4"
          >
            <motion.img
              src={cvMockup1}
              alt="CV Classique"
              className="w-40 md:w-48 rounded-lg shadow-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src={cvMockup2}
              alt="CV Moderne"
              className="w-44 md:w-52 rounded-lg shadow-2xl -mt-6"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.img
              src={cvMockup3}
              alt="CV Minimaliste"
              className="w-40 md:w-48 rounded-lg shadow-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 py-20 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-center mb-16">Comment ça marche ?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-sm font-semibold text-primary mb-1">Étape {i + 1}</div>
                <div className="font-semibold text-foreground text-lg">{step.label}</div>
                <div className="text-sm text-muted-foreground mt-1">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-16">Tarifs simples</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card text-center"
            >
              <div className="text-3xl font-bold text-foreground mb-2">2 000 FCFA</div>
              <div className="text-muted-foreground mb-6">CV unique</div>
              <ul className="space-y-3 text-left mb-8">
                {["1 CV professionnel", "3 templates au choix", "Optimisation IA", "Téléchargement PDF"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-secondary-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/creer")} className="btn-primary w-full">
                Commencer
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card text-center border-primary/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAIRE
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">3 000 FCFA<span className="text-lg font-normal text-muted-foreground">/mois</span></div>
              <div className="text-muted-foreground mb-6">Illimité</div>
              <ul className="space-y-3 text-left mb-8">
                {["CV illimités", "Tous les templates", "Optimisation IA avancée", "Mises à jour illimitées", "Support prioritaire"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-secondary-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/creer")} className="btn-primary w-full">
                S'abonner
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-border text-center">
        <p className="text-muted-foreground text-sm">
          Made in Dakar, Sénégal 🇸🇳 — © {new Date().getFullYear()} CVExpress
        </p>
      </footer>
    </motion.div>
  );
};

export default Index;
