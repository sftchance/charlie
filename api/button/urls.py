from rest_framework import routers

from .views import ButtonViewSet

router = routers.DefaultRouter()

router.register(r"buttons", ButtonViewSet)
