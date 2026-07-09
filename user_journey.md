# Parcours Utilisateur - LogCiv

## Vue d'ensemble
LogCiv est une plateforme de location immobilière avec 3 types d'utilisateurs : **Locataires**, **Propriétaires**, et **Agents**.

---

## 1. Parcours LOCATAIRE

### 1.1 Avant la connexion
1. Accueil (Home) - Découverte
   - Page d'accueil avec presentation
   - Consultation des tarifs/plans
   - Lien vers inscription/connexion

2. Parcourir les biens (sans connexion)
   - Voir la liste des biens disponibles
   - Filtrer par : ville, prix, type
   - Cliquer sur un bien pour voir détails (images, description, prix)
   - ⚠️ **Pas accès** : réservation, favoris, messagerie

### 1.2 Inscription
1. Cliquer "S'inscrire"
2. Formulaire :
   - Email
   - Mot de passe
   - Prénom / Nom
   - Téléphone
   - Rôle : **Locataire**
3. Validation email
4. Redirection vers Dashboard

### 1.3 Connexion
1. Cliquer "Connexion"
2. Email + Mot de passe
3. JWT token sauvegardé → localStorage
4. Redirection vers Dashboard
²
### 1.4 Dashboard Locataire
Menu latéral avec onglets :

#### 1.4.1 Onglet "Aperçu" (Overview)
- Statistiques : 
  - Nombre de réservations en cours
  - Nombre de favoris
  - Messages non lus
- Biens récemment consultés

#### 1.4.2 Onglet "Biens" (BiensTab)
- Voir tous les biens disponibles
- Filtrer par : ville, prix, type
- Pour chaque bien :
  - Images (carrousel)
  - Titre, description, prix
  - Nombre chambres/salles bain, superficie
  - Bouton "Voir détails"
  - Bouton "Ajouter aux favoris" (★)
  - **Click détails** → page bien complet

#### 1.4.3 Onglet "Favoris" (FavorisTab)
- Voir les biens marqués comme favoris
- Bouton pour retirer un favori
- Bouton "Réserver" depuis favoris

