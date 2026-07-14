import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/lib/store";
import { PRICING_PLANS } from "@/types/pricing";
import type { PlanType } from "@/types/pricing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "wave", label: "Wave", cls: "border-sky-300 bg-sky-50 text-sky-700", dot: "bg-sky-500" },
  { id: "orange", label: "Orange Money", cls: "border-orange-300 bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  { id: "mtn", label: "MTN Mobile Money", cls: "border-yellow-300 bg-yellow-50 text-yellow-700", dot: "bg-yellow-400" },
  { id: "moov", label: "Moov Money", cls: "border-blue-300 bg-blue-50 text-blue-700", dot: "bg-blue-600" },
] as const;

type MethodId = (typeof PAYMENT_METHODS)[number]["id"];

export default function Paiement() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();
  const upgradePlan = useStore((s) => s.upgradePlan);

  const planId = (new URLSearchParams(search).get("plan") as PlanType) || "basic";
  const plan = PRICING_PLANS[planId];

  const [method, setMethod] = useState<MethodId>("wave");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[0-9]{8,10}$/.test(phone.replace(/\s/g, ""))) {
      setError("Saisis un numéro de téléphone valide pour le paiement mobile money.");
      return;
    }

    setStatus("processing");
    setTimeout(() => {
      if (currentUser) {
        upgradePlan(currentUser.id, planId);
      }
      setStatus("done");
      setTimeout(() => {
        const role = currentUser ? String(currentUser.role) : "proprietaire";
        setLocation(`/dashboard/${role}`);
      }, 1800);
    }, 2200);
  };

  if (status !== "idle") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            {status === "processing" ? (
              <>
                <Loader2 className="w-14 h-14 text-primary mx-auto mb-6 animate-spin" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Paiement en cours de traitement</h1>
                <p className="text-muted-foreground">
                  Confirme la transaction sur ton téléphone ({PAYMENT_METHODS.find((m) => m.id === method)?.label}) si une notification apparaît. Merci de patienter, ne ferme pas cette page.
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-14 h-14 text-accent mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Paiement confirmé !</h1>
                <p className="text-muted-foreground">
                  Ton abonnement <strong>{plan.name}</strong> est activé. Redirection vers ton tableau de bord...
                </p>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-16 bg-muted/30">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-primary/5 border-b border-border p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Abonnement</p>
                <p className="text-lg font-bold text-foreground">{plan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{plan.price.toLocaleString("fr-CI")} <span className="text-sm font-normal text-muted-foreground">FCFA</span></p>
                <p className="text-xs text-muted-foreground">/ mois</p>
              </div>
            </div>

            <form onSubmit={handlePay} className="p-6 space-y-5">
              <div>
                <Label className="text-sm font-medium mb-2 block">Choisis ton moyen de paiement</Label>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all ${
                        method === m.id ? `${m.cls} border-current` : "border-border text-foreground hover:border-primary/40"
                      }`}
                      data-testid={`payment-method-${m.id}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${m.dot}`} />
                      <span translate="no">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Numéro de téléphone <span translate="no">{PAYMENT_METHODS.find((m) => m.id === method)?.label}</span>
                </Label>
                <Input
                  placeholder="0700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5"
                  data-testid="input-payment-phone"
                />
                {error && <p className="text-xs text-destructive mt-1">{error}</p>}
              </div>

              <Button type="submit" className="w-full bg-primary text-white font-semibold gap-2 py-5" data-testid="button-pay">
                Payer {plan.price.toLocaleString("fr-CI")} FCFA
              </Button>

              <p className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" /> Paiement sécurisé
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
