from rest_framework import routers

from django.contrib import admin
from django.urls import include, path

from button.urls import router as button_router
from erc20.urls import router as erc20_router

router = routers.DefaultRouter()
router.registry.extend(button_router.registry)
router.registry.extend(erc20_router.registry)

urlpatterns = router.urls + [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
]
