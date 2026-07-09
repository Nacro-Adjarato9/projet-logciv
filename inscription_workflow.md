# Parcours d'Inscription - Propriétaire & Agence Immobilière

---

## 1. INSCRIPTION PROPRIÉTAIRE IMMOBILIER

### 1.1 Page Accueil Inscription
**URL** : `/inscription`

Deux boutons :
- 🏠 **Je suis Propriétaire**
- 🏢 **Je suis Agence**

---

### 1.2 Flux Propriétaire - Étape 1 : Informations de Base

**Formulaire** :

```
┌─────────────────────────────────────┐
│  Inscription - Propriétaire         │
│  Étape 1/3                          │
└─────────────────────────────────────┘

Email *
[________________@example.com___________]
Explication: Vous recevrez un lien de vérification

Mot de passe *
[_____________________________]
Explication: Minimum 8 caractères, 1 majuscule, 1 chiffre

Confirmer mot de passe *
[_____________________________]

Prénom *
[_____________________]

Nom *
[_____________________]

Téléphone *
[_____________________]
Format: +33 6 12 34 56 78

─────────────────────────────
 [Précédent]           [Suivant]
```

**Validations** :
- Email : format valide + unique en BDD
- Mot de passe : min 8 chars, 1 majuscule, 1 chiffre, 1 caractère spécial
- Prénom/Nom : min 2 caractères
- Téléphone : format international

**Actions** :
- Click "Suivant" → Étape 2

---

### 1.3 Flux Propriétaire - Étape 2 : Adresse & Documents

**Formulaire** :

```
┌─────────────────────────────────────┐
│  Inscription - Propriétaire         │
│  Étape 2/3                          │
└─────────────────────────────────────┘

Adresse personnelle *
[_________________________________]

Ville *
[_________________________________]

Code Postal *
[________]

Pays *
[France ▼]

Pièce d'identité * (pour vérification)
┌─────────────────────────────┐
│ 📎 Ajouter document         │
│                             │
│ (Cliquez pour uploader)      │
│ Formats: JPG, PNG, PDF      │
│ Taille max: 5MB             │
└─────────────────────────────┘
☐ Recto-verso ou 2 fichiers distincts

─────────────────────────────
 [Précédent]           [Suivant]
```

**Validations** :
- Adresse : min 5 caractères
- Code postal : 5 chiffres
- Pièce d'identité : fichier uploadé requis

**Fichiers acceptés** :
- Carte d'identité (recto-verso)
- Passeport
- Permis de conduire
- Formats : JPG, PNG, PDF
- Max 5MB par fichier

**Actions** :
- Click "Ajouter document" → dialog upload
- Click "Suivant" → Étape 3

---

### 1.4 Flux Propriétaire - Étape 3 : Profil & Conditions

**Formulaire** :

```
┌─────────────────────────────────────┐
│  Inscription - Propriétaire         │
│  Étape 3/3                          │
└─────────────────────────────────────┘

Biographie (optionnel)
[_________________________________]
[_________________________________]
(max 500 caractères)
Présentez-vous brièvement aux locataires

Avatar (optionnel)
┌─────────────────────────────┐
│ 📸 Choisir une photo        │
│                             │
│ (JPG, PNG - max 2MB)        │
└─────────────────────────────┘

Numéro SIRET (optionnel)
[__________________]
Si activité professionnelle

Conditions d'utilisation *
☑ J'accepte les conditions générales
☑ J'accepte la politique de confidentialité
☑ J'accepte les conditions tarifaires
☑ J'autorise les communications marketing

─────────────────────────────
 [Précédent]      [Créer compte]
```

**Validations** :
- Au moins 1 condition acceptée (obligatoire pour continuer)
- Conditions d'utilisation (obligatoire)
- Politique de confidentialité (obligatoire)

**Actions** :
- Click "Créer compte" → 
  - API POST `/auth/register/` (type: "proprietaire")
  - Validation en backend
  - Email de vérification envoyé
  - Redirect vers page "Vérification email"

