from django.core.exceptions import ValidationError
from django.db import models

from erc20.models import ERC20


def validate_ethereum_address(value):
    if not value.startswith("0x") or len(value) != 42:
        raise ValidationError(
            _("%(value)s is not a valid Ethereum address"),
            params={"value": value},
        )


def validate_hex_color(value):
    if not value.startswith("#") or len(value) != 7:
        raise ValidationError(
            _("%(value)s is not a valid hex color code"),
            params={"value": value},
        )


class Button(models.Model):
    ethereum_address = models.CharField(
        max_length=256,
        blank=False,
        validators=[validate_ethereum_address],
        help_text="The Ethereum address to delegate to",
    )

    text = models.CharField(
        max_length=256,
        default="Delegate",
        blank=True,
        null=True,
        help_text="Text to display on button",
    )

    hex_color = models.CharField(
        max_length=7,
        default="#000000",
        blank=True,
        null=True,
        help_text="Hex color code, e.g. #000000",
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
