import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, User, CheckCircle, ChevronRight, ChevronLeft, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { UserRole, UploadedDoc } from "@/lib/store";
import { authAPI, extractAuthTokens, setTokens, usersAPI } from "@/services/api";

function dataUrlToFile(dataUrl: string, filename: string, mimeType: string): File {
  const [, base64] = dataUrl.split(",");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mimeType });
}

const CI_PHONE_REGEX = /^(\+225)?0[0-9]{9}$/;

const step1Schema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z
    .string()
    .transform((v) => v.replace(/[\s.-]/g, ""))
    .refine(
      (v) => CI_PHONE_REGEX.test(v),
      "Numéro invalide. Format attendu : 0700000000 ou +2250700000000"
    ),
  motdepasse: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmation: z.string().min(8, "La confirmation est requise"),
}).refine((d) => d.motdepasse === d.confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmation"],
});

const step3ProprietaireSchema = z.object({
  type: z.enum(["particulier", "entreprise"]),
  adresse: z.string().min(5, "Adresse requise"),
  ville: z.string().min(2, "Ville requise"),
});

const step3AgentSchema = z.object({
  nomAgence: z.string().min(2, "Nom de l'agence requis"),
  rccm: z.string().min(5, "RCCM requis"),
  ncc: z.string().min(5, "NCC requis"),
  adresse: z.string().min(5, "Adresse requise"),
  ville: z.string().min(2, "Ville requise"),
  description: z.string().optional(),
  siteWeb: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;

const roles: { value: UserRole; label: string; desc: string; icon: typeof User }[] = [
  { value: "proprietaire", label: "Propriétaire", desc: "Je possède des biens immobiliers à gérer", icon: User },
  { value: "agence", label: "Agence immobilière", desc: "Je gère une agence avec des agents", icon: Building2 },
];

const proprietaireDocuments = [
  { key: "cni_recto", label: "CNI / Passeport (recto)", required: true },
  { key: "cni_verso", label: "CNI / Passeport (verso)", required: true },
];

const agentDocuments = [
  { key: "rccm_doc", label: "Registre de commerce (RCCM)", required: true },
  { key: "ncc_doc", label: "Numéro Contribuable (NCC)", required: true },
  { key: "cni_responsable", label: "Pièce d'identité du responsable", required: true },
  { key: "logo_agence", label: "Logo de l'agence (optionnel)", required: false },
];

export default function Inscription() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step3ProprietaireData, setStep3ProprietaireData] = useState<z.infer<typeof step3ProprietaireSchema> | null>(null);
  const [step3AgentData, setStep3AgentData] = useState<z.infer<typeof step3AgentSchema> | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Record<string, UploadedDoc>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register: reg1, handleSubmit: handleStep1, formState: { errors: e1 } } = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const { register: reg3p, handleSubmit: handleStep3p, formState: { errors: e3p } } = useForm<z.infer<typeof step3ProprietaireSchema>>({
    resolver: zodResolver(step3ProprietaireSchema), defaultValues: { type: "particulier" },
  });
  const { register: reg3a, handleSubmit: handleStep3a, formState: { errors: e3a } } = useForm<z.infer<typeof step3AgentSchema>>({
    resolver: zodResolver(step3AgentSchema),
  });

  const onStep1 = (data: Step1Data) => { setStep1Data(data); setStep(2); };
  const onStep3Proprietaire = (data: z.infer<typeof step3ProprietaireSchema>) => {
    setStep3ProprietaireData(data);
    setStep(4);
  };
  const onStep3Agent = (data: z.infer<typeof step3AgentSchema>) => {
    setStep3AgentData(data);
    setStep(4);
  };

  const handleDocUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setDocuments((prev) => ({
        ...prev,
        [key]: { name: file.name, type: file.type, dataUrl: reader.result as string },
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeDoc = (key: string) => {
    setDocuments((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleFinalSubmit = async () => {
    if (!step1Data || !selectedRole || submitting) return;
    setSubmitError("");

    if (selectedRole === "proprietaire" && !step3ProprietaireData) {
      setSubmitError("Complète les informations du propriétaire avant de valider.");
      return;
    }

    if (selectedRole === "agence" && !step3AgentData) {
      setSubmitError("Complète les informations de l'agence avant de valider.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await authAPI.register({
        email: step1Data.email,
        password: step1Data.motdepasse,
        password2: step1Data.confirmation,
        first_name: step1Data.prenom,
        last_name: step1Data.nom,
        phone: step1Data.telephone,
        user_type: selectedRole,
      });

      const tokens = extractAuthTokens(response);
      if (tokens.access || tokens.refresh) {
        setTokens(tokens);
      }

      if (selectedRole === "proprietaire" && step3ProprietaireData) {
        await usersAPI.updateProfilProprietaire({
          type_proprietaire: step3ProprietaireData.type,
          adresse: step3ProprietaireData.adresse,
          ville: step3ProprietaireData.ville,
        });

        const docsForm = new FormData();
        Object.entries(documents).forEach(([key, doc]) => {
          docsForm.append(key, dataUrlToFile(doc.dataUrl, doc.name, doc.type));
        });
        if (docsForm.has("cni_recto") || docsForm.has("cni_verso")) {
          await usersAPI.verifierProfilProprietaire(docsForm);
        }
      } else if (selectedRole === "agence" && step3AgentData) {
        await usersAPI.updateProfilAgence({
          nom_agence: step3AgentData.nomAgence,
          numero_registre_commerce: step3AgentData.rccm,
          numero_contribuable: step3AgentData.ncc,
          adresse: step3AgentData.adresse,
          ville: step3AgentData.ville,
          description: step3AgentData.description ?? "",
          site_web: step3AgentData.siteWeb ?? "",
        });

        const docsForm = new FormData();
        Object.entries(documents).forEach(([key, doc]) => {
          docsForm.append(key, dataUrlToFile(doc.dataUrl, doc.name, doc.type));
        });
        if (logoPreview) {
          docsForm.append("logo_agence", dataUrlToFile(logoPreview, "logo.png", "image/png"));
        }
        if ([...docsForm.keys()].length > 0) {
          await usersAPI.verifierProfilAgence(docsForm);
        }
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Inscription impossible. Vérifie l'API.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setLocation(`/verify-email?email=${encodeURIComponent(step1Data.email)}`);
  };

  const docList = selectedRole === "proprietaire" ? proprietaireDocuments : agentDocuments;

  const steps = ["Informations", "Rôle", "Profil", "Documents"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-16 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Créer votre compte</h1>
            <p className="text-muted-foreground">Rejoignez la communauté immobilière LogCiv</p>
          </div>

          {/* Progress */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex items-center min-w-max mx-auto justify-center gap-0">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${step > i + 1 ? "bg-primary text-white" : step === i + 1 ? "bg-primary text-white ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                      {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${step === i + 1 ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`h-0.5 w-12 mx-2 mb-4 transition-colors ${step > i + 1 ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-7 shadow-sm">
            {submitError && (
              <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}
            {/* Step 1 */}
            {step === 1 && (
              <form onSubmit={handleStep1(onStep1)} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nom *</Label>
                    <Input placeholder="Kouassi" {...reg1("nom")} data-testid="input-nom" className="mt-1.5" />
                    {e1.nom && <p className="text-xs text-destructive mt-1">{e1.nom.message}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Prénom *</Label>
                    <Input placeholder="Jean" {...reg1("prenom")} data-testid="input-prenom" className="mt-1.5" />
                    {e1.prenom && <p className="text-xs text-destructive mt-1">{e1.prenom.message}</p>}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email *</Label>
                  <Input type="email" placeholder="jean.kouassi@gmail.com" {...reg1("email")} data-testid="input-email" className="mt-1.5" />
                  {e1.email && <p className="text-xs text-destructive mt-1">{e1.email.message}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium">Téléphone *</Label>
                  <Input placeholder="+2250700000000" {...reg1("telephone")} data-testid="input-telephone" className="mt-1.5" />
                  {e1.telephone && <p className="text-xs text-destructive mt-1">{e1.telephone.message}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium">Mot de passe * (min. 8 caractères)</Label>
                  <Input type="password" placeholder="••••••••" {...reg1("motdepasse")} data-testid="input-password" className="mt-1.5" />
                  {e1.motdepasse && <p className="text-xs text-destructive mt-1">{e1.motdepasse.message}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium">Confirmer le mot de passe *</Label>
                  <Input type="password" placeholder="••••••••" {...reg1("confirmation")} data-testid="input-confirm-password" className="mt-1.5" />
                  {e1.confirmation && <p className="text-xs text-destructive mt-1">{e1.confirmation.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-primary text-white gap-2 mt-2" data-testid="button-next-step1">
                  Suivant <ChevronRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-5">Choisissez votre profil</h2>
                <div className="space-y-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button key={role.value} type="button"
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${selectedRole === role.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"}`}
                        onClick={() => setSelectedRole(role.value)} data-testid={`card-role-${role.value}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedRole === role.value ? "bg-primary" : "bg-muted"}`}>
                          <Icon className={`w-5 h-5 ${selectedRole === role.value ? "text-white" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{role.label}</p>
                          <p className="text-sm text-muted-foreground">{role.desc}</p>
                        </div>
                        {selectedRole === role.value && <CheckCircle className="w-5 h-5 text-primary ml-auto" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-4 h-4" /> Retour
                  </Button>
                  <Button className="flex-1 bg-primary text-white gap-2" disabled={!selectedRole} onClick={() => selectedRole && setStep(3)} data-testid="button-next-step2">
                    Suivant <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 — Propriétaire */}
            {step === 3 && selectedRole === "proprietaire" && (
              <form onSubmit={handleStep3p(onStep3Proprietaire)} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-2">Informations propriétaire</h2>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Type *</Label>
                  <div className="flex gap-4">
                    {[{ value: "particulier", label: "Particulier" }, { value: "entreprise", label: "Entreprise" }].map((t) => (
                      <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value={t.value} {...reg3p("type")} className="accent-primary" />
                        <span className="text-sm">{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Adresse *</Label>
                  <Input placeholder="Cocody Angré 8e tranche" {...reg3p("adresse")} className="mt-1.5" />
                  {e3p.adresse && <p className="text-xs text-destructive mt-1">{e3p.adresse.message}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium">Ville *</Label>
                  <Input placeholder="Abidjan" {...reg3p("ville")} className="mt-1.5" />
                  {e3p.ville && <p className="text-xs text-destructive mt-1">{e3p.ville.message}</p>}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1 gap-2" onClick={() => setStep(2)}>
                    <ChevronLeft className="w-4 h-4" /> Retour
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary text-white gap-2">
                    Suivant <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3 — Agence */}
            {step === 3 && selectedRole === "agence" && (
              <form onSubmit={handleStep3a(onStep3Agent)} className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-foreground">Informations de l'agence</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20">Agence</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nom de l'agence *</Label>
                  <Input placeholder="Abidjan Immobilier Plus" {...reg3a("nomAgence")} className="mt-1.5" />
                  {e3a.nomAgence && <p className="text-xs text-destructive mt-1">{e3a.nomAgence.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">RCCM *</Label>
                    <Input placeholder="CI-ABJ-2024-B-12345" {...reg3a("rccm")} className="mt-1.5" />
                    {e3a.rccm && <p className="text-xs text-destructive mt-1">{e3a.rccm.message}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">NCC *</Label>
                    <Input placeholder="NCC-2024-001234" {...reg3a("ncc")} className="mt-1.5" />
                    {e3a.ncc && <p className="text-xs text-destructive mt-1">{e3a.ncc.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Adresse *</Label>
                    <Input placeholder="Marcory Zone 4" {...reg3a("adresse")} className="mt-1.5" />
                    {e3a.adresse && <p className="text-xs text-destructive mt-1">{e3a.adresse.message}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Ville *</Label>
                    <Input placeholder="Abidjan" {...reg3a("ville")} className="mt-1.5" />
                    {e3a.ville && <p className="text-xs text-destructive mt-1">{e3a.ville.message}</p>}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <textarea placeholder="Agence spécialisée dans la vente et location de biens" {...reg3a("description")}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Site web (optionnel)</Label>
                  <Input placeholder="https://www.monagence.ci" {...reg3a("siteWeb")} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Logo de l'agence</Label>
                  <label className="mt-1.5 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-5 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Cliquez pour uploader votre logo</p>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) { const r = new FileReader(); r.onload = () => setLogoPreview(r.result as string); r.readAsDataURL(file); }
                      }} />
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1 gap-2" onClick={() => setStep(2)}>
                    <ChevronLeft className="w-4 h-4" /> Retour
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary text-white gap-2">
                    Suivant <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 4 — Documents */}
            {step === 4 && (
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-foreground mb-1">Vérification & Documents</h2>
                  <p className="text-sm text-muted-foreground">
                    Ces documents sont analysés automatiquement par notre système de vérification IA afin de sécuriser la plateforme.
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-5 text-sm">
                  <p className="font-medium text-foreground mb-1">Statut après inscription :</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-3 py-0.5 text-xs font-medium">
                      Analyse IA en cours
                    </span>
                    <span className="text-muted-foreground">— vous serez notifié dès que vos documents sont validés</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {docList.map((doc) => {
                    const uploaded = documents[doc.key];
                    const isImage = uploaded?.type.startsWith("image/");
                    return (
                      <div key={doc.key} className="border border-border rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{doc.label}</span>
                            {doc.required ? (
                              <span className="text-xs text-destructive">* requis</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">optionnel</span>
                            )}
                          </div>
                          {uploaded && (
                            <button onClick={() => removeDoc(doc.key)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {uploaded ? (
                          <div className="p-4 flex items-center gap-4">
                            {isImage ? (
                              <img src={uploaded.dataUrl} alt={uploaded.name} className="w-16 h-16 object-cover rounded-lg border border-border" />
                            ) : (
                              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border border-border">
                                <FileText className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{uploaded.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{isImage ? "Image" : "Document PDF"}</p>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-accent" />
                                <span className="text-xs text-accent font-medium">Uploadé</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-2 p-6 cursor-pointer hover:bg-muted/20 transition-colors" data-testid={`upload-${doc.key}`}>
                            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                              {doc.key.includes("logo") || doc.key.includes("cni") || doc.key.includes("selfie") ? (
                                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <FileText className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">Glissez-déposez ou <span className="text-primary font-medium">cliquez pour uploader</span></p>
                            <p className="text-xs text-muted-foreground">PDF, PNG, JPG jusqu'à 10 MB</p>
                            <input type="file" accept="image/*,.pdf" className="hidden"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocUpload(doc.key, f); }} />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" className="flex-1 gap-2" onClick={() => setStep(3)}>
                    <ChevronLeft className="w-4 h-4" /> Retour
                  </Button>
                  <Button type="button" className="flex-1 bg-primary text-white font-semibold" onClick={handleFinalSubmit} disabled={submitting} data-testid="button-final-submit">
                    {submitting ? "Envoi en cours..." : "Valider l'inscription"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Déjà un compte ?{" "}
            <a href="/connexion" className="text-primary font-medium hover:underline">Se connecter</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}


