# Parcours Utilisateur - Propriétaire & Agence Immobilière

---

## 1. PROPRIÉTAIRE IMMOBILIER (Indépendant)

### 1.1 Profil & Enregistrement

#### Caractéristiques
- Personne physique
- Propriétaire de 1 à plusieurs biens
- Gère seul ses propriétés
- Pas de structure juridique
- Pas d'agents sous sa responsabilité

#### Inscription
1. Aller à `/inscription`
2. Formulaire :
   - Email
   - Mot de passe
   - Prénom / Nom
   - Téléphone
   - **Type de compte** : **Propriétaire** (sélection)
   - **Profil** : Indépendant ✓
3. Valider email
4. Remplir profil complét :
   - Pièce d'identité (scan/photo)
   - Adresse personnelle
   - Numéro SIRET (optionnel)
5. ✅ Profil validé = Accès complet

### 1.2 Dashboard Propriétaire Indépendant

Menu latéral :

```
┌─ Aperçu
├─ Mes Biens
│  ├─ Liste des biens
│  ├─ Ajouter un bien
│  └─ Modifier/Supprimer bien
├─ Réservations
│  ├─ Réservations entrantes
│  ├─ Confirmer/Refuser
│  └─ Voir calendrier
├─ Favoris des locataires
├─ Messages
├─ Notifications
├─ Avis reçus
├─ Profil
├─ Paramètres
└─ Support
```

### 1.3 Onglet "Aperçu" (Overview)

Affiche :
- 📊 Total de biens : **3**
- 📅 Réservations ce mois : **5**
- 💰 Revenu ce mois : **1,500 €**
- ⭐ Note moyenne : **4.8/5** (30 avis)
- 📈 Graphique revenus (6 derniers mois)
- 📋 Dernières réservations
- 🔔 Notifications récentes

### 1.4 Onglet "Mes Biens"

#### Affichage
Tableau avec colonnes :
| Photo | Titre | Ville | Type | Prix | Réservations | Status | Actions |
|-------|-------|-------|------|------|--------------|--------|---------|

#### Statuts possibles
- 🟢 **Actif** - disponible pour réservations
- 🟡 **Brouillon** - non publié
- 🔴 **Archivé** - temporairement hors ligne
- ⚫ **Désactivé** - plus disponible

#### Actions par bien
- 👁️ Voir détails
- ✏️ Éditer
- 🗑️ Supprimer
- 📅 Voir réservations
- ⭐ Voir avis

#### Bouton "Ajouter un bien"
Click → formulaire :
- Titre
- Description (longue)
- Adresse / Ville / Code postal
- Type (Maison, Appartement, Studio, etc.)
- Superficie (m²)
- Chambres
- Salles bain
- Équipements (checkbox) : WiFi, Parking, AC, Piscine, Jardin, etc.
- Prix par nuit (€)
- Caution (€)
- Délai d'annulation (24h, 3j, 7j)
- Règles (Animaux OUI/NON, Fumeurs OUI/NON)
- Images (upload minimum 5, max 20)
- Vidéo (optionnel)

**Submit** → API POST `/biens/`
→ Bien créé en brouillon
→ Propriétaire peut publier ou modifier

### 1.5 Onglet "Réservations pour mes biens"

#### Tableau des réservations
Colonnes :
| Bien | Locataire | Arrivée | Départ | Montant | Statut | Actions |

#### Statuts réservation
- ⏳ **En attente** - locataire a réservé, en attente validation
- ✅ **Confirmée** - réservation validée
- 💰 **Payée** - paiement effectué
- 📍 **En cours** - locataire actuellement sur place
- ✓ **Complétée** - séjour terminé
- ❌ **Annulée** - réservation annulée

#### Actions
- 👁️ Voir détails (locataire, dates, message)
- ✅ Confirmer réservation
- ❌ Refuser réservation
- 💬 Envoyer message
- 🔔 Envoyer rappel check-in/check-out
- 📊 Voir historique locataire

**Confirmer réservation** :
- Dialog confirmation
- Possibilité envoyer message de bienvenue
- Locataire reçoit notification + email

**Refuser réservation** :
- Dialog raison du refus
- Message automatique au locataire
- Raisons : Dates non disponibles, Bien réservé, Autre

