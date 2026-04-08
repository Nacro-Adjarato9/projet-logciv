import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, Building2, FileText, CheckCircle, Clock, XCircle, AlertCircle, Globe } from "lucide-react";

const roleLabels: Record<string, string> = { proprietaire: "Propriétaire", agent: "Agent", agence: "Agence" };
const roleColors: Record<string, string> = {
  proprietaire: "bg-primary/10 text-primary border-primary/20",
  agent: "bg-accent/10 text-accent border-accent/20",
  agence: "bg-purple-100 text-purple-700 border-purple-200",
};
const verifConfig: Record<string, { label: string; cls: string; icon: typeof CheckCircle }> = {
  verifie: { label: "Compte vérifié", cls: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  en_attente: { label: "Vérification en cours", cls: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  non_verifie: { label: "Non vérifié", cls: "bg-gray-100 text-gray-600 border-gray-200", icon: AlertCircle },
  refuse: { label: "Vérification refusée", cls: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

export default function ProfilTab() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  const verCfg = verifConfig[currentUser.verificationStatus ?? "non_verifie"];
  const VerIcon = verCfg.icon;

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">Mon profil</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Informations de votre compte</p>
      </div>

      {/* Avatar + name */}
      <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {currentUser.logo ? (
            <img src={currentUser.logo} alt="logo" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-primary">{currentUser.prenom?.charAt(0)}{currentUser.nom?.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{currentUser.prenom} {currentUser.nom}</h3>
          {currentUser.nomAgence && <p className="text-sm text-muted-foreground">{currentUser.nomAgence}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {currentUser.role && (
              <Badge className={`text-xs ${roleColors[currentUser.role]}`}>{roleLabels[currentUser.role]}</Badge>
            )}
            <span className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-0.5 ${verCfg.cls}`}>
              <VerIcon className="w-3 h-3" />{verCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Informations personnelles
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoRow icon={User} label="Nom complet" value={`${currentUser.prenom} ${currentUser.nom}`} />
          <InfoRow icon={Mail} label="Email" value={currentUser.email} />
          <InfoRow icon={Phone} label="Téléphone" value={currentUser.telephone} />
          {currentUser.adresse && <InfoRow icon={MapPin} label="Adresse" value={currentUser.adresse} />}
          {currentUser.ville && <InfoRow icon={MapPin} label="Ville" value={currentUser.ville} />}
        </div>
      </div>

      {/* Professional info */}
      {(currentUser.role === "agent" || currentUser.role === "agence") && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Informations professionnelles
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {currentUser.nomAgence && <InfoRow icon={Building2} label="Agence" value={currentUser.nomAgence} />}
            {currentUser.rccm && <InfoRow icon={FileText} label="RCCM" value={currentUser.rccm} />}
            {currentUser.ncc && <InfoRow icon={FileText} label="NCC" value={currentUser.ncc} />}
            {currentUser.siteWeb && <InfoRow icon={Globe} label="Site web" value={currentUser.siteWeb} />}
          </div>
          {currentUser.description && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground/80">{currentUser.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Verification message */}
      {currentUser.verificationStatus === "en_attente" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Compte en cours de vérification</p>
              <p className="text-xs text-yellow-700">Votre dossier et vos documents ont été soumis. Notre équipe les examine. Vous serez notifié par email une fois la validation effectuée (délai : 24-48h).</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}
