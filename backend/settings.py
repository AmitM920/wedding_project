# """
# Django settings for backend project.
# """

# from dotenv import load_dotenv
# import os
# from pathlib import Path
# import dj_database_url

# load_dotenv()
# print(f"✅ .env loaded. CLOUDINARY_CLOUD_NAME: {os.environ.get('CLOUDINARY_CLOUD_NAME')}")

# BASE_DIR = Path(__file__).resolve().parent.parent

# SECRET_KEY = os.environ.get(
#     "NEW_SECRET", "django-insecure-j00@smvss!@*pgd&9&9ic8$8x19(#^tz5wlh&w2&e7q2_4$a4r"
# )

# DEBUG = os.environ.get("DEBUG", "False") == "True"

# ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")

# INSTALLED_APPS = [
#     "django.contrib.admin",
#     "django.contrib.auth",
#     "django.contrib.contenttypes",
#     "django.contrib.sessions",
#     "django.contrib.messages",
#     "django.contrib.staticfiles",
#     "cloudinary",
#     "cloudinary_storage",
#     "rest_framework",
#     "corsheaders",
#     "django_filters",
#     "gallery",
# ]

# MIDDLEWARE = [
#     "corsheaders.middleware.CorsMiddleware",
#     "django.middleware.security.SecurityMiddleware",
#     "whitenoise.middleware.WhiteNoiseMiddleware",
#     "django.contrib.sessions.middleware.SessionMiddleware",
#     "django.middleware.common.CommonMiddleware",
#     "django.middleware.csrf.CsrfViewMiddleware",
#     "django.contrib.auth.middleware.AuthenticationMiddleware",
#     "django.contrib.messages.middleware.MessageMiddleware",
#     "django.middleware.clickjacking.XFrameOptionsMiddleware",
# ]

# default_cors = "http://localhost:5173,http://localhost:3000,https://wedding-project-pink.vercel.app"
# CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", default_cors).split(",")
# CORS_ALLOW_ALL_ORIGINS = DEBUG
# CORS_ALLOW_CREDENTIALS = True

# # SIMPLE FIX: Disable CSRF for file uploads temporarily
# CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

# REST_FRAMEWORK = {
#     "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
#     "DEFAULT_PERMISSION_CLASSES": [
#         "rest_framework.permissions.AllowAny",
#     ],
#     'DEFAULT_PARSER_CLASSES': [
#         'rest_framework.parsers.JSONParser',
#         'rest_framework.parsers.FormParser',
#         'rest_framework.parsers.MultiPartParser',
#         'rest_framework.parsers.FileUploadParser',
#     ],
# }

# ROOT_URLCONF = "backend.urls"

# TEMPLATES = [
#     {
#         "BACKEND": "django.template.backends.django.DjangoTemplates",
#         "DIRS": [os.path.join(BASE_DIR, "templates")],
#         "APP_DIRS": True,
#         "OPTIONS": {
#             "context_processors": [
#                 "django.template.context_processors.request",
#                 "django.contrib.auth.context_processors.auth",
#                 "django.contrib.messages.context_processors.messages",
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = "backend.wsgi.application"

# DATABASE_URL = os.environ.get("DATABASE_URL")

# if DATABASE_URL:
#     DATABASES = {
#         "default": dj_database_url.config(
#             default=DATABASE_URL,
#             conn_max_age=600,
#             ssl_require=not DEBUG
#         )
#     }
# else:
#     DATABASES = {
#         "default": {
#             "ENGINE": "django.db.backends.sqlite3",
#             "NAME": BASE_DIR / "db.sqlite3",
#         }
#     }

# # Cloudinary config
# import cloudinary
# import cloudinary.uploader
# import cloudinary.api

# CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME", "dddxxtr7o")
# API_KEY = os.environ.get("CLOUDINARY_API_KEY", "815376427527426")
# API_SECRET = os.environ.get("CLOUDINARY_API_SECRET", "8IVyKq5lrmHC2PdX0h4QHiWvpH4")

# print(f"✅ Cloudinary Config - Name: {CLOUD_NAME}")

# cloudinary.config(
#     cloud_name=CLOUD_NAME,
#     api_key=API_KEY,
#     api_secret=API_SECRET,
#     secure=True,
# )

# CLOUDINARY_CLOUD_NAME = CLOUD_NAME
# CLOUDINARY_API_KEY = API_KEY
# CLOUDINARY_API_SECRET = API_SECRET

# CLOUDINARY_STORAGE = {
#     'CLOUD_NAME': CLOUD_NAME,
#     'API_KEY': API_KEY,
#     'API_SECRET': API_SECRET,
#     'SECURE': True,
# }

# DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
# MEDIA_URL = '/media/'

# if not DEBUG:
#     SECURE_SSL_REDIRECT = True
#     SESSION_COOKIE_SECURE = True
#     CSRF_COOKIE_SECURE = True
#     SECURE_BROWSER_XSS_FILTER = True
#     SECURE_CONTENT_TYPE_NOSNIFF = True
#     SECURE_HSTS_SECONDS = 31536000
#     SECURE_HSTS_INCLUDE_SUBDOMAINS = True
#     SECURE_HSTS_PRELOAD = True
#     SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
#     },
# ]

# LANGUAGE_CODE = "en-us"
# TIME_ZONE = "UTC"
# USE_I18N = True
# USE_TZ = True

# STATIC_URL = "/static/"
# STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# if DEBUG:
#     STATICFILES_DIRS = [
#         os.path.join(BASE_DIR, "static"),
#     ]
# else:
#     STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# # ✅ CRITICAL FIX: UPLOAD LIMITS FOR RENDER
# DATA_UPLOAD_MAX_MEMORY_SIZE = 2147483648  # 2GB (for 1.6GB total)
# FILE_UPLOAD_MAX_MEMORY_SIZE = 104857600   # 100MB per file
# DATA_UPLOAD_MAX_NUMBER_FIELDS = 10000     # Increased form fields
# DATA_UPLOAD_MAX_NUMBER_FILES = 200        # Allow 200 files at once

# # ✅ IMPORTANT: Reduce batch size for Render (avoids timeout)
# FILE_UPLOAD_HANDLERS = [
#     "django.core.files.uploadhandler.MemoryFileUploadHandler",
#     "django.core.files.uploadhandler.TemporaryFileUploadHandler",
# ]

# # ✅ SIMPLE FIX: Disable CSRF for upload endpoint only (temporary)
# # Add this line
# CSRF_EXEMPT_URLS = ['/api/upload/', '/upload/']  # Your upload endpoints


"""
Django settings for backend project.
"""
import os
from pathlib import Path
import dj_database_url
from dotenv import load_dotenv

# Load local .env file if it exists (ignored in production)
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# 1. SECURITY: No fallback secrets. If it's missing in production, the app crashes (which is safer than running insecure).
SECRET_KEY = os.environ.get("SECRET_KEY", os.environ.get("NEW_SECRET", "django-insecure-local-dev-only"))

# 2. DEBUG: Explicitly check for 'True'. Defaults to False.
DEBUG = os.environ.get("DEBUG", "False") == "True"

# 3. ALLOWED_HOSTS: Defaults to localhost, production is set via env var.
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "cloudinary",
    "cloudinary_storage",
    "rest_framework",
    "corsheaders",
    "django_filters",
    "gallery",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# 4. CORS & CSRF: Locked down to your actual domains
default_cors = "http://localhost:5173,http://127.0.0.1:5173,https://dist-tawny-psi.vercel.app"
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", default_cors).split(",")
CSRF_TRUSTED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS", default_cors).split(",")

# Never allow all origins in production
CORS_ALLOW_ALL_ORIGINS = False 
CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
}

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# 5. DATABASE: Set conn_max_age to 0 for Neon. 
# Neon sleeps when idle, and holding a connection for 600s will cause a crash when it wakes up.
DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=0, 
            ssl_require=not DEBUG
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# 6. CLOUDINARY: Absolutely NO hardcoded fallbacks.
import cloudinary
import cloudinary.uploader
import cloudinary.api

CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME")
API_KEY = os.environ.get("CLOUDINARY_API_KEY")
API_SECRET = os.environ.get("CLOUDINARY_API_SECRET")

cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET,
    secure=True,
)

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': CLOUD_NAME,
    'API_KEY': API_KEY,
    'API_SECRET': API_SECRET,
    'SECURE': True,
}

# Django 5.0+ Storage Configuration
STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
MEDIA_URL = '/media/'

# 7. PRODUCTION SECURITY HEADERS
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

if DEBUG:
    STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# 8. UPLOAD LIMITS: Render's free tier only has 512MB of RAM. 
# Setting this to 2GB will crash your server (OOM). 
# Since uploads go directly to Cloudinary via frontend, we don't need huge limits.
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
DATA_UPLOAD_MAX_NUMBER_FIELDS = 10000
DATA_UPLOAD_MAX_NUMBER_FILES = 200

FILE_UPLOAD_HANDLERS = [
    "django.core.files.uploadhandler.MemoryFileUploadHandler",
    "django.core.files.uploadhandler.TemporaryFileUploadHandler",
]