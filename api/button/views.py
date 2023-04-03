from rest_framework import viewsets

from .models import Button
from .serializers import ButtonSerializer, NestedButtonSerializer


class ButtonViewSet(viewsets.ModelViewSet):
    queryset = Button.objects.all()

    def get_serializer_class(self):
        list_actions = ["list", "retrieve"]
        if self.action in list_actions:
            return NestedButtonSerializer

        return ButtonSerializer
