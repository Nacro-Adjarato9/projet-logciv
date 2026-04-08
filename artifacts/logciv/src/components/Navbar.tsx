import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Building2, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setLocation("/");
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    if (!currentUser) return "/connexion";
    return `/dashboard/${currentUser.role}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Log<span className="text-primary">Civ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors" data-testid="link-accueil">
              Accueil
            </Link>
            <Link href="/apropos" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors" data-testid="link-apropos">
              À propos
            </Link>

            {!currentUser ? (
              <>
                <Link href="/inscription" data-testid="link-inscription">
                  <Button variant="ghost" size="sm" className="text-sm font-medium">
                    Inscription
                  </Button>
                </Link>
                <Link href="/connexion" data-testid="link-connexion">
                  <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-medium">
                    Connexion
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={getDashboardLink()} data-testid="link-dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-foreground/70 hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-border shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className="block py-2 text-sm font-medium text-foreground/70 hover:text-primary" onClick={() => setIsOpen(false)}>
              Accueil
            </Link>
            <Link href="/apropos" className="block py-2 text-sm font-medium text-foreground/70 hover:text-primary" onClick={() => setIsOpen(false)}>
              À propos
            </Link>
            {!currentUser ? (
              <>
                <Link href="/inscription" className="block py-2 text-sm font-medium text-foreground/70 hover:text-primary" onClick={() => setIsOpen(false)}>
                  Inscription
                </Link>
                <Link href="/connexion" className="block py-2" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full bg-primary text-white">Connexion</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={getDashboardLink()} className="block py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-left py-2 text-sm font-medium text-destructive">
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
