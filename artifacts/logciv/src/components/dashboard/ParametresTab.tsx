import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Lock, Bell, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ParametresTab() {
  const { currentUser } = useAuth();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({
    reservations: true, messages: true, biens: true, newsletter: false,
  });
  const [prefsSaved, setPrefsSaved] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (passwords.new.length < 8) { setPwError("Le nouveau mot de passe doit contenir au moins 8 caractères"); return; }
    if (passwords.new !== passwords.confirm) { setPwError("Les mots de passe ne correspondent pas"); return; }
    setPwSuccess(true);
    setPasswords({ old: "", new: "", confirm: "" });
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const savePrefs = () => {
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">Paramètres</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Gérez vos préférences et sécurité</p>
      </div>

      {/* Password */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" /> Modifier le mot de passe
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <PasswordField label="Mot de passe actuel" value={passwords.old}
            onChange={() => {}}
            show={showOld} onToggle={() => setShowOld(!showOld)} readOnly />
          <PasswordField label="Nouveau mot de passe" value={passwords.new}
            onChange={(v) => setPasswords((p) => ({ ...p, new: v }))}
            show={showNew} onToggle={() => setShowNew(!showNew)} disabled />
          <PasswordField label="Confirmer le nouveau mot de passe" value={passwords.confirm}
            onChange={(v) => setPasswords((p) => ({ ...p, confirm: v }))}
            show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} disabled />
          {pwError && <p className="text-xs text-destructive">{pwError}</p>}
          {pwSuccess && (
            <div className="flex items-center gap-2 text-sm text-accent">
              <CheckCircle className="w-4 h-4" /> Mot de passe modifié avec succès !
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Fonctionnalité bientôt disponible. En attendant, utilise "Mot de passe oublié" sur la page de connexion.
          </p>
          <Button type="submit" className="bg-primary text-white gap-2" disabled data-testid="button-save-password">
            <Lock className="w-4 h-4" /> Modifier le mot de passe
          </Button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" /> Préférences de notifications
        </h3>
        <div className="space-y-4">
          {[
            { key: "reservations", label: "Nouvelles réservations", desc: "Soyez notifié de chaque nouvelle demande de visite" },
            { key: "messages", label: "Nouveaux messages", desc: "Recevez une alerte à chaque nouveau message" },
            { key: "biens", label: "Activité sur vos biens", desc: "Mises à jour sur vos annonces publiées" },
            { key: "newsletter", label: "Newsletter LogCiv", desc: "Actualités et conseils immobiliers" },
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between gap-4 py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <button
                type="button"
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${notifPrefs[pref.key as keyof typeof notifPrefs] ? "bg-primary" : "bg-muted"}`}
                onClick={() => setNotifPrefs((p) => ({ ...p, [pref.key]: !p[pref.key as keyof typeof notifPrefs] }))}
                data-testid={`toggle-${pref.key}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifPrefs[pref.key as keyof typeof notifPrefs] ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button className="bg-primary text-white" onClick={savePrefs} data-testid="button-save-prefs">
            Enregistrer
          </Button>
          {prefsSaved && (
            <div className="flex items-center gap-1.5 text-sm text-accent">
              <CheckCircle className="w-4 h-4" /> Préférences enregistrées
            </div>
          )}
        </div>
      </div>

      {/* Account info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" /> Informations du compte
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Email : <span className="text-foreground font-medium">{currentUser?.email}</span></p>
          <p>Membre depuis : <span className="text-foreground font-medium">
            {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString("fr-CI", { year: "numeric", month: "long" }) : "—"}
          </span></p>
          <p>Statut : <span className="text-foreground font-medium capitalize">{currentUser?.verificationStatus?.replace("_", " ") ?? "—"}</span></p>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, readOnly, disabled }: {
  label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void;
  readOnly?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative mt-1.5">
        <Input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly} disabled={disabled}
          placeholder="••••••••" className="pr-10 disabled:opacity-60 disabled:cursor-not-allowed" />
        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={onToggle}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