---

### 1.5 Étape 4 : Vérification Email

**Page de confirmation** :

```
┌─────────────────────────────────────┐
│   Vérifiez votre email              │
└─────────────────────────────────────┘

✉️ Un email a été envoyé à :
   proprietaire@example.com

Cliquez sur le lien dans l'email pour
activer votre compte.

⏱️ Lien valide 24 heures

[N'avez pas reçu l'email?]
[Renvoyer l'email]

─────────────────────────────
Après vérification, vous accèderez à
votre dashboard propriétaire
```

**Processus** :
1. Email reçu avec lien : `/verify-email?token=xxxxx`
2. Click lien → token vérifié en backend
3. Compte activé
4. Redirect vers Dashboard

---

### 1.6 Résumé Inscription Propriétaire

| Étape | Contenu | Temps |
|-------|---------|-------|
| 1 | Email, Mdp, Prénom, Nom, Tel | 2 min |
| 2 | Adresse, Ville, CP, Pièce ID | 3 min |
| 3 | Bio, Avatar, SIRET, Conditions | 2 min |
| 4 | Vérif email | 1 min |
| **Total** | **Inscription complète** | **~8 min** |

---

---

## 2. INSCRIPTION AGENCE IMMOBILIÈRE

### 2.1 Page Accueil Inscription
**URL** : `/inscription`

Sélectionner : 🏢 **Je suis Agence**

---

### 2.2 Flux Agence - Étape 1 : Informations Responsable

**Formulaire** :

```
┌─────────────────────────────────────┐
│  Inscription - Agence Immobilière   │
│  Étape 1/5                          │
└─────────────────────────────────────┘

Responsable légal
━━━━━━━━━━━━━━━━━━━

Prénom *
[_____________________]

Nom *
[_____________________]

Email professionnel *
[________________@agence.fr_________]

Téléphone professionnel *
[_____________________]

─────────────────────────────
 [Précédent]           [Suivant]
```

**Validations** :
- Email : format valide + unique
- Téléphone : format international

**Actions** :
- Click "Suivant" → Étape 2

---

### 2.3 Flux Agence - Étape 2 : Informations Agence

**Formulaire** :

```
┌─────────────────────────────────────┐
│  Inscription - Agence Immobilière   │
│  Étape 2/5                          │
└─────────────────────────────────────┘

Nom de l'agence *
[_________________________________]
Exemple: "Agence Immobiliaire Dupont"

Téléphone agence *
[_____________________]

Website (optionnel)
[_________________________________]
Exemple: https://www.agence-dupont.fr

Type juridique * [Sélectionner ▼]
☐ SARL
☐ EIRL
☐ SAS
☐ SARL-U
☐ Micro-entreprise
☐ Autre

Secteurs d'activité * (Sélectionner au moins 1)
☑ Location
☐ Vente
☐ Gestion locative
☐ Syndic

─────────────────────────────
 [Précédent]           [Suivant]
```

**Validations** :
- Nom agence : min 5 caractères
- Type juridique : sélection obligatoire
- Secteurs : min 1 sélectionné

**Actions** :
- Click "Suivant" → Étape 3

---

### 2.4 Flux Agence - Étape 3 : Données Légales

**Formulaire** :

```
┌─────────────────────────────────────┐
│  Inscription - Agence Immobilière   │
│  Étape 3/5                          │
└─────────────────────────────────────┘

SIRET * 
[__________________]
Format: 14 chiffres
Exemple: 12345678901234

Adresse siège social *
[_________________________________]

Ville *
[_________________________________]

Code Postal *
[________]

Numéro carte professionnelle *
[_________________________________]
Délivré par la CCI/CMA

Numéro RCS (optionnel)
[_________________________________]

Numéro TVA (optionnel)
[_________________________________]
Format: FRXX123456789

─────────────────────────────
 [Précédent]           [Suivant]
```

