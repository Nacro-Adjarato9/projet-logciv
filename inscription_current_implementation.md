# Parcours d'Inscription Actuel - LogCiv

**Fichier source** : `src/pages/Inscription.tsx`

---

## 📋 Vue d'ensemble

Le formulaire d'inscription actuellement implémenté est **multi-étapes (4 étapes)** avec progression visuelle.

```
┌─────────────────────────────────────────────────────────┐
│  Étape 1: Informations                                 │
│  Étape 2: Rôle                                         │
│  Étape 3: Profil                                       │
│  Étape 4: Documents                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Étape 1 : Informations Personnelles

### URL
`/inscription` (page 1/4)

### Formulaire
```
┌─────────────────────────────────────┐
│  Créer votre compte                 │
│  Rejoignez la communauté LogCiv     │
│                                     │
│  Informations personnelles          │
│  ════════════════════════════════   │
│                                     │
│  Nom *                              │
│  [Kouassi____________]              │
│                                     │
│  Prénom *                           │
│  [Jean_____________]                │
│                                     │
│  Email *                            │
│  [jean.kouassi@gmail.com__________] │
│                                     │
│  Téléphone *                        │
│  [+2250700000000__________]         │
│                                     │
│  Mot de passe * (min 8 chars)       │
│  [••••••••___________________]       │
│                                     │
│  Confirmer le mot de passe *        │
│  [••••••••___________________]       │
│                                     │
│  [Suivant →]                        │
└─────────────────────────────────────┘
```

### Validation (Zod Schema)
```javascript
const step1Schema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(8),
  motdepasse: z.string().min(8),
  confirmation: z.string().min(8),
}).refine((d) => d.motdepasse === d.confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmation"],
});
```

### Messages d'erreur
- Nom/Prénom : "Le nom doit contenir au moins 2 caractères"
- Email : "Email invalide"
- Téléphone : "Numéro de téléphone invalide"
- Mot de passe : "Le mot de passe doit contenir au moins 8 caractères"
- Confirmation : "La confirmation est requise"
- Mots de passe non-matching : "Les mots de passe ne correspondent pas"

### Actions
- Click "Suivant" :
  - Valide les champs
  - Sauvegarde `step1Data` en state
  - Go to Étape 2

---

## 🎯 Étape 2 : Choix du Rôle

### Page
Étape 2/4 avec progression visuelle

### Interface
Trois cartes sélectionnables :

```
┌─────────────────────────────────────────────────────────┐
│  Choisissez votre profil                                │
│                                                         │
│  [👤 Propriétaire]                                      │
│  Je possède des biens immobiliers à gérer               │
│  ✓ (si sélectionné)                                     │
│                                                         │
│  [💼 Agent immobilier]                                  │
│  Je suis un agent professionnel                         │
│                                                         │
│  [🏢 Agence immobilière]                                │
│  Je gère une agence avec des agents                     │
│                                                         │
│  [← Retour]  [Suivant →]                                │
└─────────────────────────────────────────────────────────┘
```

### Rôles disponibles
```javascript
const roles = [
  { 
    value: "proprietaire",
    label: "Propriétaire",
    desc: "Je possède des biens immobiliers à gérer",
    icon: User
  },
  { 
    value: "agent",
    label: "Agent immobilier",
    desc: "Je suis un agent professionnel",
    icon: Briefcase
  },
  { 
    value: "agence",
    label: "Agence immobilière",
    desc: "Je gère une agence avec des agents",
    icon: Building2
  },
];
```

### Styles visuels
- **Non-sélectionné** : bordure grise, fond par défaut
- **Hover** : bordure primaire, fond légèrement grisé
- **Sélectionné** : bordure primaire, fond primaire/5, icône en blanc, badge "✓"

### Actions
- Click rôle → `setSelectedRole(role.value)`
- Click "Retour" → Go to Étape 1
- Click "Suivant" :
  - Valide sélection (disabled si aucun rôle)
  - Go to Étape 3 (selon rôle)

---

## 🎯 Étape 3 : Profil Détaillé

Deux versions selon le rôle sélectionné à l'étape 2.

### 3a) PROPRIÉTAIRE

**URL** : Étape 3/4 (Propriétaire)

**Formulaire** :
```
┌─────────────────────────────────────┐
│  Informations propriétaire          │
│                                     │
│  Type *                             │
│  ◉ Particulier ○ Entreprise        │
│                                     │
│  Adresse *                          │
│  [Cocody Angré 8e tranche_______]   │
│                                     │
│  Ville *                            │
│  [Abidjan___________________]        │
│                                     │
│  [← Retour] [Suivant →]             │
└─────────────────────────────────────┘
```

**Validation (Zod)**
```javascript
const step3ProprietaireSchema = z.object({
  type: z.enum(["particulier", "entreprise"]),
  adresse: z.string().min(5),
  ville: z.string().min(2),
});
```

**Messages erreur** :
- Type : (obligatoire, défaut "particulier")
- Adresse : "Adresse requise"
- Ville : "Ville requise"

**Actions** :
- Click "Retour" → Go to Étape 2
- Click "Suivant" :
  - Valide champs
  - Sauvegarde `step3ProData`
  - Go to Étape 4

---

### 3b) AGENT / AGENCE

**URL** : Étape 3/4 (Agent ou Agence)

**Badge** : Affiche "Agent" ou "Agence" en badge bleu

**Formulaire** :
```
┌─────────────────────────────────────────────┐
│  Informations [Agent|Agence] 🏷️             │
│                                             │
│  Nom de l'agence *                          │
│  [Abidjan Immobilier Plus_____________]     │
│                                             │
│  RCCM *                     NCC *            │
│  [CI-ABJ-2024-B-12345] [NCC-2024-001234]    │
│                                             │
│  Adresse *                  Ville *          │
│  [Marcory Zone 4_____]  [Abidjan_______]    │
│                                             │
│  Description                                │
│  [Agence spécialisée dans...]               │
│  [____________________________]              │
│                                             │
│  Site web (optionnel)                       │
│  [https://www.monagence.ci___________]      │
│                                             │
│  Logo de l'agence                           │
│  [🖼️ Cliquez pour uploader logo]             │
│  (JPG, PNG - max 2MB)                       │
│                                             │
│  [← Retour] [Suivant →]                     │
└─────────────────────────────────────────────┘
```

**Validation (Zod)**
```javascript
const step3AgentSchema = z.object({
  nomAgence: z.string().min(2),
  rccm: z.string().min(5),
  ncc: z.string().min(5),
  adresse: z.string().min(5),
  ville: z.string().min(2),
  description: z.string().optional(),
  siteWeb: z.string().optional(),
});
```

**Messages erreur** :
- Nom agence : "Nom de l'agence requis"
- RCCM : "RCCM requis"
- NCC : "NCC requis"
- Adresse : "Adresse requise"
- Ville : "Ville requise"

**Logo upload** :
- Click zone → File picker
- Formats : JPG, PNG (max 2MB)
- Preview image affiché en miniature
- Sauvegardé en `logoPreview` (data URL)

**Actions** :
- Click "Retour" → Go to Étape 2
- Click "Suivant" :
  - Valide champs
  - Sauvegarde `step3AgData` + `logoPreview`
  - Go to Étape 4

---

## 🎯 Étape 4 : Documents

**URL** : Étape 4/4

**En-tête** :
```
Vérification & Documents
Ces documents permettent de sécuriser la plateforme 
et de garantir la fiabilité des annonces.

⚠️ Statut après inscription :
   [⏳ En attente de validation]
   — Vous serez notifié une fois validé
```

### Documents - PROPRIÉTAIRE

```javascript
const proprietaireDocuments = [
  { key: "cni_recto", label: "CNI / Passeport (recto)", required: true },
  { key: "cni_verso", label: "CNI / Passeport (verso)", required: true },
  { key: "justif_propriete", label: "Justificatif de propriété / Contrat", required: false },
  { key: "selfie_cni", label: "Selfie avec pièce d'identité", required: false },
  { key: "facture_cie", label: "Facture CIE / SODECI (optionnel)", required: false },
];
```

### Documents - AGENT / AGENCE

```javascript
const agentDocuments = [
  { key: "rccm_doc", label: "Registre de commerce (RCCM)", required: true },
  { key: "ncc_doc", label: "Numéro Contribuable (NCC)", required: true },
  { key: "cni_responsable", label: "Pièce d'identité du responsable", required: true },
  { key: "autorisation", label: "Autorisation d'exercer", required: true },
  { key: "logo_agence", label: "Logo de l'agence (optionnel)", required: false },
];
```

### Interface Document Upload

**Pour chaque document** :
```
┌────────────────────────────────────┐
│ CNI / Passeport (recto) * requis   │ [X supprimer]
├────────────────────────────────────┤
│ 📄 [fichier.pdf]                   │
│ Document PDF                       │
│ ✓ Uploadé                          │
└────────────────────────────────────┘

ou (avant upload)

┌────────────────────────────────────┐
│ CNI / Passeport (recto) * requis   │
├────────────────────────────────────┤
│ 🖼️ Glissez-déposez ou cliquez      │
│    pour uploader                   │
│ PDF, PNG, JPG jusqu'à 10 MB        │
└────────────────────────────────────┘
```

**Fonctionnalités** :
- Upload via click ou drag-drop
- Preview image si image uploadée
- Icône PDF si fichier PDF
- Bouton suppression (X) si déjà uploadé
- Validations :
  - Formats acceptés : JPG, PNG, PDF
  - Taille max : 10 MB
  - Requis vs optionnel indiqué

**État upload** :
```javascript
const [documents, setDocuments] = useState<Record<string, UploadedDoc>>({});

interface UploadedDoc {
  name: string;
  type: string;
  dataUrl: string; // Base64
}
```

---

## ✅ Page Succès

**Après submit final** :
```
┌─────────────────────────────────────┐
│  ✓ Inscription réussie !            │
│                                     │
│  Votre dossier a été soumis pour    │
│  vérification.                      │
│                                     │
│  ⚠️ Votre compte est en cours       │
│     de vérification.                │
│     Vous serez validé sous peu et   │
│     pourrez ensuite publier vos     │
│     biens.                          │
│                                     │
│  Redirection vers connexion...      │
└─────────────────────────────────────┘
```

**Délai** : 3 secondes puis redirect vers `/connexion`

---

## 🔄 Flux Complet

```
Étape 1 (Infos de base)
    ↓ [Suivant]
Étape 2 (Choisir rôle)
    ↓ [Suivant]
Étape 3 (Profil détaillé)
    ├─ Si Propriétaire
    │  └─ Type + Adresse + Ville
    └─ Si Agent/Agence
       └─ Nom + RCCM + NCC + Adresse + Description + Logo
    ↓ [Suivant]
Étape 4 (Documents)
    └─ Upload documents (selon rôle)
    ↓ [Valider]
Success page (3sec)
    ↓
Redirect /connexion
```

---

## 📊 Data Structure (Zod)

```javascript
// Après inscription complète
{
  step1Data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    motdepasse: string;
  },
  selectedRole: "proprietaire" | "agent" | "agence";
  step3ProData?: {
    type: "particulier" | "entreprise";
    adresse: string;
    ville: string;
  };
  step3AgData?: {
    nomAgence: string;
    rccm: string;
    ncc: string;
    adresse: string;
    ville: string;
    description?: string;
    siteWeb?: string;
  };
  logoPreview?: string; // base64
  documents: Record<string, {
    name: string;
    type: string;
    dataUrl: string; // base64
  }>;
}
```

---

## 🎨 Composants Utilisés

- `Button` (custom UI)
- `Input` (custom UI)
- `Label` (custom UI)
- `Badge` (custom UI)
- `Navbar` (composant)
- `Footer` (composant)
- Icons : `CheckCircle`, `ChevronRight`, `ChevronLeft`, `Upload`, `X`, `FileText`, `ImageIcon`, `User`, `Briefcase`, `Building2`

---

## 📱 Responsive

- Utilisé `max-w-2xl` pour centrer le formulaire
- Grille 2 colonnes sur desktop (`grid grid-cols-2 gap-4`)
- Stack single column sur mobile
- Padding responsive

---

## 🔌 API Integration

**Actuellement** : Aucun appel API
- Données sauvegardées en state local
- Au submit final : appelle `useStore((s) => s.register)` 
- Pas de vraie requête POST `/auth/register/` encore

**À implémenter** :
```javascript
const handleFinalSubmit = () => {
  // TODO: API POST /auth/register/
  // await authAPI.register({
  //   email, password, nom, prenom, telephone,
  //   role, documents, ...
  // })
}
```

---

## 🧪 Data-testid

Pour les tests (Playwright/Vitest) :
- `input-nom`
- `input-prenom`
- `input-email`
- `input-telephone`
- `input-password`
- `input-confirm-password`
- `button-next-step1`
- `card-role-proprietaire`
- `card-role-agent`
- `card-role-agence`
- `button-next-step2`
- `upload-cni_recto` (etc. pour chaque doc)
- `button-final-submit`
