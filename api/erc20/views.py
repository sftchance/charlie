from rest_framework import viewsets

from .models import ERC20
from .serializers import ERC20Serializer


class ERC20ViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ERC20.objects.all()
    serializer_class = ERC20Serializer
