import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText, Sparkles, Layout, Download, Check, User, LayoutDashboard,
  Mic, Globe, Search, Shield, Mail, Palette, ArrowRight, Star
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import cvMockup1 from "@/assets/cv-mockup-1.png";
import cvMockup2 from "@/assets/cv-mockup-2.png";
import cvMockup3 from "@/assets/cv-mockup-3.png";

const steps = [
  { icon: FileText, label: "Remplis", desc: "Tes infos ou dicte-les par voix" },
  { icon: Sparkles, label: "IA optimise", desc: "Contenu amélioré automatiquement" },
  { icon: Layout, label: "Choisis", desc: "Parmi 7 templates pros" },
  { icon: Download, label: "Télécharge", desc: "Ton CV en PDF prêt à l'emploi" },
];

const features = [
  {
    icon: Mic,
    title: "Remplissage vocal",
    desc: "Dicte tes informations, l'IA remplit le formulaire automatiquement. Fonctionne sur tous les navigateurs.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Globe,
    title: "Traduction instantanée",
    desc: "Traduis ton CV en anglais, arabe ou wolof en un clic grâce à l'IA.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Search,
    title: "Analyse d'offres d'emploi",
    desc: "Colle une offre d'emploi et obtiens un résumé intelligent + un score de compatibilité avec ton CV.",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: Mail,
    title: "Lettre de motivation IA",
    desc: "Génère une lettre de motivation personnalisée à partir de ton CV en quelques secondes.",
    color: "bg-purple-500/10 text-purple-400",
  },
  {
    icon: Shield,
    title: "Certification des compétences",
    desc: "Fais valider tes compétences par des professionnels via un système de certification tiers.",
    color: "bg-orange-500/10 text-orange-400",
  },
  {
    icon: Palette,
    title: "7 templates professionnels",
    desc: "Classique, Moderne, Minimaliste, Élégant, Audacieux, Nature et Corporate.",
    color: "bg-pink-500/10 text-pink-400",
  },
];

const testimonials = [
  { name: "Amadou D.", role: "Développeur Web", text: "J'ai créé mon CV en 3 minutes. L'optimisation IA a complètement transformé mes descriptions." },
  { name: "Fatou S.", role: "Comptable", text: "La traduction en anglais m'a permis de postuler à des offres internationales facilement." },
  { name: "Moussa N.", role: "Chef de projet", text: "L'analyse d'offre d'emploi m'aide à adapter mon CV à chaque candidature." },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <span className="text-2xl font-bold text-primary tracking-tight">CVExpress</span>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/analyser")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Analyser une offre
          </button>
          {user ? (
            <button onClick={() => navigate("/dashboard")} className="btn-primary-sm flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Mon espace
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/connexion")} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <User className="w-4 h-4" /> Connexion
              </button>
              <button onClick={() => navigate("/creer")} className="btn-primary-sm">
                Commencer
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-16 pb-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" /> Propulsé par l'Intelligence Artificielle
            </div>
            <h1 className="font-display text-4xl md:text-[56px] leading-tight font-bold text-foreground mb-6">
              Crée ton CV professionnel en <span className="text-primary">2 minutes</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Dicte, écris ou remplis — l'IA transforme tes informations en CV parfait. 
              7 templates, traduction multilingue, lettre de motivation. Conçu au Sénégal 🇸🇳
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate("/creer")} className="btn-primary text-lg flex items-center justify-center gap-2">
                Créer mon CV <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate("/analyser")} className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-card transition-all flex items-center justify-center gap-2">
                <Search className="w-5 h-5" /> Analyser une offre
              </button>
            </div>
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
          <h2 className="section-title text-center mb-4">Comment ça marche ?</h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">4 étapes simples pour un CV professionnel optimisé par l'IA</p>
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
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7 text-primary" />
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-12 top-1/2 w-8 h-0.5 bg-border" />
                  )}
                </div>
                <div className="text-sm font-semibold text-primary mb-1">Étape {i + 1}</div>
                <div className="font-semibold text-foreground text-lg">{step.label}</div>
                <div className="text-sm text-muted-foreground mt-1">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-4">Tout ce dont tu as besoin</h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Des outils puissants pour créer le CV parfait et décrocher ton emploi
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card hover:border-primary/20 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 py-20 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-center mb-4">Ils nous font confiance</h2>
          <p className="text-muted-foreground text-center mb-16">Des centaines de CV créés chaque semaine</p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-secondary-foreground text-sm mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-4">Tarifs simples</h2>
          <p className="text-muted-foreground text-center mb-16">Pas d'abonnement caché. Paye ce que tu utilises.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card text-center"
            >
              <div className="text-3xl font-bold text-foreground mb-2">2 000 FCFA</div>
              <div className="text-muted-foreground mb-6">CV unique</div>
              <ul className="space-y-3 text-left mb-8">
                {["1 CV professionnel", "7 templates au choix", "Optimisation IA", "Téléchargement PDF", "Remplissage vocal"].map((f) => (
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
                {[
                  "CV illimités", "Tous les templates", "Optimisation IA avancée",
                  "Traduction multilingue", "Lettre de motivation IA",
                  "Analyse d'offres d'emploi", "Certification compétences", "Dashboard personnel"
                ].map((f) => (
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

      {/* CTA */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card border-primary/20 py-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Prêt à décrocher ton emploi ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Rejoins des centaines de professionnels sénégalais qui ont déjà créé leur CV avec CVExpress.
            </p>
            <button onClick={() => navigate("/creer")} className="btn-primary text-lg flex items-center gap-2 mx-auto">
              Créer mon CV maintenant <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
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
