import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText, Sparkles, Layout, Download, Check, User, LayoutDashboard,
  Mic, Globe, Search, Shield, Mail, Palette, ArrowRight, Star,
  SlidersHorizontal, Type, Camera, Zap, Lock, Upload, RefreshCw, Target, TrendingUp, Video
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
    desc: "Dicte tes informations, l'IA remplit le formulaire automatiquement. Compatible tous navigateurs : Chrome, Safari, Firefox, Arc.",
    color: "bg-primary/10 text-primary",
    badge: "Universel",
  },
  {
    icon: Palette,
    title: "Personnalisation avancée",
    desc: "10 palettes de couleurs, 8 typographies, réorganisation des sections, densité ajustable, styles de photo et de compétences.",
    color: "bg-pink-500/10 text-pink-400",
    badge: "Nouveau",
  },
  {
    icon: Globe,
    title: "Traduction instantanée",
    desc: "Traduis ton CV en anglais, arabe ou wolof en un clic. L'IA adapte le contenu culturellement.",
    color: "bg-accent/10 text-accent",
    badge: null,
  },
  {
    icon: Search,
    title: "Analyse d'offres d'emploi",
    desc: "Colle une offre et obtiens un score de compatibilité avec ton CV + des conseils pour l'améliorer.",
    color: "bg-blue-500/10 text-blue-400",
    badge: null,
  },
  {
    icon: Mail,
    title: "Lettre de motivation IA",
    desc: "Génère une lettre de motivation personnalisée et professionnelle à partir de ton CV en secondes.",
    color: "bg-purple-500/10 text-purple-400",
    badge: null,
  },
  {
    icon: Shield,
    title: "Certification compétences",
    desc: "Fais valider tes compétences par des professionnels. Un badge de confiance sur ton CV.",
    color: "bg-orange-500/10 text-orange-400",
    badge: null,
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard personnel",
    desc: "Connecte-toi avec Google ou Apple. Retrouve, modifie et gère tous tes CV depuis ton espace.",
    color: "bg-emerald-500/10 text-emerald-400",
    badge: "Nouveau",
  },
  {
    icon: SlidersHorizontal,
    title: "7 templates + customisation",
    desc: "Classique, Moderne, Minimaliste, Élégant, Audacieux, Nature et Corporate. Chaque template est personnalisable.",
    color: "bg-cyan-500/10 text-cyan-400",
    badge: null,
  },
];

const highlightFeatures = [
  {
    icon: Palette,
    title: "Personnalise chaque détail",
    items: ["10 palettes de couleurs prédéfinies", "8 combinaisons de polices Google Fonts", "Réordonne les sections par glisser-déposer", "Ajuste la densité : compact ou aéré", "Photo : cercle, carré, hexagone ou sans", "Compétences : barres, points, pills, %"],
  },
  {
    icon: Sparkles,
    title: "L'IA fait le travail pour toi",
    items: ["Optimise tes descriptions d'expérience", "Génère un résumé professionnel percutant", "Traduit en 3 langues instantanément", "Analyse ta compatibilité avec les offres", "Rédige ta lettre de motivation", "Transcrit ta voix en données structurées"],
  },
  {
    icon: Lock,
    title: "Ton espace sécurisé",
    items: ["Connexion rapide Google / Apple", "Retrouve tous tes CV en un clic", "Modifie et mets à jour à tout moment", "Données sauvegardées dans le cloud", "Exporte en PDF haute qualité", "Aucun mot de passe à retenir"],
  },
];

