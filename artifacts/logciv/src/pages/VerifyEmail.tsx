import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Building2, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI } from "@/services/api";

export default function VerifyEmail() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !code.trim()) {
      setError("Veuillez saisir votre email et le code reçu.");
      return;
    }
    setLoading(true);
    try {
      await authAPI.verifyEmail({ email: email.trim(), token: code.trim() });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Code invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Veuillez saisir votre email pour recevoir un nouveau code.");
      return;
    }
    setResending(true);
    setError("");
    try {
      await authAPI.resendVerification({ email: email.trim() });
    } catch (err: any) {
      setError(err?.message || "Impossible d'envoyer le code.");
    } finally {
      setResending(false);
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Email vérifié !</h1>
            <p className="text-muted-foreground mb-6">Votre adresse email a été vérifiée avec succès.</p>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setLocation("/connexion")}>
              Se connecter
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Vérifiez votre email</h1>
              <p className="text-muted-foreground text-sm">
                Saisissez le code à 6 chiffres que vous avez reçu par email.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <Label htmlFor="code">Code de vérification</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1.5 text-center text-2xl font-bold tracking-[0.5em]"
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white">
                {loading ? "Vérification..." : "Vérifier"}
              </Button>
            </form>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full text-center text-sm text-primary font-medium mt-6 hover:underline"
            >
              {resending ? "Envoi..." : "Renvoyer le code"}
            </button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              <Link href="/connexion" className="hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
