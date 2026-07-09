# Rapport de tests manuels - Frontend LogCiv

- Date du contrôle : 2026-05-31
- Périmètre : navigation, affichage des pages, connexion / inscription, recherche de logements
- Méthode : revue manuelle du code UI + vérification `tsc` réussie

## Résultat global

- Navigation : OK
- Affichage des pages : OK
- Connexion / inscription : OK
- Recherche logements : Partiel

## Détail des vérifications

| Zone testée | Résultat | Preuves |
|---|---|---|
| Navigation principale | OK | Le composant Navbar contient les liens Accueil, À propos, Inscription, Connexion et Dashboard selon l’état de session. Voir [src/components/Navbar.tsx](../artifacts/logciv/src/components/Navbar.tsx). |
| Routage et affichage pages | OK | Les routes `/`, `/apropos`, `/tarifs`, `/inscription`, `/connexion` et les dashboards par rôle sont déclarées dans [src/App.tsx](../artifacts/logciv/src/App.tsx). |
| Connexion | OK | Le formulaire de connexion est présent, valide les champs, appelle l’API de login puis redirige vers le dashboard du rôle de l’utilisateur. Voir [src/pages/Connexion.tsx](../artifacts/logciv/src/pages/Connexion.tsx). |
| Inscription | OK | L’inscription est découpée en étapes, gère le rôle, les documents et l’appel API de création de compte. Voir [src/pages/Inscription.tsx](../artifacts/logciv/src/pages/Inscription.tsx). |
| Recherche logements | Partiel | Une recherche existe côté services (`utilsAPI.search` et `iaAPI.rechercher`), mais aucun champ de recherche dédié n’est visible dans les pages frontend inspectées. Voir [src/services/api.ts](../artifacts/logciv/src/services/api.ts) et [src/pages/Home.tsx](../artifacts/logciv/src/pages/Home.tsx). |

## Scénarios utilisateur

### 1. Navigation

1. Ouvrir la page d’accueil.
2. Cliquer sur `Accueil`.
3. Cliquer sur `À propos`.
4. Cliquer sur `Inscription`.
5. Cliquer sur `Connexion`.
6. Ouvrir le menu mobile et vérifier les mêmes liens.

Résultat attendu :

- chaque lien amène vers la bonne page ;
- le menu mobile s’ouvre et se ferme correctement ;
- quand un utilisateur est connecté, les liens `Dashboard` et `Déconnexion` remplacent les boutons de connexion.

### 2. Affichage des pages

1. Ouvrir `/`.
2. Ouvrir `/apropos`.
3. Ouvrir `/tarifs`.
4. Ouvrir `/connexion`.
5. Ouvrir `/inscription`.
6. Ouvrir une route inconnue.

Résultat attendu :

- les pages s’affichent sans erreur visible ;
- la page 404 s’affiche sur une route inconnue ;
- les sections principales sont présentes sur chaque page.

### 3. Connexion

1. Aller sur `/connexion`.
2. Saisir un email valide.
3. Saisir un mot de passe.
4. Envoyer le formulaire.

Résultat attendu :

- si l’API répond correctement, l’utilisateur est connecté ;
- les tokens sont sauvegardés ;
- l’utilisateur est redirigé vers son dashboard ;
- en cas d’erreur, un message s’affiche sous le champ email.

### 4. Inscription

1. Aller sur `/inscription`.
2. Remplir les informations personnelles.
3. Choisir un rôle.
4. Compléter les informations du profil.
5. Uploader les documents demandés.
6. Valider l’inscription.

Résultat attendu :

- le formulaire passe d’une étape à l’autre ;
- les validations bloquent les champs invalides ;
- la création de compte appelle l’API ;
- un état de succès apparaît, puis redirection vers la connexion.

### 5. Recherche logements

1. Vérifier la présence d’un champ ou d’une action de recherche visible dans l’UI.
2. Si une recherche UI existe, lancer une recherche par ville, type ou mot-clé.

Résultat constaté :

- aucune barre de recherche dédiée n’est visible dans les pages inspectées ;
- la recherche semble être préparée côté services API, mais pas exposée dans l’interface front actuelle.

## Vérification technique

- `npm.cmd run typecheck` : OK
- `npm.cmd run build` : échec lié à la résolution de `vite.config.ts` dans l’environnement Windows courant, pas à une erreur TypeScript du code applicatif

## Conclusion

Le frontend couvre correctement la navigation, l’affichage des pages, la connexion et l’inscription.  
La recherche de logements reste à exposer dans l’interface si tu veux un test utilisateur complet de bout en bout.