### 1.6 Onglet "Calendrier"

Vue par bien :
- Sélectionner bien (dropdown)
- Calendrier 12 mois
- Codes couleurs :
  - 🟢 **Disponible**
  - 🔴 **Réservé**
  - 🟡 **En attente**
  - ⚫ **Bloqué manuellement**

Actions :
- Click date → Bloquer/Débloquer
- Click réservation → Voir détails
- Drag-drop pour créer bloques (ex: maintenance)

### 1.7 Onglet "Avis reçus"

Liste des avis :
- ⭐⭐⭐⭐⭐ Note (1-5 stars)
- Locataire : "Jean D."
- Date : "15 avril 2026"
- Commentaire : "Superbe bien, très propre et accueillant !"
- Bien : "Appartement Marais"
- Répondre avis (optionnel)
- Supprimer avis abusif (signaler)

Stats avis :
- Note moyenne par bien
- Graphique (nb avis par mois)
- Avis positifs/négatifs %

### 1.8 Onglet "Messages"

Conversations avec locataires :
- Liste à gauche (conversations)
  - Nom locataire
  - Dernier message
  - Timestamp
  - Badge (non lus)
- Chat à droite
  - Messages (bulles)
  - Input pour répondre
- Bouton "Nouveau message"

### 1.9 Onglet "Profil"

Afficher + Éditer :
- Avatar
- Prénom / Nom
- Email
- Téléphone
- Biographie (présentation)
- Pièce identité (vérifiée)
- Adresse
- Langue de préférence

Boutons :
- 🔐 Changer mot de passe
- 🗑️ Supprimer compte
- 📋 Mes documents (téléchargements contrats, factures)

---

## 2. AGENCE IMMOBILIÈRE

### 2.1 Profil & Enregistrement

#### Caractéristiques
- Entité juridique (SARL, EIRL, SAS, etc.)
- Gère plusieurs propriétés
- Emploie des **agents**
- Structure commerciale
- Gestion de portefeuille immobilier

#### Inscription
1. Aller à `/inscription`
2. Formulaire initial :
   - Email (professionnel)
   - Mot de passe
   - Nom de l'agence
   - Téléphone agence
   - **Type de compte** : **Agence Immobilière** (sélection)
3. Formulaire complémentaire (profil agence) :
   - Type juridique (SARL, EIRL, SAS, etc.)
   - SIRET (obligatoire)
   - Numéro de carte professionnelle immobilière
   - Adresse siège social
   - Logo agence (image)
   - Site web (optionnel)
   - Secteurs d'activité (Vente, Location, Gestion, etc.)
   - Documents légaux :
     - Kbis (extrait RCS)
     - Assurance responsabilité civile
     - Carte professionnelle
   - Responsable légal (Prénom, Nom, Email)
4. ✅ Documents vérifiés par admin = Accès complet

### 2.2 Dashboard Agence Immobilière

Menu latéral :

```
┌─ Aperçu
├─ Portefeuille de biens
│  ├─ Tous les biens
│  ├─ Ajouter un bien
│  ├─ Biens par agent
│  └─ Gérer biens
├─ Agents
│  ├─ Liste des agents
│  ├─ Ajouter agent
│  ├─ Permissions agent
│  └─ Voir portefeuille
├─ Réservations & Locations
│  ├─ Toutes réservations
│  ├─ Calendrier global
│  └─ Confirmer/Gérer
├─ Favoris des clients
├─ Messages & Communication
├─ Notifications
├─ Avis & Évaluations
├─ Financier
│  ├─ Revenus
│  ├─ Commissions agents
│  └─ Rapports
├─ Profil agence
├─ Paramètres
└─ Support
```

### 2.3 Onglet "Aperçu"

Affiche :
- 📊 Total portefeuille : **15 biens**
- 👥 Agents actifs : **4**
- 📅 Réservations ce mois : **12**
- 💰 Revenu ce mois : **5,200 €**
- 💳 Commissions dues : **520 €** (10% aux agents)
- ⭐ Note moyenne agence : **4.7/5**
- 📈 Graphique revenus (6 derniers mois)
- 🏆 Meilleur agent : "Marie D." (8 réservations)
- 📋 Dernier bien ajouté
- 🔔 Notifications agence

