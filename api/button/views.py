from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Button
from .serializers import ButtonSerializer, NestedButtonSerializer


class ButtonViewSet(viewsets.ModelViewSet):
    queryset = Button.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Button.objects.none()

        user = self.request.user

        if user.is_superuser:
            return self.queryset

        return self.queryset.filter(wallet=user)

    def get_serializer_class(self):
        list_actions = ["list", "retrieve"]
        if self.action in list_actions:
            return NestedButtonSerializer

        return ButtonSerializer

    def perform_create(self, serializer):
        serializer.save(wallet=self.request.user)