const testimonials = [
  { name: "Amadou D.", role: "Développeur Web, Dakar", text: "J'ai créé mon CV en 3 minutes. L'optimisation IA a complètement transformé mes descriptions. Le panneau de personnalisation est incroyable." },
  { name: "Fatou S.", role: "Comptable, Thiès", text: "La traduction en anglais m'a permis de postuler à des offres internationales. J'adore pouvoir changer les couleurs et la police." },
  { name: "Moussa N.", role: "Chef de projet, Dakar", text: "L'analyse d'offre d'emploi m'aide à adapter mon CV à chaque candidature. Le dashboard est super pratique." },
  { name: "Aïssatou B.", role: "Designer UX, Saint-Louis", text: "Le remplissage vocal fonctionne parfaitement sur mon iPhone. Plus besoin de taper, je dicte et c'est rempli !" },
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
          <button onClick={() => navigate("/importer")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:flex items-center gap-1">
            <Upload className="w-4 h-4" /> Importer un CV
          </button>
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
            <p className="text-lg text-muted-foreground mb-4 max-w-lg">
              Dicte, écris ou remplis — l'IA transforme tes informations en CV parfait.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["7 templates", "Personnalisation totale", "Traduction IA", "Lettre de motivation", "Dashboard"].map(tag => (
                <span key={tag} className="tag-chip text-xs">{tag}</span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate("/creer")} className="btn-primary text-lg flex items-center justify-center gap-2">
                Créer mon CV <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate("/importer")} className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-card transition-all flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" /> Importer un CV existant
              </button>
              <button onClick={() => navigate("/video-cv/script")} className="px-8 py-4 rounded-xl border border-primary/30 bg-primary/5 text-primary font-semibold hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
                <Video className="w-5 h-5" /> 🎥 CV Vidéo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-end gap-4"
          >
            <motion.img src={cvMockup1} alt="CV Classique" className="w-40 md:w-48 rounded-lg shadow-2xl"
              animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src={cvMockup2} alt="CV Moderne" className="w-44 md:w-52 rounded-lg shadow-2xl -mt-6"
              animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
            <motion.img src={cvMockup3} alt="CV Minimaliste" className="w-40 md:w-48 rounded-lg shadow-2xl"
              animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
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
              <motion.div key={step.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7 text-primary" />
                  {i < steps.length - 1 && <div className="hidden md:block absolute -right-12 top-1/2 w-8 h-0.5 bg-border" />}
                </div>
                <div className="text-sm font-semibold text-primary mb-1">Étape {i + 1}</div>
                <div className="font-semibold text-foreground text-lg">{step.label}</div>
                <div className="text-sm text-muted-foreground mt-1">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Import CV Section */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Upload className="w-4 h-4" /> Nouvelle fonctionnalité
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Tu as déjà un CV ?<br />
                <span className="text-primary">Améliore-le avec l'IA</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                Importe ton CV existant (PDF, DOCX ou image) et notre IA l'analyse en profondeur. 
                Elle extrait tes données, évalue la qualité et te donne des recommandations concrètes 
                pour le rendre irrésistible aux recruteurs.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Upload, title: "Upload ton ancien CV", desc: "PDF, Word ou même une photo — l'IA lit tout" },
                  { icon: Target, title: "Score de qualité instantané", desc: "Découvre les points forts et les faiblesses de ton CV" },
                  { icon: TrendingUp, title: "Recommandations personnalisées", desc: "Reçois des conseils précis : sections manquantes, formulations à améliorer" },
                  { icon: RefreshCw, title: "Régénère en un clic", desc: "Applique les améliorations et génère un nouveau CV optimisé" },
                ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => navigate("/importer")} className="btn-primary text-lg flex items-center gap-2">
                <Upload className="w-5 h-5" /> Importer mon CV <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Analyse IA</h4>
                    <p className="text-xs text-muted-foreground">Score de ton CV</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-3xl font-bold text-primary">72%</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { type: "✅", label: "Expériences bien détaillées", color: "border-l-primary" },
                    { type: "⚠️", label: "Ajoute un résumé professionnel", color: "border-l-orange-400" },
                    { type: "⚠️", label: "Manque de verbes d'action", color: "border-l-orange-400" },
                    { type: "💡", label: "Ajoute tes certifications", color: "border-l-blue-400" },
                    { type: "❌", label: "Section langues absente", color: "border-l-destructive" },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}
                      className={`bg-muted/50 rounded-lg p-3 border-l-4 ${item.color} flex items-center gap-2`}
                    >
                      <span>{item.type}</span>
                      <span className="text-sm text-foreground">{item.label}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-primary/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">Améliorations</p>
                  </div>
                  <div className="flex-1 bg-orange-500/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-orange-500">2</p>
                    <p className="text-xs text-muted-foreground">Manquants</p>
                  </div>
                  <div className="flex-1 bg-blue-500/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-500">1</p>
                    <p className="text-xs text-muted-foreground">Conseil</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-4">Toutes les fonctionnalités</h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Des outils puissants pour créer le CV parfait et décrocher ton emploi
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="glass-card hover:border-primary/20 transition-all group relative">
                {f.badge && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                )}
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-3`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight Features — detailed 3-column */}
      <section className="px-6 md:px-12 py-20 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-4">Ce qui nous rend unique</h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Bien plus qu'un simple générateur de CV
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {highlightFeatures.map((hf, i) => (
              <motion.div key={hf.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass-card">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <hf.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{hf.title}</h3>
                <ul className="space-y-2.5">
                  {hf.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-secondary-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-4">Ils nous font confiance</h2>
          <p className="text-muted-foreground text-center mb-16">Des centaines de CV créés chaque semaine au Sénégal</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-secondary-foreground text-xs mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground text-xs">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-12 py-20 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-4">Tarifs simples</h2>
          <p className="text-muted-foreground text-center mb-16">Pas d'abonnement caché. Paye ce que tu utilises.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div whileHover={{ scale: 1.02 }} className="glass-card text-center">
              <div className="text-3xl font-bold text-foreground mb-2">2 000 FCFA</div>
              <div className="text-muted-foreground mb-6">CV unique</div>
              <ul className="space-y-3 text-left mb-8">
                {["1 CV professionnel", "7 templates au choix", "Optimisation IA", "Personnalisation complète", "Remplissage vocal", "Téléchargement PDF"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-secondary-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/creer")} className="btn-primary w-full">Commencer</button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="glass-card text-center border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAIRE</div>
              <div className="text-3xl font-bold text-foreground mb-2">3 000 FCFA<span className="text-lg font-normal text-muted-foreground">/mois</span></div>
              <div className="text-muted-foreground mb-6">Illimité</div>
              <ul className="space-y-3 text-left mb-8">
                {[
                  "CV illimités", "Tous les templates", "Personnalisation avancée", "Optimisation IA avancée",
                  "Traduction multilingue", "Lettre de motivation IA",
                  "Analyse d'offres d'emploi", "Certification compétences", "Dashboard personnel"
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
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} className="glass-card border-primary/20 py-12">
            <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Prêt à décrocher ton emploi ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Rejoins des centaines de professionnels sénégalais qui ont déjà créé leur CV avec CVExpress.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate("/creer")} className="btn-primary text-lg flex items-center gap-2 mx-auto sm:mx-0">
                Créer mon CV maintenant <ArrowRight className="w-5 h-5" />
              </button>
              {!user && (
                <button onClick={() => navigate("/connexion")} className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-card transition-all flex items-center justify-center gap-2 mx-auto sm:mx-0">
                  <User className="w-5 h-5" /> Se connecter
                </button>
              )}
            </div>
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
