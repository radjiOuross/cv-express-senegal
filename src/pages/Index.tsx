import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText, Sparkles, Layout, Download, Check, User, LayoutDashboard,
  Mic, Globe, Search, Shield, Mail, Palette, ArrowRight, Star,
  SlidersHorizontal, Lock, Upload, Video, Zap, ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import cvMockup1 from "@/assets/cv-mockup-1.png";
import cvMockup2 from "@/assets/cv-mockup-2.png";
import cvMockup3 from "@/assets/cv-mockup-3.png";

const steps = [
  { icon: FileText, label: "Remplis tes infos", desc: "Saisis ou dicte tes informations professionnelles" },
  { icon: Sparkles, label: "L'IA optimise", desc: "Ton contenu est reformulé et enrichi automatiquement" },
  { icon: Layout, label: "Choisis ton design", desc: "Sélectionne parmi des templates professionnels" },
  { icon: Download, label: "Télécharge ton CV", desc: "Export PDF haute qualité, prêt à envoyer" },
];

const features = [
  {
    icon: Mic,
    title: "Saisie vocale intelligente",
    desc: "Dicte tes informations naturellement. L'IA structure et remplit le formulaire automatiquement.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Palette,
    title: "Personnalisation avancée",
    desc: "Couleurs, typographies, disposition des sections, densité et styles de compétences ajustables.",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Globe,
    title: "Traduction instantanée",
    desc: "Traduis ton CV en anglais, arabe ou wolof. L'IA adapte le contenu culturellement.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Search,
    title: "Analyse d'offres d'emploi",
    desc: "Score de compatibilité et recommandations personnalisées pour chaque offre.",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Mail,
    title: "Lettre de motivation IA",
    desc: "Génération automatique d'une lettre professionnelle adaptée à ton profil.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Video,
    title: "CV Vidéo avec téléprompteur",
    desc: "Script généré par l'IA, enregistrement guidé et publication sur ton profil.",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Shield,
    title: "Certification de compétences",
    desc: "Fais valider tes compétences par des professionnels reconnus.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: LayoutDashboard,
    title: "Espace personnel sécurisé",
    desc: "Connexion Google ou Apple. Gère, modifie et retrouve tous tes CV.",
    gradient: "from-accent/20 to-accent/5",
  },
];

const stats = [
  { value: "2 min", label: "Temps moyen de création" },
  { value: "4", label: "Templates professionnels" },
  { value: "3", label: "Langues disponibles" },
  { value: "100%", label: "Gratuit pour commencer" },
];

