# Fiche d'Intégration React <-> Django - LogCiv

Cette version est alignée sur les routes réelles du backend Django et sur le frontend React LogCiv.

## 1. URL de base attendue

Le frontend lit:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Si cette variable n'est pas definie, React utilise par defaut:

```text
http://127.0.0.1:8000/api
```

## 2. Authentification

Le frontend envoie le token JWT dans:

```http
Authorization: Bearer <access_token>
```

### Format de reponse attendu

Le frontend React accepte plusieurs formats, mais le backend actuel renvoie surtout:

- `access`
- `refresh`

Le frontend sait aussi lire, si besoin:

- `access_token`
- `refresh_token`
- `{ tokens: { access, refresh } }`

### Important

- `login` doit renvoyer `access` et `refresh`.
- `register` cree bien l'utilisateur, mais ne renvoie pas forcement des tokens JWT. Dans ce cas, le frontend doit rediriger vers la page de connexion.

## 3. CORS a autoriser cote Django

Origines minimales a autoriser:

- `http://127.0.0.1:5173`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://localhost:3000`

Methodes:

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`

Headers:

- `Authorization`
- `Content-Type`

## 4. Routes reelles consommees par le frontend

### Auth

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `POST /api/auth/logout/`
- `POST /api/auth/password-reset/`
- `POST /api/auth/password-reset-confirm/`

### Utilisateur

- `GET /api/auth/profile/`
- `PUT /api/auth/profile/`
- `GET /api/utilisateurs/me/`
- `PUT /api/utilisateurs/me/update/`
- `GET /api/utilisateurs/profile/`
- `GET /api/utilisateurs/profil-proprietaire/`
- `PUT /api/utilisateurs/profil-proprietaire/`
- `POST /api/utilisateurs/profil-proprietaire/verifier/`
- `GET /api/utilisateurs/profil-agence/`
- `PUT /api/utilisateurs/profil-agence/`
- `POST /api/utilisateurs/profil-agence/verifier/`
- `DELETE /api/utilisateurs/delete/`

### Biens

- `GET /api/biens/`
- `POST /api/biens/`
- `GET /api/biens/{id}/`
- `PUT /api/biens/{id}/`
- `PATCH /api/biens/{id}/`
- `DELETE /api/biens/{id}/`
- `GET /api/biens/mes_biens/`
- `GET /api/biens/{id}/disponibilites/`

### Reservations

- `GET /api/reservations/`
- `POST /api/reservations/`
- `GET /api/reservations/{id}/`
- `PUT /api/reservations/{id}/`
- `PATCH /api/reservations/{id}/`
- `DELETE /api/reservations/{id}/`
- `GET /api/reservations/mes_reservations/`
- `GET /api/reservations/reservations_pour_mes_biens/`
- `GET /api/reservations/calendrier/?bien_id=&mois=&annee=`
- `PUT /api/reservations/{id}/status/`

### Messages

- `GET /api/messages/`
- `POST /api/messages/`
- `GET /api/messages/{id}/`
- `PUT /api/messages/{id}/`
- `PATCH /api/messages/{id}/`
- `DELETE /api/messages/{id}/`
- `GET /api/messages/mes_messages/`
- `GET /api/messages/conversations/`
- `GET /api/messages/conversation/{conversation_id}/`
- `POST /api/messages/{id}/read/`

### Notifications

- `GET /api/notifications/`
- `POST /api/notifications/`
- `GET /api/notifications/{id}/`
- `PUT /api/notifications/{id}/`
- `PATCH /api/notifications/{id}/`
- `DELETE /api/notifications/{id}/`
- `GET /api/notifications/unread_count/`
- `POST /api/notifications/mark_all_as_read/`
- `PUT /api/notifications/{id}/read/`

### Favoris

- `GET /api/favoris/`
- `POST /api/favoris/`
- `GET /api/favoris/{id}/`
- `PUT /api/favoris/{id}/`
- `PATCH /api/favoris/{id}/`
- `DELETE /api/favoris/{id}/`
- `POST /api/favoris/toggle/`
- `GET /api/favoris/count/`

### Agents

- `GET /api/agents/`
- `GET /api/agents/{id}/`
- `GET /api/agents/{id}/biens/`
- `GET /api/agents/{id}/avis/`
- `POST /api/agents/{id}/avis/ajouter/`

### Agences

- `GET /api/agences/`
- `POST /api/agences/`
- `GET /api/agences/{id}/`
- `PUT /api/agences/{id}/`
- `PATCH /api/agences/{id}/`
- `DELETE /api/agences/{id}/`

### Tarifs et abonnements

- `GET /api/tarifs/`
- `GET /api/tarifs/{id}/`
- `GET /api/abonnements/`
- `GET /api/abonnements/{id}/`
- `POST /api/abonnements/`
- `POST /api/abonnements/souscrire/`

### IA

- `GET /api/ia/recommendations/`
- `POST /api/ia/recommendations/`
- `POST /api/ia/recommendations/generer_recommandations/`
- `POST /api/ia/recherche/rechercher/`
- `POST /api/ia/verifier-document/verifier/`

### Utilitaires

- `GET /api/search/`
- `GET /api/stats/`
- `GET /api/villes/`
- `GET /api/types-bien/`

## 5. Formats de reponse critiques

### Login

Entrée:

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

Sortie attendue:

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "proprietaire",
    "verificationStatus": "en_attente"
  },
  "access": "xxx",
  "refresh": "yyy"
}
```

### Register

Entrée:

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "first_name": "Jean",
  "last_name": "Kouassi",
  "phone": "+2250700000000",
  "user_type": "proprietaire"
}
```

Sortie:

- soit `user` seul
- soit `user` + tokens, si le backend les genere

## 6. Champs utilisateur utilises par le frontend

Le frontend lit surtout:

- `id`
- `nom` ou `last_name`
- `prenom` ou `first_name`
- `email`
- `telephone` ou `phone`
- `role` ou `user_type`
- `verificationStatus` ou `verification_status`
- `nomAgence`
- `rccm`
- `ncc`
- `siteWeb`
- `description`
- `logo`
- `createdAt`

## 7. Champs bien utilises par le frontend

- `id`
- `titre`
- `description`
- `prix`
- `ville`
- `commune`
- `quartier`
- `adressePrecise`
- `type`
- `categorie`
- `pieces`
- `chambres`
- `sallesDeBain`
- `superficie`
- `etage`
- `parking`
- `meuble`
- `equipements`
- `images`
- `statut` ou `status`

## 8. Champs reservation utilises

- `id`
- `propertyId` ou `bien_id`
- `clientName` ou `client_name`
- `clientPhone` ou `client_phone`
- `date` ou `date_debut`
- `time` ou `heure`
- `message`
- `status`
- `createdAt`

## 9. Champs notification utilises

- `id`
- `userId`
- `type`
- `title`
- `content`
- `read`
- `createdAt`

## 10. Points d'attention

- Le frontend React est deja branche sur le client `api.ts`.
- Si Django renvoie une liste vide, le frontend doit l'accepter comme un vrai etat vide.
- Si une route d'ecriture n'existe pas encore, React affichera l'erreur du backend.
- L'application attend que Django reponde sur `127.0.0.1:8000`.

## 11. Priorite cote Django

Si vous devez implémenter en premier:

1. `auth/login`
2. `auth/register`
3. `auth/profile`
4. `biens/mes_biens`
5. `reservations/reservations_pour_mes_biens`
6. `messages/conversations`
7. `notifications`
8. `favoris`
9. `ia/recherche/rechercher`
10. `ia/verifier-document/verifier`
