from django.apps import AppConfig
from django.core.management import call_command

from .fixtures.erc20 import write_query

class Erc20Config(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "erc20"

    def ready(self):
        write_query()

        call_command("loaddata", "erc20/fixtures/erc20.json")
