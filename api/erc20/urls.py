from rest_framework import routers

from .views import ERC20ViewSet

router = routers.DefaultRouter()

router.register(r"erc20", ERC20ViewSet)
