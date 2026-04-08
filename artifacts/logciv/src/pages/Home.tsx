import { Link } from "wouter";
import { Building2, FileText, CalendarCheck, MessageSquare, ChevronRight, MapPin, ArrowRight, Users, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sampleProperties = [
  {
    id: 1,
    titre: "Appartement 3 pièces à Cocody Angré",
    type: "Appartement",
    commune: "Cocody",
    prix: "250 000 FCFA/mois",
    badge: "Location",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    surface: "85 m²",
  },
  {
    id: 2,
    titre: "Villa basse à Bingerville",
    type: "Villa",
    commune: "Bingerville",
    prix: "45 000 000 FCFA",
    badge: "Vente",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    surface: "320 m²",
  },
  {
    id: 3,
    titre: "Bureau à Marcory Zone 4",
    type: "Bureau",
    commune: "Marcory",
    prix: "500 000 FCFA/mois",
    badge: "Location",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    surface: "120 m²",
  },
];

const features = [
  {
    icon: Building2,
    title: "Publier un bien",
    desc: "Mettez en ligne vos biens en quelques minutes. Photos, description, prix — tout en un.",
  },
  {
    icon: FileText,
    title: "Gérer vos annonces",
    desc: "Suivez vos annonces, modifiez les informations et contrôlez la visibilité de vos biens.",
  },
  {
    icon: CalendarCheck,
    title: "Réservations de visite",
    desc: "Recevez et gérez les demandes de visite. Acceptez ou refusez en un clic.",
  },
  {
    icon: MessageSquare,
    title: "Messagerie intégrée",
    desc: "Communiquez directement avec vos clients depuis la plateforme, en toute simplicité.",
  },
];

const stats = [
  { value: "500+", label: "Biens publiés", icon: Building2 },
  { value: "1 200+", label: "Utilisateurs actifs", icon: Users },
  { value: "98%", label: "Satisfaction client", icon: TrendingUp },
  { value: "100%", label: "Sécurisé", icon: Shield },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-24 overflow-hidden bg-gradient-to-br from-foreground via-foreground to-foreground/90">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 text-sm px-4 py-1.5">
                Plateforme N°1 en Côte d'Ivoire
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Votre plateforme{" "}
                <span className="text-primary">immobilière</span>{" "}
                en Côte d'Ivoire
              </h1>
              <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                Trouvez, publiez et gérez vos biens à Abidjan facilement. LogCiv connecte propriétaires, agents et agences immobilières.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/inscription" data-testid="button-cta-inscription">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2 px-8 shadow-lg">
                    Commencer gratuitement
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/connexion" data-testid="button-cta-connexion">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-semibold px-8">
                    Se connecter
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10">
                {stats.slice(0, 2).map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image card */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80"
                  alt="Immeubles modernes Abidjan"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Abidjan, Côte d'Ivoire</span>
                  </div>
                  <p className="text-white/80 text-xs mt-1">Le marché immobilier ivoirien à portée de main</p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-primary text-white rounded-xl px-4 py-2 shadow-lg text-sm font-semibold">
                +500 biens disponibles
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center text-white">
                  <div className="flex justify-center mb-1">
                    <Icon className="w-5 h-5 opacity-80" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Fonctionnalités</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              LogCiv vous offre tous les outils pour gérer efficacement vos biens immobiliers en Côte d'Ivoire.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample properties */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Biens en vedette</Badge>
              <h2 className="text-3xl font-bold text-foreground">Exemples de biens à Abidjan</h2>
            </div>
            <Link href="/inscription">
              <Button variant="outline" className="gap-2">
                Voir tous les biens
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProperties.map((property) => (
              <div
                key={property.id}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                data-testid={`card-property-${property.id}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`text-xs font-semibold ${property.badge === "Location" ? "bg-primary text-white" : "bg-accent text-white"}`}>
                      {property.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/50 text-white text-xs backdrop-blur-sm">
                      {property.type}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{property.titre}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{property.commune}, Abidjan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-sm">{property.prix}</span>
                    <span className="text-xs text-muted-foreground">{property.surface}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LogCiv */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Pourquoi LogCiv ?</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                La solution immobilière pensée pour la Côte d'Ivoire
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Conçu pour Abidjan", desc: "Communes, quartiers et tarifs adaptés au marché local ivoirien." },
                  { title: "Gratuit pour commencer", desc: "Publiez vos premiers biens sans frais. Évoluez selon vos besoins." },
                  { title: "Multi-profils", desc: "Propriétaires, agents et agences — chacun a son espace dédié." },
                  { title: "Simple et efficace", desc: "Interface pensée pour aller à l'essentiel, sans complexité inutile." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                  alt="Immobilier Côte d'Ivoire"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-lg max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Plateforme sécurisée</p>
                    <p className="text-xs text-muted-foreground">Vos données sont protégées</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-foreground to-foreground/90">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à digitaliser votre activité immobilière ?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Rejoignez des centaines de professionnels qui font confiance à LogCiv pour gérer leurs biens en Côte d'Ivoire.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/inscription">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2 px-10">
                Créer mon compte gratuitement
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
