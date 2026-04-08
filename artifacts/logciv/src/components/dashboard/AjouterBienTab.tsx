import { useState } from "react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Upload, X, Image as ImageIcon, MapPin, Building2, Wrench } from "lucide-react";
import LimitExceededDialog from "@/components/LimitExceededDialog";
import { PRICING_PLANS } from "@/types/pricing";

const EQUIPEMENTS = [
  "Climatisation", "Wifi", "Cuisine équipée", "Groupe électrogène",
  "Piscine", "Gardiennage", "Sécurité 24h/24", "Ascenseur", "Balcon",
  "Terrasse", "Parking gardé", "Interphone",
];

const COMMUNES = ["Cocody", "Yopougon", "Marcory", "Bingerville", "Plateau", "Adjame", "Treichville", "Koumassi", "Angré", "Riviera"];
const QUARTIERS: Record<string, string[]> = {
  Cocody: ["Angré", "Riviera 3", "Riviera Palmeraie", "II Plateaux", "Blockhaus"],
  Yopougon: ["Sicogi", "Selmer", "Niangon", "Wassakara"],
  Marcory: ["Zone 4", "Anoumabo", "Biétry"],
  Plateau: ["Zone 4C", "Centre commercial"],
  Bingerville: ["Résidence Palmier", "Centre-ville"],
};

interface FormData {
  titre: string; type: string; categorie: string; prix: string;
  negociable: boolean; pays: string; ville: string; commune: string;
  quartier: string; adressePrecise: string; pieces: string; chambres: string;
  sallesDeBain: string; superficie: string; etage: string; parking: boolean;
  meuble: boolean; equipements: string[]; description: string; statut: string;
}

const init: FormData = {
  titre: "", type: "Appartement", categorie: "Location", prix: "", negociable: false,
  pays: "Côte d'Ivoire", ville: "Abidjan", commune: "Cocody", quartier: "Angré",
  adressePrecise: "", pieces: "", chambres: "", sallesDeBain: "", superficie: "",
  etage: "", parking: false, meuble: false, equipements: [], description: "", statut: "disponible",
};

