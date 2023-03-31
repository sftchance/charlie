import os

from django.apps import AppConfig

from django.core.management import call_command


class Erc20Config(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "erc20"

    def ready(self):
        if not os.environ.get("RUN_MAIN"):
            return

        call_command("erc20", "--db")
