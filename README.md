# LogCiv - Plateforme de Location Immobilière

LogCiv est une plateforme web complète de gestion et de location de propriétés immobilières.

## 📋 Structure du Projet

- **`artifacts/logciv/`** - Frontend React + TypeScript + Vite
- **`django_apis.md`** - Spécification complète des APIs Django à développer
- **`tsconfig.base.json`** - Configuration TypeScript partagée

## 🚀 Démarrage Rapide

### Frontend

```bash
cd artifacts/logciv
pnpm install
pnpm dev
```

Le serveur de développement démarre sur http://localhost:3000 (ou 3001 si le port est occupé).

### Commandes disponibles

- `pnpm dev` - Lance le serveur de développement
- `pnpm build` - Crée le build de production
- `pnpm serve` - Prévisualise le build de production
- `pnpm typecheck` - Vérifie les types TypeScript

## 📚 Documentation

### [(django_apis.md)](django_apis.md)
Spécification complète des APIs REST à développer avec Django, incluant :
- Authentification (inscription, connexion, JWT)
- Gestion des propriétés (biens immobiliers)
- Système de réservation
- Favoris et wishlist
- Messagerie
- Notifications
- Gestion des agents
- Plans tarifaires

## 🛠️ Stack Technologique

### Frontend
- **React** 18+ avec TypeScript
- **Vite** - Bundler ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Radix UI** - Composants accessibles
- **React Query** - Gestion de l'état asynchrone
- **React Hook Form** - Gestion des formulaires

### Backend (À développer)
- **Django** 4.x
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **Celery** - Tâches asynchrones
- **Redis** - Cache et message broker

## 📦 Dépendances Principales

Pour plus de détails, voir [`artifacts/logciv/package.json`](artifacts/logciv/package.json)

## 👥 Rôles Utilisateurs

- **Locataire** - Cherche et réserve des propriétés
- **Propriétaire** - Gère ses propriétés à louer
- **Agent** - Gère les propriétés de ses clients
- **Admin** - Gestion complète de la plateforme

## 🔐 Sécurité

- Authentification JWT avec tokens courte durée
- Vérification d'email obligatoire
- Validation côté serveur
- Permissions granulaires par rôle
- HTTPS obligatoire en production

## 📱 Fonctionnalités Principales

- ✅ Inscription et authentification
- ✅ Gestion de profil utilisateur
- ✅ Recherche et filtrage de propriétés
- ✅ Réservation de propriétés
- ✅ Gestion des favoris
- ✅ Messagerie intra-plateforme
- ✅ Notifications
- ✅ Plans tarifaires
- ✅ Dashboard administrateur

## 🐛 Signaler un Bug

Créez une issue dans le repository GitHub.

## 📝 License

À définir

## 👤 Auteur

Nacro Adjarato

---

**Note** : Ce projet est en développement. La documentation des APIs sera mise à jour régulièrement.
