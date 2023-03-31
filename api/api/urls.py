from rest_framework import routers
from rest_framework.schemas import get_schema_view

from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

from button.urls import router as button_router
from erc20.urls import router as erc20_router

router = routers.DefaultRouter()
router.registry.extend(button_router.registry)
router.registry.extend(erc20_router.registry)

schema_view = get_schema_view(
    title="Charlie",
    description="Since the beginning of the onchain governance, delegation has remained underutilized resulting in centralized organizations that are controlled by a select few whales.",
    version="0.1",
    public=True,
)

urlpatterns = router.urls + [
    path("admin/", admin.site.urls),
    # Authentication urls
    path("api-auth/", include("rest_framework.urls")),
    # Documentation urls
    path(
        "docs/",
        TemplateView.as_view(
            template_name="docs.html", extra_context={"schema_url": "openapi-schema"}
        ),
        name="docs",
    ),
    path("openapi", schema_view, name="openapi-schema"),
]