#### 1.4.4 Onglet "Réservations" (ReservationsTab)
- Tableau : réservations passées & en cours
- Colonnes : Bien, Date arrivée/départ, Statut, Actions
- Statuts possibles :
  - ⏳ **En attente** (propriétaire n'a pas confirmé)
  - ✅ **Confirmée**
  - ❌ **Annulée**
  - ✓ **Complétée**
- Action : voir détails, annuler (si possible)

#### 1.4.5 Onglet "Calendrier" (CalendrierTab)
- Calendrier interactif
- Voir les disponibilités des biens
- Dates rouges = réservées
- Dates vertes = disponibles
- Click date → formulaire réservation

#### 1.4.6 Onglet "Messages" (MessagesTab)
- Conversations avec propriétaires/agents
- Liste conversations gauche
- Messages droite (chat)
- Bouton "Nouveau message"
- Marquer message comme lu

#### 1.4.7 Onglet "Notifications" (NotificationsTab)
- Liste notifications (récentes en haut)
- Types : réservation confirmée, message reçu, nouveau bien, etc.
- Bouton marquer comme lue
- Bouton supprimer

#### 1.4.8 Onglet "Profil" (ProfilTab)
- Afficher profil :
  - Avatar
  - Email
  - Nom / Prénom
  - Téléphone
  - Biographie
- Bouton "Modifier profil"
- Bouton "Changer mot de passe"
- Bouton "Supprimer compte"

#### 1.4.9 Onglet "Paramètres" (ParametresTab)
- Langue
- Notifications (email, SMS, push)
- Confidentialité
- Données personnelles

#### 1.4.10 Onglet "Support" (SupportTab)
- FAQ
- Formulaire contact
- Chat support

#### 1.4.11 Onglet "À Propos" (Apropos)
- Infos sur LogCiv
- Mentions légales
- Conditions générales

---

## 2. Parcours PROPRIÉTAIRE

### 2.1 Avant la connexion
Même que locataire (Home, Tarifs, Connexion/Inscription)

### 2.2 Inscription Propriétaire
1. Cliquer "S'inscrire"
2. Rôle : **Propriétaire**
3. Profil propriétaire supplémentaire :
   - Type de profil (indépendant/agence)
   - SIRET/RCS (agence)
   - Documents (pièce identité, RCS, assurance)
   - ✅ Vérification par admin avant accès complet
4. En attente de validation

### 2.3 Connexion
Même que locataire

### 2.4 Dashboard Propriétaire
Menu latéral onglets :

#### 2.4.1 Onglet "Aperçu" (Overview)
- Stats :
  - Nombre total de biens
  - Réservations ce mois
  - Revenu estimé
  - Biens avec reviews
- Graphique revenus (par mois)

#### 2.4.2 Onglet "Mes Biens" (BiensTab)
- Tableau : mes biens
- Colonnes : Photo, Titre, Ville, Prix, Status, Actions
- Bouton "Ajouter un bien"
- Actions par bien : Éditer, Supprimer, Voir détails, Voir réservations
- **Click "Ajouter un bien"** :
  - Formulaire :
    - Titre
    - Description
    - Adresse / Ville / Code postal
    - Type (maison, appartement, etc.)
    - Superficie
    - Chambres / Salles bain
    - Équipements (checkbox)
    - Prix/nuit
    - Images (upload multiple)
    - Règles (animaux, fumeurs, etc.)
  - Submit → API POST `/biens/`

#### 2.4.3 Onglet "Ajouter Bien" (AjouterBienTab)
- Formulaire détaillé (cf 2.4.2)
- Validation front + API
- Succès → redirection "Mes Biens"

#### 2.4.4 Onglet "Réservations" (ReservationsTab)
- Tableau : réservations POUR mes biens
- Colonnes : Bien, Locataire, Dates, Montant, Statut, Actions
- Actions :
  - ✅ Confirmer réservation
  - ❌ Refuser réservation
  - 👀 Voir détails locataire
  - 💬 Contacter locataire

#### 2.4.5 Onglet "Calendrier" (CalendrierTab)
- Vue calendrier par bien
- Dates réservées affichées
- Possibilité bloquer dates manuellement

#### 2.4.6 Onglet "Agents" (AgentsTab)
- Lister agents (si propriétaire agence)
- Ajouter agents
- Voir biens gérés par agent
- Statuts agents

#### 2.4.7 Onglet "Messages" (MessagesTab)
- Même que locataire

#### 2.4.8 Onglet "Notifications" (NotificationsTab)
- Même que locataire

#### 2.4.9 Onglet "Profil" (ProfilTab)
- Données propriétaire :
  - Avatar
  - Email / Téléphone
  - Documents (vérification)
  - Type profil
- Bouton "Modifier profil"
- Bouton "Vérifier profil" (upload documents)

#### 2.4.10 Onglet "Paramètres" (ParametresTab)
- Même que locataire

#### 2.4.11 Onglet "Support" (SupportTab)
- Même que locataire

---

## 3. Parcours AGENT (optionnel)

### 3.1 Inscription Agent
- Rôle : **Agent**
- Profil supplémentaire :
  - Agence d'affiliation
  - Numéro d'agent
  - Commission
  - Documents

### 3.2 Dashboard Agent
Combinaison propriétaire + locataire :
- Gérer ses propres biens
- Voir biens de l'agence
- Gérer réservations
- Gérer clients (locataires)

---

## 4. Flux spécifiques

### 4.1 Flux Réservation (Locataire)
1. **Voir bien** → Dashboard/Biens ou accueil
2. **Click bien** → Détails complet
3. **Click "Réserver"** → Dialog réservation
4. **Remplir** :
   - Date début
   - Date fin
   - Nombre de personnes
   - Message (optionnel)
5. **Submit** → API POST `/reservations/`
6. **Status** : ⏳ En attente de confirmation
7. **Notification** : Propriétaire reçoit notification
8. **Propriétaire confirme** → Locataire reçoit confirmation email
9. **Locataire voit** : Réservation dans onglet "Réservations" (✅ Confirmée)

### 4.2 Flux Favoris (Locataire)
1. **Voir bien** → Dashboard/Biens
2. **Click ★** → API POST `/favoris/toggle/`
3. **★ devient plein** (rouge)
4. Bien ajouté à "Favoris"
5. **Click ★ again** → retrait des favoris

### 4.3 Flux Messaging
1. **Click bien** → Voir détails
2. **Click "Contacter propriétaire"** → Dialog message
3. Ou depuis **onglet Messages** → Nouveau message
4. **Remplir** :
   - Destinataire (sélection)
   - Sujet
   - Message
5. **Submit** → API POST `/messages/`
6. Message apparaît dans conversation
7. Destinataire reçoit notification

### 4.4 Flux Avis (Locataire après réservation)
1. Réservation complétée
2. Notification "Laisser un avis"
3. **Click** → Dialog avis
4. **Remplir** :
   - Note (1-5 stars)
   - Commentaire
5. **Submit** → API POST `/avis/`
6. Avis visible sur profil propriétaire

---

## 5. Flux Navigation Principale

```
┌─────────────────┐
│    Accueil      │
│   (Home)        │
└────────┬────────┘
         │
         ├─→ Connexion ──→ [Login]
         │
         ├─→ Inscription ──→ [Register] ──→ [Vérif Email] ──→ Dashboard
         │
         └─→ Consulter Biens (sans login)
                   │
                   └─→ Cliquer bien ──→ Détails (limité)
                   
         
┌──────────────────┐
│   Dashboard      │
│  (après connexion)
└────────┬─────────┘
         │
         ├─→ Aperçu
         │
         ├─→ Biens
         │   ├─→ Voir liste
         │   ├─→ Voir détails
         │   ├─→ Filtrer
         │   └─→ Ajouter aux favoris (locataire)
         │
         ├─→ Favoris
         │   └─→ Gérer favoris
         │
         ├─→ Réservations
         │   ├─→ Voir réservations
         │   ├─→ Créer réservation (locataire)
         │   └─→ Confirmer/Refuser (propriétaire)
         │
         ├─→ Calendrier
         │   └─→ Voir disponibilités
         │
         ├─→ Messages
         │   ├─→ Voir conversations
         │   └─→ Envoyer message
         │
         ├─→ Notifications
         │   └─→ Gérer notifications
         │
         ├─→ Profil
         │   └─→ Éditer profil
         │
         ├─→ Paramètres
         │   └─→ Configurer préférences
         │
         └─→ Support
             └─→ Aide & contact
```

---

## 6. Résumé des actions principales par rôle

### Locataire
- ✅ Voir biens
- ✅ Réserver bien
- ✅ Gérer favoris
- ✅ Consulter réservations
- ✅ Messagerie propriétaires
- ✅ Laisser avis
- ✅ Gérer profil

### Propriétaire
- ✅ Ajouter biens
- ✅ Modifier biens
- ✅ Confirmer réservations
- ✅ Voir réservations entrantes
- ✅ Messagerie locataires
- ✅ Voir avis reçus
- ✅ Gérer profil

### Visiteur (non-connecté)
- ✅ Voir biens publics
- ✅ Voir accueil
- ✅ Voir tarifs
- ❌ Réserver
- ❌ Messagerie
- ❌ Favoris
