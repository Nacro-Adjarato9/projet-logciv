import { Badge } from "@/components/ui/badge";
import { Building2, Target, Eye, Users, MapPin, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Apropos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-foreground to-foreground/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 text-sm px-4 py-1.5">
            À propos de LogCiv
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Digitaliser l'immobilier ivoirien
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            LogCiv est la plateforme de référence pour les professionnels de l'immobilier en Côte d'Ivoire. 
            Nous facilitons la gestion, la publication et la transaction de biens immobiliers à Abidjan et partout en Côte d'Ivoire.
          </p>
        </div>
      </section>

      {/* Presentation */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Qui sommes-nous ?
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  LogCiv est née d'un constat simple : le secteur immobilier ivoirien manquait d'une plateforme numérique moderne, 
                  adaptée aux réalités locales, qui permettrait aux professionnels de gérer efficacement leur activité.
                </p>
                <p>
                  Fondée à Abidjan, notre équipe comprend les subtilités du marché immobilier ivoirien — des appartements 
                  de Cocody aux villas de Bingerville, en passant par les bureaux du Plateau.
                </p>
                <p>
                  Nous croyons fermement que la digitalisation du secteur immobilier est une opportunité majeure pour 
                  l'économie ivoirienne, et LogCiv se positionne comme le catalyseur de cette transformation.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80"
                  alt="Abidjan skyline"
                  className="w-full h-72 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold text-sm">Abidjan, Côte d'Ivoire</span>
                </div>
                <p className="text-xs opacity-80">Siège social — Plateau</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Notre mission</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Faciliter la gestion immobilière en Côte d'Ivoire</strong> en offrant 
                aux propriétaires, agents et agences une plateforme numérique intuitive et complète.
              </p>
              <ul className="space-y-3">
                {[
                  "Simplifier la publication de biens immobiliers",
                  "Fluidifier les échanges entre propriétaires et clients",
                  "Moderniser la gestion des réservations de visite",
                  "Centraliser la communication dans un seul outil",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vision */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Notre vision</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Digitaliser le secteur immobilier ivoirien</strong> et faire de 
                la Côte d'Ivoire un modèle de proptech en Afrique de l'Ouest.
              </p>
              <ul className="space-y-3">
                {[
                  "Devenir la référence immobilière en Côte d'Ivoire",
                  "Expansion vers toutes les villes ivoiriennes",
                  "Intégration des outils de paiement mobile local",
                  "Connecter les acteurs de l'immobilier à l'échelle nationale",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Target audience */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Notre cible</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Qui utilise LogCiv ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              LogCiv est conçu exclusivement pour les professionnels du secteur immobilier ivoirien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏠",
                title: "Propriétaires",
                subtitle: "Particuliers et entreprises",
                desc: "Vous possédez des biens à louer ou à vendre ? LogCiv vous permet de les publier et de gérer vos locataires facilement.",
                examples: ["Appartements à Cocody", "Villas à Bingerville", "Studios à Yopougon"],
                color: "primary",
              },
              {
                icon: "👔",
                title: "Agents immobiliers",
                subtitle: "Professionnels indépendants",
                desc: "Gérez votre portefeuille de biens, suivez vos clients et organisez vos visites depuis une interface unique.",
                examples: ["Gestion du portefeuille", "Suivi des visites", "Communication client"],
                color: "accent",
              },
              {
                icon: "🏢",
                title: "Agences immobilières",
                subtitle: "Structures professionnelles",
                desc: "Un dashboard complet pour votre agence : gestion des agents, des biens et statistiques d'activité.",
                examples: ["Tableau de bord agence", "Gestion des agents", "Statistiques avancées"],
                color: "primary",
              },
            ].map((target) => (
              <div
                key={target.title}
                className="bg-card border border-border rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                data-testid={`card-target-${target.title.toLowerCase()}`}
              >
                <div className="text-4xl mb-4">{target.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-1">{target.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{target.subtitle}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{target.desc}</p>
                <div className="space-y-2">
                  {target.examples.map((ex) => (
                    <div key={ex} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full ${target.color === "primary" ? "bg-primary" : "bg-accent"}`} />
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-br from-foreground to-foreground/90 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-10">Nos valeurs</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Building2, title: "Transparence", desc: "Des informations claires et vérifiées sur chaque bien." },
              { icon: Users, title: "Proximité", desc: "Une plateforme pensée pour le contexte ivoirien." },
              { icon: CheckCircle, title: "Fiabilité", desc: "Des outils robustes sur lesquels vous pouvez compter." },
            ].map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{val.title}</h3>
                  <p className="text-white/60 text-sm">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