export default function AjouterBienTab({ onSuccess }: { onSuccess: () => void }) {
  const { currentUser } = useAuth();
  const { addProperty, getUserSubscription, getUserPropertiesCount } = useStore();
  const [form, setForm] = useState<FormData>(init);
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const subscription = currentUser ? getUserSubscription(currentUser.id) : null;
  const propertiesCount = currentUser ? getUserPropertiesCount(currentUser.id) : 0;
  const canAdd = subscription ? propertiesCount < subscription.maxProperties : false;

  const set = (key: keyof FormData, val: unknown) => setForm((prev) => ({ ...prev, [key]: val }));

  const toggleEquipement = (eq: string) => {
    setForm((prev) => ({
      ...prev,
      equipements: prev.equipements.includes(eq)
        ? prev.equipements.filter((e) => e !== eq)
        : [...prev.equipements, eq],
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.titre.trim()) errs.titre = "Titre requis";
    if (!form.prix || isNaN(Number(form.prix)) || Number(form.prix) <= 0) errs.prix = "Prix valide requis";
    if (!form.description.trim()) errs.description = "Description requise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check limit first
    if (!canAdd) {
      setShowLimitDialog(true);
      return;
    }
    
    if (!validate() || !currentUser) return;
    addProperty({
      ownerId: currentUser.id,
      titre: form.titre,
      type: form.type as "Appartement" | "Villa" | "Bureau" | "Terrain" | "Studio" | "Maison",
      categorie: form.categorie as "Location" | "Vente",
      prix: Number(form.prix),
      negociable: form.negociable,
      pays: form.pays,
      ville: form.ville,
      commune: form.commune,
      quartier: form.quartier,
      adressePrecise: form.adressePrecise,
      pieces: form.pieces ? Number(form.pieces) : undefined,
      chambres: form.chambres ? Number(form.chambres) : undefined,
      sallesDeBain: form.sallesDeBain ? Number(form.sallesDeBain) : undefined,
      superficie: form.superficie ? Number(form.superficie) : undefined,
      etage: form.etage ? Number(form.etage) : undefined,
      parking: form.parking,
      meuble: form.meuble,
      equipements: form.equipements,
      description: form.description,
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"],
      statut: form.statut as "disponible" | "reserve" | "indisponible",
    });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm(init); setImages([]); onSuccess(); }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Bien publié avec succès !</h3>
          <p className="text-sm text-muted-foreground">Redirection vers vos biens...</p>
        </div>
      </div>
    );
  }

  const communeQuartiers = QUARTIERS[form.commune] ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Ajouter un bien</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Remplissez les informations de votre bien immobilier</p>
      </div>

      {/* Plan Info Banner */}
      {subscription && (
        <div className={`rounded-lg border p-4 ${!canAdd ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200"}`}>
          <p className="text-sm font-medium text-gray-900">
            Plan actuel: <span className="font-bold">{subscription.planId === "free" ? "Gratuit" : subscription.planId}</span>
          </p>
          <p className="text-sm text-gray-700 mt-1">
            Annonces utilisées: <span className="font-bold">{propertiesCount}/{subscription.maxProperties}</span>
          </p>
          {!canAdd && (
            <p className="text-sm text-orange-700 mt-2 font-medium">
              ⚠️ Vous avez atteint la limite. Passez à Premium pour continuer.
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1 — Infos générales */}
        <Section icon={Building2} title="Informations générales">
          <div>
            <Label className="text-sm font-medium">Titre de l'annonce *</Label>
            <Input placeholder="Appartement 3 pièces à Cocody Angré" value={form.titre}
              onChange={(e) => set("titre", e.target.value)} className="mt-1.5" data-testid="input-titre" />
            {errors.titre && <p className="text-xs text-destructive mt-1">{errors.titre}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Type de bien</Label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)}
                className="mt-1.5 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                {["Appartement", "Villa", "Maison", "Bureau", "Terrain", "Studio"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Catégorie</Label>
              <select value={form.categorie} onChange={(e) => set("categorie", e.target.value)}
                className="mt-1.5 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Location</option>
                <option>Vente</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Prix (FCFA) *</Label>
              <Input type="number" placeholder="250000" value={form.prix}
                onChange={(e) => set("prix", e.target.value)} className="mt-1.5" data-testid="input-prix" />
              {errors.prix && <p className="text-xs text-destructive mt-1">{errors.prix}</p>}
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer mt-6">
                <input type="checkbox" checked={form.negociable} onChange={(e) => set("negociable", e.target.checked)}
                  className="accent-primary w-4 h-4" />
                <span className="text-sm">Prix négociable</span>
              </label>
            </div>
          </div>
        </Section>

        {/* Section 2 — Localisation */}
        <Section icon={MapPin} title="Localisation">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Pays</Label>
              <Input value={form.pays} readOnly className="mt-1.5 bg-muted/30" />
            </div>
            <div>
              <Label className="text-sm font-medium">Ville</Label>
              <Input value={form.ville} readOnly className="mt-1.5 bg-muted/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Commune</Label>
              <select value={form.commune} onChange={(e) => { set("commune", e.target.value); set("quartier", ""); }}
                className="mt-1.5 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                {COMMUNES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Quartier</Label>
              <select value={form.quartier} onChange={(e) => set("quartier", e.target.value)}
                className="mt-1.5 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                {(communeQuartiers.length > 0 ? communeQuartiers : ["Centre-ville"]).map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Adresse précise</Label>
            <Input placeholder="Résidence Les Palmiers, Bâtiment A" value={form.adressePrecise}
              onChange={(e) => set("adressePrecise", e.target.value)} className="mt-1.5" />
          </div>
        </Section>

        {/* Section 3 — Caractéristiques */}
        <Section icon={Building2} title="Caractéristiques">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <NumInput label="Pièces" value={form.pieces} onChange={(v) => set("pieces", v)} placeholder="3" />
            <NumInput label="Chambres" value={form.chambres} onChange={(v) => set("chambres", v)} placeholder="2" />
            <NumInput label="Salles de bain" value={form.sallesDeBain} onChange={(v) => set("sallesDeBain", v)} placeholder="2" />
            <NumInput label="Superficie (m²)" value={form.superficie} onChange={(v) => set("superficie", v)} placeholder="85" />
            <NumInput label="Étage" value={form.etage} onChange={(v) => set("etage", v)} placeholder="0" />
          </div>
          <div className="flex gap-6 pt-1">
            <CheckItem label="Parking" checked={form.parking} onChange={(v) => set("parking", v)} />
            <CheckItem label="Meublé" checked={form.meuble} onChange={(v) => set("meuble", v)} />
          </div>
        </Section>

        {/* Section 4 — Équipements */}
        <Section icon={Wrench} title="Équipements">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EQUIPEMENTS.map((eq) => (
              <label key={eq} className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${form.equipements.includes(eq) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                <input type="checkbox" checked={form.equipements.includes(eq)} onChange={() => toggleEquipement(eq)}
                  className="accent-primary w-4 h-4" />
                <span className="text-sm">{eq}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* Section 5 — Description */}
        <Section icon={Building2} title="Description">
          <div>
            <textarea
              placeholder="Appartement moderne avec balcon, situé dans un quartier sécurisé. Idéal pour une famille..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid="textarea-description"
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>
        </Section>

        {/* Section 6 — Médias */}
        <Section icon={ImageIcon} title="Photos du bien">
          <label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground font-medium">Glissez-déposez vos photos</p>
              <p className="text-xs text-muted-foreground mt-0.5">ou <span className="text-primary">cliquez pour sélectionner</span> · JPG, PNG jusqu'à 10 MB</p>
            </div>
            <input type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)} data-testid="input-images" />
          </label>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={img} alt={`photo-${i}`} className="w-full h-full object-cover rounded-lg border border-border" />
                  <button type="button"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
                    onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Section 7 — Statut */}
        <Section icon={CheckCircle} title="Statut du bien">
          <div className="flex gap-4 flex-wrap">
            {[
              { value: "disponible", label: "Disponible", cls: "border-green-200 bg-green-50 text-green-700" },
              { value: "reserve", label: "Réservé", cls: "border-yellow-200 bg-yellow-50 text-yellow-700" },
              { value: "indisponible", label: "Indisponible", cls: "border-gray-200 bg-gray-50 text-gray-600" },
            ].map((s) => (
              <label key={s.value} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${form.statut === s.value ? s.cls + " border-2" : "border-border hover:border-primary/40"}`}>
                <input type="radio" name="statut" value={s.value} checked={form.statut === s.value}
                  onChange={() => set("statut", s.value)} className="accent-primary" />
                <span className="text-sm font-medium">{s.label}</span>
              </label>
            ))}
          </div>
        </Section>

        <Button 
          type="submit" 
          disabled={!canAdd}
          className={`w-full text-white font-semibold py-3 text-base gap-2 ${!canAdd ? "bg-gray-400 cursor-not-allowed" : "bg-primary"}`} 
          data-testid="button-publier-bien"
        >
          <CheckCircle className="w-5 h-5" /> Publier le bien
        </Button>
      </form>

      {/* Limit Exceeded Dialog */}
      <LimitExceededDialog
        open={showLimitDialog}
        onOpenChange={setShowLimitDialog}
        currentCount={propertiesCount}
        maxCount={subscription?.maxProperties || 3}
        currentPlan={subscription?.planId === "free" ? "Gratuit" : subscription?.planId || "Gratuit"}
      />
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" /> {title}
      </h3>
      {children}
    </div>
  );
}

function NumInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <Input type="number" min="0" placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} className="mt-1.5" />
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-primary w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}
