# Scénarios utilisateur - Frontend LogCiv

## Parcours 1 - Visiteur

1. Arrive sur la page d’accueil.
2. Consulte les sections de présentation.
3. Utilise la navigation pour aller vers `À propos`.
4. Clique sur `Connexion` ou `Inscription`.

Attendu :

- navigation fluide ;
- pages correctement rendues ;
- CTA visibles et cohérents.

## Parcours 2 - Nouvel utilisateur

1. Ouvre la page d’inscription.
2. Remplit ses informations.
3. Choisit un rôle.
4. Complète les champs du profil.
5. Dépose les documents requis.
6. Valide son dossier.

Attendu :

- progression en étapes ;
- contrôles de validation ;
- confirmation d’inscription puis redirection.

## Parcours 3 - Utilisateur existant

1. Ouvre la page de connexion.
2. S’authentifie.
3. Est redirigé vers le dashboard selon son rôle.
4. Utilise la navigation pour accéder aux différentes sections.

Attendu :

- authentification fonctionnelle ;
- redirection vers le bon dashboard ;
- accès cohérent aux vues de travail.

## Parcours 4 - Recherche de logements

1. L’utilisateur cherche un bien par ville, type ou mot-clé.
2. La recherche renvoie une liste de logements pertinents.

Constat :

- la logique de recherche existe côté services, mais l’écran de recherche n’est pas encore visible dans le frontend inspecté.
