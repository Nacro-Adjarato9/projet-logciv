import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Building2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { authAPI, extractAuthTokens, setTokens, usersAPI } from "@/services/api";

const schema = z.object({
  email: z.string().email("Email invalide"),
  motdepasse: z.string().min(1, "Mot de passe requis"),
});

type FormData = z.infer<typeof schema>;

function mapApiUserToLocalUser(apiUser: any, fallbackEmail: string) {
  const account = apiUser?.user ?? apiUser ?? {};
  const profile = apiUser?.profile ?? {};
  const role = profile?.role ?? apiUser?.role ?? apiUser?.user_type ?? "proprietaire";
  const isVerified =
    profile?.is_verified !== undefined
      ? profile.is_verified
      : apiUser?.verificationStatus === "verifie" || apiUser?.verification_status === true;

  return {
    id: String(account?.id ?? apiUser?.id ?? apiUser?.pk ?? apiUser?.email ?? fallbackEmail),
    username: account?.username ?? apiUser?.username ?? "",
    nom: apiUser?.nom ?? account?.last_name ?? apiUser?.last_name ?? "",
    prenom: apiUser?.prenom ?? account?.first_name ?? apiUser?.first_name ?? "",
    email: account?.email ?? apiUser?.email ?? fallbackEmail,
    telephone: apiUser?.telephone ?? profile?.telephone ?? apiUser?.phone ?? "",
    role,
    verificationStatus: isVerified ? "verifie" : (apiUser?.verificationStatus ?? apiUser?.verification_status ?? "en_attente"),
    adresse: apiUser?.adresse ?? apiUser?.adresse_complete ?? profile?.adresse_complete ?? "",
    ville: apiUser?.ville ?? profile?.ville ?? "",
    commune: apiUser?.commune ?? profile?.commune ?? "",
    quartier: apiUser?.quartier ?? profile?.quartier ?? "",
    nomAgence: apiUser?.nomAgence ?? apiUser?.nom_agence ?? "",
    rccm: apiUser?.rccm ?? apiUser?.numero_registre_commerce ?? "",
    ncc: apiUser?.ncc ?? apiUser?.numero_contribuable ?? "",
    siteWeb: apiUser?.siteWeb ?? apiUser?.site_web ?? "",
    description: apiUser?.description ?? "",
    logo: apiUser?.logo ?? "",
  };
}

export default function Connexion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await authAPI.login({
        email: data.email,
        password: data.motdepasse,
      });

      const tokens = extractAuthTokens(response);
      if (tokens.access || tokens.refresh) {
        setTokens(tokens);
      }

      let apiUser: any = null;
      try {
        apiUser = await usersAPI.me();
      } catch {
        apiUser = null;
      }

      const user = apiUser
        ? mapApiUserToLocalUser(apiUser, data.email)
        : {
            id: data.email,
            username: data.email.split("@")[0],
            nom: "",
            prenom: "",
            email: data.email,
            telephone: "",
            role: "proprietaire",
            verificationStatus: "en_attente",
            adresse: "",
            ville: "",
            commune: "",
            quartier: "",
            nomAgence: "",
            rccm: "",
            ncc: "",
            siteWeb: "",
            description: "",
            logo: "",
          };
      login(user as any);
      setLocation(`/dashboard/${user.role}`);
    } catch (err: any) {
      setError("email", {
        message:
          err?.message ||
          "Connexion impossible. Vérifie l'API ou tes identifiants.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
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
            Gerez vos biens immobiliers depuis un seul endroit
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Connectez-vous pour acceder a votre espace de gestion immobiliere.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
        <div className="w-full max-w-md">
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
          <p className="text-muted-foreground">
              Bienvenue sur LogCiv, connectez-vous à votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.kouassi@gmail.com"
                {...register("email")}
                className="mt-1.5"
                data-testid="input-login-email"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <Label htmlFor="motdepasse" className="text-sm font-medium">
                  Mot de passe
                </Label>
              </div>
              <Input
                id="motdepasse"
                type="password"
                placeholder="********"
                {...register("motdepasse")}
                data-testid="input-login-password"
              />
              {errors.motdepasse && (
                <p className="text-xs text-destructive mt-1">
                  {errors.motdepasse.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold gap-2 py-5"
              data-testid="button-login-submit"
              disabled={loading}
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Connexion..." : "Se connecter"}
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
