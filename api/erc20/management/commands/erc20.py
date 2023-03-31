from django.core.management import call_command
from django.core.management.base import BaseCommand

from erc20.fixtures.erc20 import delete_table, load_db, load_fixture, load_query


class Command(BaseCommand):
    """
    Manages the backing ERC20 table for supported tokens of the Charlie protocol. By adopting a raw framework, Charlie
    can support any ERC20 token that is listed on the Flipside Crypto ERC20 Query with ease.

    Powering the ability to build the SQL query run by Flipside, as can be seen here:
    https://flipsidecrypto.xyz/nftchance__/q/governor-jHpixb

    Usage:
    > python manage.py erc20s --build
    > python manage.py erc20s --delete
    > python manage.py erc20s --fixture
    > python manage.py erc20s --db
    > python manage.py erc20s --all

    > python manage.py erc20s --build --fixture

    > Note: This command is not intended to be used by the end user.
    >       It is intended to be used by the developer to manage the ERC20 table.
    """

    help = "Builds the ERC20 table"

    def add_arguments(self, parser):
        parser.add_argument(
            "--sql",
            action="store_true",
            dest="sql",
            default=False,
            help="Build the ERC20 Flipside Query for ShroomDK",
        )

        parser.add_argument(
            "--delete",
            action="store_true",
            dest="delete",
            default=False,
            help="Delete the ERC20 table",
        )

        parser.add_argument(
            "--fixture",
            action="store_true",
            dest="fixture",
            default=False,
            help="Load the output into a fixture",
        )

        parser.add_argument(
            "--db",
            action="store_true",
            dest="db",
            default=False,
            help="Load the fixture into the database",
        )

        parser.add_argument(
            "--all",
            action="store_true",
            dest="all",
            default=False,
            help="Build, Delete, and Load the ERC20 table",
        )

    def handle(self, *args, **options):
        if options["sql"] or options["all"]:
            load_query()

            self.stdout.write(self.style.SUCCESS("Successfully built the ERC20 query."))

        if options["fixture"] or options["all"]:
            load_fixture()

            self.stdout.write(
                self.style.SUCCESS("Successfully loaded the ERC20 table.")
            )

        if options["delete"] or options["all"]:
            delete_table()

            self.stdout.write(
                self.style.SUCCESS("Successfully deleted the ERC20 table.")
            )

        if options["db"] or options["all"]:
            load_db()

            self.stdout.write(
                self.style.SUCCESS("Successfully loaded the ERC20 table.")
            )
