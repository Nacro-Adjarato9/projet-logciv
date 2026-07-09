# Intégration Django <-> Front React

Ce fichier contient la configuration à copier dans ton projet Django pour que ton application React puisse consommer les APIs.

## 1) Installer django-cors-headers

Dans l'environnement Python de ton projet Django :

```bash
pip install django-cors-headers
```

## 2) Mettre à jour `settings.py`

Ajouter dans `INSTALLED_APPS` :

```python
INSTALLED_APPS = [
    # ... autres apps
    "corsheaders",
    "rest_framework",
    # ...
]
```

Ajouter dans `MIDDLEWARE`, en tête de liste :

```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    # ... autres middlewares
]
```

Puis ajouter ces paramètres de CORS :

```python
from corsheaders.defaults import default_headers

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    "Authorization",
    "Content-Type",
]

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
]
```

## 3) Vérifier l'URL de l'API dans React

Dans le projet React, ajoute un fichier `.env` ou `.env.local` avec :

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Ton code React utilise alors `API_BASE_URL` via `import.meta.env.VITE_API_URL`.

## 4) Exemple minimal `urls.py`

Si ton API Django est servie sous `/api/`, assure-toi d'avoir un `urls.py` comme ceci :

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("ton_app.api_urls")),
]
```

## 5) Exemple de route authentification

Ton front React appelle :

- `POST /api/auth/login/`
- `POST /api/auth/register/`
- `POST /api/auth/refresh/`

Assure-toi que ces routes existent dans ton projet Django.

## 6) Résumé

- Django doit autoriser l’origine du front (`localhost:5173` ou `localhost:3000`).
- Le front doit pointer vers `http://127.0.0.1:8000/api` via `VITE_API_URL`.
- Active `django-cors-headers` et valide `ALLOWED_HOSTS`.

Avec ces paramètres, ton projet Django pourra servir l’API et ton projet React pourra la consommer sans blocage CORS.