### 2.4 Onglet "Portefeuille de biens"

#### Affichage global
Tableau : tous les biens de l'agence (indépendant de l'agent)

| Photo | Titre | Ville | Type | Agent | Prix | Réservations | Status | Actions |

#### Filtres
- Par agent
- Par ville
- Par type
- Par statut
- Par date ajout

#### Actions
- Voir détails
- Éditer
- Supprimer
- Voir réservations
- Voir avis
- Voir agent responsable

#### Bouton "Ajouter un bien"
Même formulaire que propriétaire indépendant +
- **Assigner à agent** (dropdown agents)
- **Commission agent** (%)
- **Propriétaire du bien** (si bien d'un propriétaire partenaire)

### 2.5 Onglet "Agents"

#### Affichage
Tableau agents :
| Avatar | Nom | Email | Tel | Biens gérés | Réservations | Commission | Status | Actions |

#### Statuts agent
- 🟢 **Actif** - peut recevoir réservations
- 🟡 **Inactif** - pas de nouvelles réservations
- ⚫ **Suspendu** - accès révoqué
- ⚪ **Archivé** - ancien agent

#### Actions par agent
- 👁️ Voir profil
- ✏️ Éditer permissions
- 📊 Voir portefeuille
- 💰 Voir commissions
- ⏸️ Activer/Désactiver
- 🗑️ Retirer agence

#### Bouton "Ajouter un agent"
Click → Formulaire :
- Email agent (invitation envoyée)
- Prénom / Nom
- Téléphone
- Zones de couverture (villes)
- Commission (%) default 10%
- Permissions :
  - ☑️ Voir/Éditer ses biens
  - ☑️ Voir toutes les réservations
  - ☑️ Confirmer réservations
  - ☑️ Envoyer messages
- Statut actif/inactif

**Submit** → Email invitation envoyé à agent
→ Agent crée compte/se connecte
→ Agent accède portefeuille asigné

### 2.6 Onglet "Réservations & Locations"

#### Affichage global
Toutes réservations pour tous biens agence

| Bien | Agent | Locataire | Arrivée | Départ | Montant | Statut | Actions |

#### Filtres
- Par agent
- Par bien
- Par statut
- Par date

#### Actions
- Voir détails
- Confirmer/Refuser
- Envoyer message
- Voir historique locataire

#### Statuts
Même que propriétaire indépendant

#### Calendrier global
- Vue calendrier par mois
- Codes couleurs par agent (pour distinction visuelle)
- Voir tous biens ou par agent/bien

### 2.7 Onglet "Messages & Communication"

Conversations :
- Avec locataires
- Avec agents (internes)
- Filtrer par type
- Broadcast message aux agents

### 2.8 Onglet "Financier"

#### Revenus
- Graphique revenus mensuels
- Total année en cours
- Comparaison année précédente
- Revenus par bien
- Revenus par agent

#### Commissions agents
Tableau :
| Agent | Base revenu | % Commission | Montant dû | Statut paiement |

Statuts :
- 💰 **À payer**
- ✅ **Payée**
- 📅 **Programmée**

Actions :
- Voir détails commission
- Marquer comme payée
- Générer bulletin de paie

#### Rapports
- Rapport mensuel (PDF)
- Rapport annuel (PDF)
- Export données (CSV)

### 2.9 Onglet "Profil Agence"

Afficher + Éditer :
- Logo agence
- Nom agence
- Siège social (adresse)
- Téléphone
- Website
- SIRET
- Carte professionnelle
- Numéro RCS
- Documents légaux (upload)
- Secteurs activité
- Description (présentation)
- Responsable légal
- Numéro TVA (optionnel)

### 2.10 Onglet "Paramètres"

Options agence :
- Notifications (email, SMS)
- Langue interface
- Format devises
- Fuseau horaire
- Intégrations tierces (Stripe, Booking.com, etc.)
- Politique d'annulation (délais)
- Taux TVA appliqué

---

## 3. COMPARAISON PROPRIÉTAIRE vs AGENCE

| Aspect | Propriétaire | Agence |
|--------|-------------|--------|
| **Nombre biens** | 1-5 | 10+ |
| **Agents** | ❌ Non | ✅ Oui |
| **Gestion biens** | Personnel | Centralisée |
| **Commissions** | N/A | Paye agents |
| **Documents légaux** | Pièce ID | Kbis, Assurance, Carte pro |
| **Revenus** | Direct locataires | + Commission agents |
| **Interface** | Simplifiée | Complète |
| **Portée** | Locale | Régionale/Nationale |
| **Support** | Email | Email + Phone |

---

## 4. INTERACTIONS PROPRIÉTAIRE ↔ AGENCE

### Cas : Propriétaire mandate une Agence

1. **Propriétaire** crée bien indépendamment
2. **Agence** contacte propriétaire (via support)
3. **Contrat mandat** signé (offline ou via platform)
4. **Agence** peut :
   - Modifier bien propriétaire
   - Ajouter agents
   - Gérer réservations
   - Prélever commissions
5. **Propriétaire** voit :
   - Réservations reçues
   - Revenus générés
   - Avis clients

### Modèle de commissions
- **Agence facture propriétaire** : 15-25% du revenu
- **Agence paye agents** : 10-15% du revenu
- **Propriétaire reçoit** : 60-75% du revenu

Exemple :
```
Réservation : 1,000 €
- Commission agence (20%) : 200 €
  - Agent (10% de 1000) : 100 €
  - Agence (10% de 1000) : 100 €
- Propriétaire reçoit : 800 €
```

---

## 5. FLUX SPÉCIFIQUES AGENCE

### 5.1 Ajouter un agent

1. Admin agence → Onglet "Agents"
2. Click "Ajouter agent"
3. Remplir email + détails
4. **Email invitation envoyé** à l'adresse
5. Agent reçoit email avec lien
6. Agent crée compte ou se connecte
7. Agent arrive sur dashboard avec :
   - Biens assignés
   - Réservations de ses biens
   - Commission calculée
8. Agent peut :
   - Confirmer réservations
   - Envoyer messages
   - Voir son portefeuille
   - Voir commissions dues

### 5.2 Gestion des commissions

1. Chaque réservation confirmée → calcul commission agent
2. Commission accumulée (mensuel)
3. Admin agence → Onglet "Financier"
4. Tableau commission agents
5. Click agent → détail commission
6. Marquer "Payée" + date
7. Rapport de paie généré (PDF)
8. Agent notifié

### 5.3 Rapport mensuel

1. Admin agence → Onglet "Financier"
2. Click "Générer rapport"
3. Période (mois/année)
4. PDF généré avec :
   - Revenus totaux
   - Commissions agents
   - Biens vendus/loués
   - Statistiques clients
   - Ratings
5. Export en email

---

## 6. Permissions & Sécurité

### Propriétaire Indépendant
- Accès complet ses biens
- Gère seul réservations
- Gère messages
- Accès finances seul

### Agent (dans Agence)
- Accès biens assignés
- Voir réservations biens assignés
- Confirmer réservations
- Envoyer messages clients
- ❌ Pas accès finances agence
- ❌ Pas accès admin agence
- ❌ Pas accès autres agents

### Admin Agence
- Accès complet tous biens
- Gère agents
- Gère réservations
- Gère finances
- Gère profil agence
- Peut bloquer agents

---

## 7. Notifications & Alertes

### Pour Propriétaire Indépendant
- 🔔 Nouvelle réservation
- 🔔 Réservation confirmée
- 🔔 Message locataire
- 🔔 Avis reçu
- 🔔 Rappel check-in (J-1)
- 🔔 Paiement reçu
- 🔔 Maintenance signalée

### Pour Agence
- 🔔 Nouvelle réservation
- 🔔 Réservation confirmée
- 🔔 Commission agent calculée
- 🔔 Paiement agent effectué
- 🔔 Avis reçu
- 🔔 Agent inactif
- 🔔 Document expiration (Kbis, assurance)

### Pour Agent
- 🔔 Nouveau bien assigné
- 🔔 Nouvelle réservation son portefeuille
- 🔔 Commission due
- 🔔 Commission payée
- 🔔 Message client
