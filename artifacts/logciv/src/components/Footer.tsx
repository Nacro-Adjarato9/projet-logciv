import { Link } from "wouter";
import { Building2, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Log<span className="text-primary">Civ</span>
              </span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              La plateforme immobilière de référence en Côte d'Ivoire, dédiée aux professionnels de l'immobilier.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/apropos" className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link href="/inscription" className="hover:text-primary transition-colors">Inscription</Link></li>
              <li><Link href="/connexion" className="hover:text-primary transition-colors">Connexion</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-primary transition-colors cursor-pointer">Publier un bien</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Gérer vos annonces</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Réservations de visite</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Messagerie</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Plateau, Abidjan<br />Côte d'Ivoire</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+225 07 00 00 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contact@logciv.ci</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-background/40">
          <p>&copy; 2026 LogCiv. Tous droits réservés.</p>
          <p>Abidjan, Côte d'Ivoire — Plateforme immobilière professionnelle</p>
        </div>
      </div>
    </footer>
  );
}