const testimonials = [
  { name: "Amadou D.", role: "Développeur Web — Dakar", text: "L'optimisation IA a transformé mes descriptions d'expérience. Le résultat est bien plus professionnel que ce que j'aurais pu rédiger seul." },
  { name: "Fatou S.", role: "Comptable — Thiès", text: "La traduction en anglais m'a permis de postuler à des offres internationales. Le processus est fluide et rapide." },
  { name: "Moussa N.", role: "Chef de projet — Dakar", text: "L'analyse d'offre d'emploi m'aide à adapter mon CV à chaque candidature. Un outil indispensable." },
  { name: "Aïssatou B.", role: "Designer UX — Saint-Louis", text: "Le remplissage vocal fonctionne parfaitement. Plus besoin de taper, je dicte et tout se remplit." },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

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
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <span className="text-2xl font-display font-bold text-foreground tracking-tight">
          CV<span className="text-primary">Express</span>
        </span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/importer")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:flex items-center gap-1.5">
            <Upload className="w-4 h-4" /> Importer
          </button>
          <button onClick={() => navigate("/analyser")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Analyser une offre
          </button>
          {user ? (
            <button onClick={() => navigate("/dashboard")} className="btn-primary-sm flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Mon espace
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/connexion")} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
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
      <section className="relative px-6 md:px-12 pt-20 pb-28 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-3.5 h-3.5" /> Propulsé par l'Intelligence Artificielle
            </div>
            <h1 className="font-display text-4xl md:text-[56px] leading-[1.1] font-bold text-foreground mb-6">
              Ton CV professionnel,{" "}
              <span className="text-primary">créé en 2 minutes</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Saisis tes informations ou dicte-les par voix. L'IA optimise, met en forme
              et génère un CV prêt à impressionner les recruteurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={() => navigate("/creer")} className="btn-primary text-lg flex items-center justify-center gap-2 group">
                Créer mon CV <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate("/video-cv/script")} className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-card hover:border-primary/30 transition-all flex items-center justify-center gap-2">
                <Video className="w-5 h-5 text-primary" /> CV Vidéo
              </button>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Gratuit</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Sans inscription</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> PDF en 2 min</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center items-end gap-4"
          >
            <motion.img src={cvMockup1} alt="CV template classique" className="w-36 md:w-44 rounded-lg shadow-2xl shadow-black/40"
              animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src={cvMockup2} alt="CV template moderne" className="w-40 md:w-52 rounded-lg shadow-2xl shadow-black/40 -mt-4"
              animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} />
            <motion.img src={cvMockup3} alt="CV template minimaliste" className="w-36 md:w-44 rounded-lg shadow-2xl shadow-black/40"
              animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} />
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">Comment ça marche</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Quatre étapes simples pour obtenir un CV professionnel optimisé par l'IA
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {steps.map((step, i) => (
              <motion.div key={step.label} {...fadeUp} transition={{ delay: i * 0.12 }} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto mb-5 border border-primary/10">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-border to-transparent" />
                )}
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Étape {i + 1}</div>
                <div className="font-semibold text-foreground mb-1">{step.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 md:px-12 py-24 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">Fonctionnalités complètes</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Tous les outils pour créer, optimiser et partager un CV qui fait la différence
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
                className="group bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/25 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 border border-border/40`}>
                  <f.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Import CV Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6">
                <Upload className="w-3.5 h-3.5" /> Import intelligent
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6 leading-tight">
                Tu as déjà un CV ?<br />
                <span className="text-primary">Améliore-le avec l'IA</span>
              </h2>
              <p className="text-muted-foreground text-base mb-8 max-w-lg leading-relaxed">
                Importe ton CV existant en PDF, Word ou image. L'IA l'analyse en profondeur,
                évalue sa qualité et te donne des recommandations concrètes pour le rendre
                irrésistible aux recruteurs.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Upload, title: "Upload multi-format", desc: "PDF, Word ou photo — l'IA lit tout" },
                  { icon: Sparkles, title: "Score de qualité instantané", desc: "Points forts et axes d'amélioration identifiés" },
                  { icon: ArrowRight, title: "Régénération en un clic", desc: "Applique les améliorations et génère un CV optimisé" },
                ].map((item, i) => (
                  <motion.div key={item.title} {...fadeUp} transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => navigate("/importer")} className="btn-primary flex items-center gap-2 group">
                Importer mon CV <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="relative">
              <div className="bg-card rounded-2xl border border-border/60 p-8 shadow-xl shadow-black/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Analyse IA</h4>
                    <p className="text-xs text-muted-foreground">Score de qualité</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-3xl font-display font-bold text-primary">72<span className="text-lg">%</span></span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-6">
                  {[
                    { status: "success", label: "Expériences bien détaillées", border: "border-l-primary" },
                    { status: "warning", label: "Ajoute un résumé professionnel", border: "border-l-accent" },
                    { status: "warning", label: "Manque de verbes d'action", border: "border-l-accent" },
                    { status: "error", label: "Section langues absente", border: "border-l-destructive" },
                  ].map((item, i) => (
                    <motion.div key={i} {...fadeUp} transition={{ delay: 0.4 + i * 0.08 }}
                      className={`bg-muted/40 rounded-lg p-3 border-l-[3px] ${item.border}`}
                    >
                      <span className="text-xs text-foreground">{item.label}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-primary/8 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-primary">3</p>
                    <p className="text-[10px] text-muted-foreground">Améliorations</p>
                  </div>
                  <div className="flex-1 bg-accent/8 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-accent">2</p>
                    <p className="text-[10px] text-muted-foreground">Manquants</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video CV Section */}
      <section className="px-6 md:px-12 py-24 bg-card/30">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6">
              <Video className="w-3.5 h-3.5" /> CV Vidéo
            </div>
            <h2 className="section-title mb-4">Démarque-toi avec un CV Vidéo</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              L'IA rédige ton script professionnel, le téléprompteur te guide pendant l'enregistrement,
              et ta vidéo est publiée directement sur ton profil en ligne.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Sparkles, title: "Script généré par l'IA", desc: "Un texte professionnel basé sur ton CV" },
                { icon: Video, title: "Téléprompteur intégré", desc: "Vitesse et taille de police ajustables" },
                { icon: Globe, title: "Publication instantanée", desc: "Partagé sur ton profil public" },
              ].map((item, i) => (
                <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border/60 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <button onClick={() => navigate("/video-cv/script")} className="btn-primary text-lg flex items-center gap-2 mx-auto group">
              Créer mon CV Vidéo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">Ils nous font confiance</h2>
            <p className="text-muted-foreground">Des centaines de CV créés chaque semaine au Sénégal</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/60 rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-secondary-foreground text-xs mb-5 leading-relaxed">"{t.text}"</p>
                <div className="border-t border-border/40 pt-4">
                  <p className="font-semibold text-foreground text-xs">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-12 py-24 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">Tarifs transparents</h2>
            <p className="text-muted-foreground">Pas d'abonnement caché. Paye uniquement ce que tu utilises.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}
              className="bg-card border border-border/60 rounded-2xl p-8 text-center hover:border-border transition-colors"
            >
              <div className="text-3xl font-display font-bold text-foreground mb-1">2 000 FCFA</div>
              <div className="text-sm text-muted-foreground mb-8">CV unique</div>
              <ul className="space-y-3 text-left mb-8">
                {["1 CV professionnel", "4 templates au choix", "Optimisation IA", "Personnalisation complète", "Saisie vocale", "Export PDF"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-secondary-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/creer")} className="w-full py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-all">
                Commencer
              </button>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }}
              className="bg-card border border-primary/30 rounded-2xl p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl">
                Populaire
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">
                3 000 FCFA<span className="text-base font-normal text-muted-foreground">/mois</span>
              </div>
              <div className="text-sm text-muted-foreground mb-8">Accès illimité</div>
              <ul className="space-y-3 text-left mb-8">
                {[
                  "CV illimités", "Tous les templates", "Personnalisation avancée", "Optimisation IA avancée",
                  "Traduction multilingue", "Lettre de motivation IA",
                  "Analyse d'offres", "CV Vidéo", "Dashboard personnel"
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-secondary-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/creer")} className="btn-primary w-full">S'abonner</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}
            className="bg-card border border-primary/15 rounded-2xl py-16 px-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <Zap className="w-10 h-10 text-primary mx-auto mb-5" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Prêt à décrocher ton emploi ?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Rejoins des centaines de professionnels sénégalais qui créent leur CV avec CVExpress.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => navigate("/creer")} className="btn-primary text-lg flex items-center gap-2 mx-auto sm:mx-0 group">
                  Créer mon CV maintenant <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                {!user && (
                  <button onClick={() => navigate("/connexion")} className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-card transition-all flex items-center justify-center gap-2 mx-auto sm:mx-0">
                    <User className="w-5 h-5" /> Se connecter
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-border/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-display font-semibold text-foreground">
            CV<span className="text-primary">Express</span>
          </span>
          <p className="text-muted-foreground text-xs">
            Conçu à Dakar, Sénégal — © {new Date().getFullYear()} CVExpress. Tous droits réservés.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Index;
