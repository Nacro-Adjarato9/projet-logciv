import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Building2, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI } from "@/services/api";

export default function ResetPassword() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token || !email) {
      setError("Lien invalide : token ou email manquant.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== password2) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await authAPI.passwordResetConfirm({ email, token, password, password2 });
      setSuccess(true);
      setTimeout(() => setLocation("/connexion"), 2000);
    } catch (err: any) {
      setError(err?.message || "Impossible de réinitialiser le mot de passe. Le lien est peut-être expiré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Log<span className="text-primary">Civ</span>
          </span>
        </div>

        {success ? (
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-accent mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Mot de passe modifié !</h1>
            <p className="text-muted-foreground">Redirection vers la connexion...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <KeyRound className="w-12 h-12 text-primary mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Nouveau mot de passe</h1>
              <p className="text-muted-foreground text-sm">
                Choisissez un nouveau mot de passe pour {email || "votre compte"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                  placeholder="********"
                />
              </div>
              <div>
                <Label htmlFor="password2">Confirmer le mot de passe</Label>
                <Input
                  id="password2"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="mt-1.5"
                  placeholder="********"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {loading ? "Enregistrement..." : "Réinitialiser le mot de passe"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link href="/connexion" className="text-primary font-medium hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
