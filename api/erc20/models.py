from django.db import models


class ERC20(models.Model):
    ethereum_address = models.CharField(max_length=100)
    chain_id = models.IntegerField(default=1)

    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=100)

    decimals = models.IntegerField()

    def __str__(self):
        return self.name
