import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, LogIn } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Email invalide"),
  motdepasse: z.string().min(1, "Mot de passe requis"),
});

type FormData = z.infer<typeof schema>;

export default function Connexion() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { login } = useAuth();
  const users = useStore((s) => s.users);
  const seedMockData = useStore((s) => s.seedMockData);
  const [, setLocation] = useLocation();

  const onSubmit = (data: FormData) => {
    seedMockData(); // ensure mock data exists
    const user = users.find((u) => u.email === data.email);
    if (!user) {
      setError("email", { message: "Aucun compte trouvé avec cet email" });
      return;
    }
    // In simulation mode, any password works for mock users
    login(user);
    setLocation(`/dashboard/${user.role}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-foreground to-foreground/90 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            Log<span className="text-primary">Civ</span>
          </span>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Gérez vos biens immobiliers depuis un seul endroit
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Connectez-vous pour accéder à votre espace de gestion immobilière en Côte d'Ivoire.
          </p>
          <div className="space-y-4">
            {[
              "Tableau de bord personnalisé selon votre rôle",
              "Gestion simplifiée de vos annonces",
              "Suivi des réservations en temps réel",
              "Messagerie intégrée avec vos clients",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <p className="text-white/50 text-xs mb-3">Compte démo — connexion rapide</p>
          <div className="space-y-1 text-sm text-white/70">
            <p><span className="text-white/40">Email :</span> jean@test.com</p>
            <p><span className="text-white/40">Mot de passe :</span> (n'importe lequel)</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Log<span className="text-primary">Civ</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Connexion</h1>
            <p className="text-muted-foreground">Bienvenue sur LogCiv, connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.kouassi@gmail.com"
                {...register("email")}
                className="mt-1.5"
                data-testid="input-login-email"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <Label htmlFor="motdepasse" className="text-sm font-medium">Mot de passe</Label>
                <a href="#" className="text-xs text-primary hover:underline">Mot de passe oublié ?</a>
              </div>
              <Input
                id="motdepasse"
                type="password"
                placeholder="••••••••"
                {...register("motdepasse")}
                data-testid="input-login-password"
              />
              {errors.motdepasse && <p className="text-xs text-destructive mt-1">{errors.motdepasse.message}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold gap-2 py-5"
              data-testid="button-login-submit"
            >
              <LogIn className="w-4 h-4" />
              Se connecter
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-primary font-medium hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
