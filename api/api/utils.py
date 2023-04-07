from ens import ENS
from web3 import Web3

from django.conf import settings

mainnet_w3 = Web3(Web3.HTTPProvider(settings.PROVIDER))
ns = ENS.from_web3(mainnet_w3)


class ENSCache:
    def __init__(self):
        self.use_cached_nulls = True

    def address(self, name):
        useattr = hasattr(self, name) and (
            self.use_cached_nulls or getattr(self, name) is not None
        )

        if useattr:
            return getattr(self, name)

        address = ns.address(name)

        setattr(self, name, address)

        return address
