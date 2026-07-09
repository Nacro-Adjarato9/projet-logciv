import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api, usersAPI } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MapPin, Building2, FileText, CheckCircle, Clock, XCircle, AlertCircle, Globe, Pencil, X } from "lucide-react";

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

interface EditFormData {
  prenom: string; nom: string; telephone: string;
  adresse: string; ville: string;
  nomAgence: string; rccm: string; ncc: string; siteWeb: string; description: string;
}

export default function ProfilTab() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditFormData | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["dashboard", "profile"],
    queryFn: () => api.users.me(),
    enabled: !!currentUser,
    staleTime: 60_000,
  });

  const user = profileQuery.data ?? currentUser;

  const saveMutation = useMutation({
    mutationFn: async (data: EditFormData) => {
      await usersAPI.updateMe({
        first_name: data.prenom,
        last_name: data.nom,
        phone: data.telephone,
      });
      if (user?.role === "proprietaire") {
        await usersAPI.updateProfilProprietaire({
          adresse: data.adresse,
          ville: data.ville,
        });
      } else if (user?.role === "agent" || user?.role === "agence") {
        await usersAPI.updateProfilAgence({
          nom_agence: data.nomAgence,
          adresse: data.adresse,
          ville: data.ville,
          site_web: data.siteWeb,
          description: data.description,
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err: any) => {
      setSaveError(err?.message || "Impossible d'enregistrer les modifications.");
    },
  });

  if (!user) return null;

  const verCfg = verifConfig[user.verificationStatus ?? user.verification_status ?? "non_verifie"];
  const VerIcon = verCfg.icon;

  const startEditing = () => {
    setSaveError("");
    setForm({
      prenom: user.prenom ?? "",
      nom: user.nom ?? "",
      telephone: user.telephone ?? "",
      adresse: user.adresse ?? "",
      ville: user.ville ?? "",
      nomAgence: user.nomAgence ?? "",
      rccm: user.rccm ?? "",
      ncc: user.ncc ?? "",
      siteWeb: user.siteWeb ?? "",
      description: user.description ?? "",
    });
    setEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaveError("");
    saveMutation.mutate(form);
  };

  const setField = (key: keyof EditFormData, value: string) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const isAgency = user.role === "agent" || user.role === "agence";

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Mon profil</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Informations de votre compte</p>
        </div>
        {!editing && (
          <Button variant="outline" className="gap-2" onClick={startEditing} data-testid="button-edit-profile">
            <Pencil className="w-4 h-4" /> Modifier
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {user.logo ? (
            <img src={user.logo} alt="logo" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-primary">{user.prenom?.charAt(0)}{user.nom?.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{user.prenom} {user.nom}</h3>
          {user.nomAgence && <p className="text-sm text-muted-foreground">{user.nomAgence}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {user.role && <Badge className={`text-xs ${roleColors[user.role]}`}>{roleLabels[user.role]}</Badge>}
            <span className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-0.5 ${verCfg.cls}`}>
              <VerIcon className="w-3 h-3" />{verCfg.label}
            </span>
          </div>
        </div>
      </div>

      {editing && form ? (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Modifier mes informations
            </h3>
            <button type="button" onClick={() => setEditing(false)} className="text-muted-foreground hover:text-destructive">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Prénom</Label>
              <Input value={form.prenom} onChange={(e) => setField("prenom", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-sm font-medium">Nom</Label>
              <Input value={form.nom} onChange={(e) => setField("nom", e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Téléphone</Label>
            <Input value={form.telephone} onChange={(e) => setField("telephone", e.target.value)} className="mt-1.5" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Adresse</Label>
              <Input value={form.adresse} onChange={(e) => setField("adresse", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-sm font-medium">Ville</Label>
              <Input value={form.ville} onChange={(e) => setField("ville", e.target.value)} className="mt-1.5" />
            </div>
          </div>

          {isAgency && (
            <>
              <div>
                <Label className="text-sm font-medium">Nom de l'agence</Label>
                <Input value={form.nomAgence} onChange={(e) => setField("nomAgence", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-sm font-medium">Site web</Label>
                <Input value={form.siteWeb} onChange={(e) => setField("siteWeb", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <textarea value={form.description} onChange={(e) => setField("description", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </>
          )}

          {saveError && <p className="text-xs text-destructive">{saveError}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setEditing(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-white" disabled={saveMutation.isPending} data-testid="button-save-profile">
              {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      ) : (
        <>
          {saveSuccess && (
            <div className="flex items-center gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-4 py-2.5">
              <CheckCircle className="w-4 h-4" /> Profil mis à jour avec succès.
            </div>
          )}

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Informations personnelles
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon={User} label="Nom complet" value={`${user.prenom} ${user.nom}`} />
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Phone} label="Téléphone" value={user.telephone} />
              {user.adresse && <InfoRow icon={MapPin} label="Adresse" value={user.adresse} />}
              {user.ville && <InfoRow icon={MapPin} label="Ville" value={user.ville} />}
            </div>
          </div>

          {isAgency && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Informations professionnelles
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {user.nomAgence && <InfoRow icon={Building2} label="Agence" value={user.nomAgence} />}
                {user.rccm && <InfoRow icon={FileText} label="RCCM" value={user.rccm} />}
                {user.ncc && <InfoRow icon={FileText} label="NCC" value={user.ncc} />}
                {user.siteWeb && <InfoRow icon={Globe} label="Site web" value={user.siteWeb} />}
              </div>
              {user.description && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground/80">{user.description}</p>
                </div>
              )}
            </div>
          )}

          {(user.verificationStatus ?? user.verification_status) === "en_attente" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">Compte en cours de vérification</p>
                  <p className="text-xs text-yellow-700">Votre dossier et vos documents ont été soumis.</p>
                </div>
              </div>
            </div>
          )}
        </>
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