**Validations** :
- SIRET : exactement 14 chiffres + vérification contrôle mod97
- Adresse : min 5 caractères
- Code postal : 5 chiffres
- Numéro carte pro : min 10 caractères
- Numéro RCS : vérification format (optionnel)
- Numéro TVA : vérification format (optionnel)

**Actions** :
- Click "Suivant" → Étape 4

---

### 2.5 Flux Agence - Étape 4 : Documents légaux

**Formulaire** :

```
┌─────────────────────────────────────┐
│  Inscription - Agence Immobilière   │
│  Étape 4/5                          │
└─────────────────────────────────────┘

Documents légaux requis
━━━━━━━━━━━━━━━━━━━━━━

Extrait Kbis * (moins de 3 mois)
┌─────────────────────────────┐
│ 📎 Ajouter document         │
│                             │
│ (Cliquez pour uploader)      │
│ Format: PDF, JPG, PNG       │
│ Taille max: 10MB            │
└─────────────────────────────┘

Assurance responsabilité civile *
┌─────────────────────────────┐
│ 📎 Ajouter document         │
│                             │
│ (Cliquez pour uploader)      │
│ Format: PDF                 │
│ Taille max: 10MB            │
│ Doit être valide > 6 mois   │
└─────────────────────────────┘

Carte professionnelle immobilière *
┌─────────────────────────────┐
│ 📎 Ajouter document         │
│                             │
│ (Cliquez pour uploader)      │
│ Format: PDF, JPG, PNG       │
│ Taille max: 5MB             │
└─────────────────────────────┘

Diplômes professionnels (optionnel)
┌─────────────────────────────┐
│ 📎 Ajouter document         │
│                             │
│ (Cliquez pour uploader)      │
│ Format: PDF, JPG, PNG       │
│ Taille max: 5MB             │
└─────────────────────────────┘

─────────────────────────────
 [Précédent]           [Suivant]
```

**Documents requis** :
1. **Kbis** : moins de 3 mois (exigé)
2. **Assurance RC** : valide + couverture immobilier (exigé)
3. **Carte pro** : immobilier (exigé)
4. **Diplômes** : optionnel (pour vérification crédibilité)

**Formats** :
- Kbis : PDF, JPG, PNG (max 10MB)
- Assurance : PDF (max 10MB) - vérifier date expiration
- Carte pro : PDF, JPG, PNG (max 5MB)

**Actions** :
- Upload documents
- Click "Suivant" → Étape 5

---

### 2.6 Flux Agence - Étape 5 : Profil & Conditions

**Formulaire** :

```
┌─────────────────────────────────────┐
│  Inscription - Agence Immobilière   │
│  Étape 5/5                          │
└─────────────────────────────────────┘

Logo agence (optionnel)
┌─────────────────────────────┐
│ 🖼️ Télécharger logo        │
│                             │
│ (JPG, PNG - max 2MB)        │
│ Format carré recommandé     │
└─────────────────────────────┘

Description agence (optionnel)
[_________________________________]
[_________________________________]
[_________________________________]
(max 1000 caractères)
Présentez votre agence, votre histoire, vos valeurs

Mot de passe administrateur *
[_____________________________]
Minimum 8 caractères

Confirmer mot de passe *
[_____________________________]

Conditions d'utilisation *
☑ J'accepte les conditions générales
☑ J'accepte la politique de confidentialité
☑ J'accepte les conditions tarifaires
☑ J'accepte les obligations légales immobilière
☑ J'autorise les communications

─────────────────────────────
 [Précédent]      [Créer compte]
```

**Validations** :
- Logo : image valide (optionnel)
- Mot de passe : min 8 chars
- Conditions : toutes acceptées (obligatoire)

**Actions** :
- Click "Créer compte" →
  - API POST `/auth/register/` (type: "agence")
  - Validation données légales
  - Documents sauvegardés en BDD
  - Compte en statut : **En vérification**
  - Email de confirmation envoyé
  - Admin notifié pour vérification
  - Redirect vers page "Vérification documents"

