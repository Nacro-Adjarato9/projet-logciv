# Spécification des APIs Django pour LogCiv

## Vue d'ensemble
LogCiv est une plateforme de location immobilière. Cette spécification détaille toutes les APIs REST nécessaires pour le backend Django.

## Modèles principaux
- **Utilisateur** : Gestion des comptes utilisateurs
- **Bien** : Propriétés immobilières
- **Réservation** : Locations de biens
- **Favori** : Biens favoris des utilisateurs
- **Message** : Messagerie entre utilisateurs
- **Notification** : Notifications système
- **Agent** : Agents immobiliers
- **Tarif** : Plans tarifaires

## APIs d'Authentification

### POST /api/auth/register/
- Inscription d'un nouvel utilisateur
- Body: `{email, password, first_name, last_name, phone, user_type}`
- Response: `{user, tokens}`

### POST /api/auth/login/
- Connexion utilisateur
- Body: `{email, password}`
- Response: `{user, access_token, refresh_token}`

### POST /api/auth/refresh/
- Rafraîchir le token JWT
- Body: `{refresh_token}`
- Response: `{access_token}`

### POST /api/auth/logout/
- Déconnexion
- Headers: `Authorization: Bearer <token>`

### POST /api/auth/password-reset/
- Demande de réinitialisation de mot de passe
- Body: `{email}`

### POST /api/auth/password-reset-confirm/
- Confirmation de réinitialisation
- Body: `{token, password}`

### GET /api/auth/profile/
- Récupérer le profil utilisateur
- Headers: `Authorization: Bearer <token>`

### PUT /api/auth/profile/
- Mettre à jour le profil
- Headers: `Authorization: Bearer <token>`
- Body: `{first_name, last_name, phone, avatar}`

## APIs des Biens (Propriétés)

### GET /api/biens/
- Lister tous les biens
- Query params: `?search=`, `?ville=`, `?prix_min=`, `?prix_max=`, `?type=`, `?page=`

### POST /api/biens/
- Créer un nouveau bien (propriétaires seulement)
- Headers: `Authorization: Bearer <token>`
- Body: `{titre, description, prix, ville, adresse, type_bien, superficie, chambres, salles_bain, images[]}`

### GET /api/biens/{id}/
- Détails d'un bien

### PUT /api/biens/{id}/
- Modifier un bien (propriétaire seulement)

### DELETE /api/biens/{id}/
- Supprimer un bien (propriétaire seulement)

### GET /api/biens/{id}/disponibilites/
- Récupérer les disponibilités d'un bien

### GET /api/biens/mes-biens/
- Lister les biens de l'utilisateur connecté
- Headers: `Authorization: Bearer <token>`

## APIs des Réservations

### GET /api/reservations/
- Lister les réservations de l'utilisateur
- Headers: `Authorization: Bearer <token>`

### POST /api/reservations/
- Créer une réservation
- Headers: `Authorization: Bearer <token>`
- Body: `{bien_id, date_debut, date_fin, nombre_personnes, message}`

### GET /api/reservations/{id}/
- Détails d'une réservation

### PUT /api/reservations/{id}/
- Modifier une réservation (statut: confirmer, annuler, etc.)

### DELETE /api/reservations/{id}/
- Annuler une réservation

### GET /api/reservations/calendrier/
- Récupérer le calendrier des réservations pour un bien
- Query params: `?bien_id=`, `?mois=`, `?annee=`

## APIs des Favoris

### GET /api/favoris/
- Lister les biens favoris de l'utilisateur
- Headers: `Authorization: Bearer <token>`

### POST /api/favoris/
- Ajouter un bien aux favoris
- Headers: `Authorization: Bearer <token>`
- Body: `{bien_id}`

### DELETE /api/favoris/{id}/
- Retirer un bien des favoris

## APIs de Messagerie

### GET /api/messages/
- Lister les conversations de l'utilisateur
- Headers: `Authorization: Bearer <token>`

### GET /api/messages/{conversation_id}/
- Lister les messages d'une conversation

### POST /api/messages/
- Envoyer un message
- Headers: `Authorization: Bearer <token>`
- Body: `{destinataire_id, sujet, contenu}` ou `{conversation_id, contenu}`

### POST /api/messages/{id}/read/
- Marquer un message comme lu

## APIs des Notifications

### GET /api/notifications/
- Lister les notifications de l'utilisateur
- Headers: `Authorization: Bearer <token>`

### POST /api/notifications/{id}/read/
- Marquer une notification comme lue

### DELETE /api/notifications/{id}/
- Supprimer une notification

## APIs des Agents

### GET /api/agents/
- Lister tous les agents

### GET /api/agents/{id}/
- Détails d'un agent

### GET /api/agents/{id}/biens/
- Lister les biens d'un agent

### GET /api/agents/{id}/avis/
- Lister les avis d'un agent

### POST /api/agents/{id}/avis/
- Laisser un avis sur un agent
- Headers: `Authorization: Bearer <token>`
- Body: `{note, commentaire}`

## APIs des Tarifs/Pricing

### GET /api/tarifs/
- Lister les plans tarifaires

### GET /api/tarifs/{id}/
- Détails d'un plan tarifaire

### POST /api/abonnements/
- Souscrire à un plan
- Headers: `Authorization: Bearer <token>`
- Body: `{tarif_id, duree_mois}`

### GET /api/abonnements/
- Lister les abonnements de l'utilisateur

## APIs Utilitaires

### GET /api/search/
- Recherche globale
- Query params: `?q=`, `?type=`

### GET /api/stats/
- Statistiques du dashboard (admin/utilisateur)

### GET /api/villes/
- Lister les villes disponibles

### GET /api/types-bien/
- Lister les types de biens

## Sécurité et Permissions

### Rôles utilisateurs :
- **Locataire** : Peut réserver, mettre en favori, envoyer messages
- **Propriétaire** : Peut gérer ses biens, accepter/refuser réservations
- **Agent** : Peut gérer les biens de ses clients
- **Admin** : Accès complet

### Permissions :
- Utilisateur authentifié requis pour la plupart des endpoints
- Vérification de propriété pour modification/suppression
- Rate limiting sur les endpoints sensibles
- Validation des données côté serveur

## Technologies recommandées

### Django REST Framework
- ViewSets pour les CRUD standards
- Permissions personnalisées
- Filtres et recherche
- Pagination

### Authentification
- JWT (djangorestframework-simplejwt)
- Email verification
- Password reset

### Base de données
- PostgreSQL en production
- SQLite pour développement

### Tâches asynchrones
- Celery + Redis pour emails, notifications

### Fichiers médias
- Cloud storage (AWS S3, Cloudinary) pour les images

## Structure du projet Django

```
logciv_backend/
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── utilisateurs/
│   ├── models.py (User, Profile)
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── biens/
│   ├── models.py (Bien, Image, Disponibilite)
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── reservations/
├── favoris/
├── messages/
├── notifications/
├── agents/
├── tarifs/
└── manage.py
```</content>
<parameter name="filePath">c:\Users\NACRO ADJARATOU\Downloads\logciv-code\api_specification.md