from django.db import models


class ERC20(models.Model):
    ETHEREUM = ("ethereum", 1)
    AVALANCHE = ("avalanche", 43114)
    POLYGON = ("polygon", 137)
    ARBITRUM = ("arbitrum", 42161)
    OPTIMISM = ("optimism", 10)
    NETWORKS = (ETHEREUM, AVALANCHE, POLYGON, ARBITRUM, OPTIMISM)

    ethereum_address = models.CharField(max_length=100)

    blockchain = models.CharField(max_length=256, default="ethereum")
    chain_id = models.IntegerField(default=1)

    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=100)

    decimals = models.IntegerField()

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ("ethereum_address", "chain_id")
        ordering = ["-created"]
