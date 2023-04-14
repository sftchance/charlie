import environ
import os

from pathlib import Path

from django.core.management.utils import get_random_secret_key

env = environ.Env(
    LOCAL=(bool, False),
    DEBUG=(bool, False),
    SECRET_KEY=(str, get_random_secret_key()),
    DATABASE_URL=(str, "sqlite:///db.sqlite3"),
    SHROOMDK_KEY=(str, ""),
    ALCHEMY_KEY=(str, ""),
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent

environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")

DEBUG = env("DEBUG")
LOCAL = env("LOCAL")

CORS_ALLOW_CREDENTIALS = True

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    ".fly.dev",
    ".trycharlie.xyz",
] 

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173", 
    "http://10.0.0.95:5173",
    "http://*.vercel.app",
    "https://*.vercel.app",
    "http://*.fly.dev",
    "https://*.fly.dev",
    "http://*.trycharlie.xyz",
    "https://*.trycharlie.xyz",
]

# Application definition
INSTALLED_APPS = [
    "siwe_auth.apps.SiweAuthConfig",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "api",
    "button",
    "erc20",
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

ROOT_URLCONF = "api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "api.wsgi.application"

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    "default": env.db("DATABASE_URL", default="sqlite:///db.sqlite3")
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ShroomDK settings enabling Blockchain data fixtures
SHROOMDK_KEY = env("SHROOMDK_KEY")

# Blockchain Data Providers
AUTH_USER_MODEL = "siwe_auth.Wallet"

AUTHENTICATION_BACKENDS = [
    "siwe_auth.backend.SiweBackend",
]

LOGIN_URL = "/api/auth/login"

SESSION_COOKIE_AGE = 3 * 60 * 60  # 3 hours

CREATE_ENS_PROFILE_ON_AUTHN = False

PROVIDER = f"https://eth-mainnet.g.alchemy.com/v2/{env('ALCHEMY_KEY')}"