---

### 2.7 Étape 6 : Vérification Documents & Email

**Page de confirmation** :

```
┌─────────────────────────────────────┐
│   Agence en vérification             │
└─────────────────────────────────────┘

✉️ Email de confirmation envoyé à :
   responsable@agence.fr

📋 Statut de vérification :
   ⏳ En attente de vérification
   (Admin LogCiv validera vos documents)

Vérifications en cours:
✓ Email responsable
⏳ Extrait Kbis
⏳ Assurance RC
⏳ Carte professionnelle

Délai estimé : 2-3 jours ouvrés

Une notification vous sera envoyée
une fois la vérification terminée.

─────────────────────────────
Vous pouvez déjà :
- Consulter votre dashboard
- Ajouter des biens (publication après validation)
- Gérer votre profil
```

**Processus** :
1. Email reçu avec lien : `/verify-email?token=xxxxx`
2. Click lien → email vérifié
3. Admin reçoit notification
4. Admin vérifie documents (SIRET, Kbis, assurance, etc.)
5. Si OK → compte **Validé**
6. Si NOK → demande modifications
7. Email notif au responsable

**Après validation** :
- Statut : ✅ **Validée**
- Accès complet dashboard
- Peut publier biens immédiatement
- Peut ajouter agents

---

### 2.8 Résumé Inscription Agence

| Étape | Contenu | Temps |
|-------|---------|-------|
| 1 | Email, Mdp, Responsable légal | 3 min |
| 2 | Nom agence, Type juridique, Secteurs | 2 min |
| 3 | SIRET, Adresse légale, RCS, TVA | 3 min |
| 4 | Kbis, Assurance, Carte pro, Diplômes | 5 min |
| 5 | Logo, Description, Conditions | 3 min |
| 6 | Vérif email + documents admin | 48-72h |
| **Total** | **Inscription + validation complète** | **~16 min + 48-72h** |

---

---

## 3. COMPARAISON INSCRIPTION

| Aspect | Propriétaire | Agence |
|--------|-------------|--------|
| **Étapes** | 4 (+ vérif email) | 6 (+ vérif documents) |
| **Temps** | ~8 min | ~16 min + délai |
| **Documents** | 1 (Pièce ID) | 3 (Kbis, Assurance, Carte pro) |
| **Vérification** | Auto (email) | Manuel (admin) |
| **Délai accès** | Immédiat | 2-3 jours |
| **Profil complet** | Adresse, Bio, Avatar | Logo, Description, données légales |
| **Informations légales** | Basiques | Complètes (SIRET, RCS, TVA) |
| **Validation** | Email seul | Documents + admin |

---

## 4. Flux Erreurs & Validation

### Propriétaire
```
Email invalide → Message: "Format d'email incorrect"
Email existant → Message: "Cet email est déjà utilisé"
Mdp faible → Message: "Min 8 chars, 1 majuscule, 1 chiffre"
Pièce ID manquante → Message: "Document obligatoire"
Conditions non acceptées → Message: "Vous devez accepter les conditions"
```

### Agence
```
SIRET invalide → Message: "SIRET doit contenir 14 chiffres"
Kbis expiré → Message: "Kbis doit être datée de moins de 3 mois"
Assurance expirée → Message: "Assurance doit être valide > 6 mois"
Documents manquants → Message: "Documents obligatoires non fournis"
Type juridique manquant → Message: "Sélectionnez un type juridique"
Conditions non acceptées → Message: "Vous devez accepter toutes les conditions"
```

---

## 5. Emails Envoyés

### Propriétaire
- **Email 1** : Vérification email (lien expire 24h)
- **Email 2** : Bienvenue & accès dashboard

### Agence
- **Email 1** : Vérification email (lien expire 24h)
- **Email 2** : Documents en vérification (statut)
- **Email 3** : Documents validés ✅ OU modifications demandées ❌
- **Email 4** : Bienvenue & accès dashboard (après validation)
