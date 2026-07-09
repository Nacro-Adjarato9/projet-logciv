# API Service - LogCiv

Ce dossier contient le client React centralise pour consommer l'API Django.
Le fichier principal est `api.ts`.

## Points importants

- la base URL vient de `import.meta.env.VITE_API_URL`
- un fallback supporte aussi `process.env.REACT_APP_API_URL`
- les tokens sont stockes dans `localStorage`
- les cles utilisees sont `accessToken` et `refreshToken`
- le header `Authorization: Bearer <token>` est ajoute automatiquement

## Utilisation rapide

```typescript
import api, { authAPI, biensAPI, reservationsAPI } from "../services/api";

const biens = await biensAPI.list();
const me = await api.users.me();
```

## Authentification

```typescript
const data = await authAPI.login({
  email: "test@example.com",
  password: "password",
});

api.setTokens({
  access: data.access,
  refresh: data.refresh,
});
```

## Groupes disponibles

- `authAPI`
- `usersAPI`
- `biensAPI`
- `imagesAPI`
- `reservationsAPI`
- `chatAPI`
- `avisAPI`
- `favorisAPI`
- `notificationsAPI`
- `agencesAPI`
- `tarifsAPI`
- `abonnementsAPI`
- `iaAPI`
- `utilsAPI`

## Gestion des erreurs

Les erreurs lancees par `apiRequest()` contiennent en general:

- `message`
- `status`
- `data`

## Documentation associee

- [Guide React pour consommer l'API](/react_api_guide.md)
- [Integration Django <-> Front React](/django_frontend_integration.md)
