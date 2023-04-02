import uuid

from web3 import Web3

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from erc20.models import ERC20
from api.utils import ENSCache

ns = ENSCache()


def validate_ethereum_address(value):
    try:
        checksummed = Web3.to_checksum_address(value)

        return checksummed
    except ValueError:
        print("Not a valid Ethereum address")

        if ".eth" not in value:
            raise ValidationError(
                _("%(value)s is not a valid Ethereum address"),
                params={"value": value},
            )

        try:
            ens_address = ns.address(value)
        except ValueError:
            raise ValidationError(
                _("%(value)s is not a valid ENS name"),
                params={"value": value},
            )

        if ens_address:
            return ens_address

        raise ValidationError(
            _("%(value)s is not a valid Ethereum address or ENS name"),
            params={"value": value},
        )


def validate_hex_color(value):
    if not value.startswith("#") or len(value) != 7:
        raise ValidationError(
            _("%(value)s is not a valid hex color code"),
            params={"value": value},
        )


class Button(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    ethereum_address = models.CharField(
        max_length=256,
        blank=False,
        validators=[validate_ethereum_address],
        help_text="The Ethereum address to delegate to",
    )

    name = models.CharField(
        max_length=256,
        blank=False,
        help_text="Name of button",
    )

    description = models.TextField(
        max_length=256,
        blank=True,
        help_text="Description of button",
    )

    text = models.CharField(
        max_length=256,
        blank=False,
        help_text="Text to display on button",
    )

    primary_color = models.CharField(
        max_length=7,
        blank=False,
        help_text="Hex color code, e.g. #000000",
        validators=[validate_hex_color],
    )

    secondary_color = models.CharField(
        max_length=7,
        blank=False,
        help_text="Hex color code, e.g. #FFFFFF",
        validators=[validate_hex_color],
    )

    tokens = models.ManyToManyField(
        ERC20,
        blank=True,
        help_text="Tokens to delegate",
    )

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.ethereum_address}"

    class Meta:
        ordering = ["-created"]


@receiver(pre_save, sender=Button)
def button_pre_save(sender, instance, **kwargs):
    instance.ethereum_address = validate_ethereum_address(instance.ethereum_address)
