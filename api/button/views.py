from rest_framework import viewsets

from .models import Button
from .serializers import ButtonSerializer

class ButtonViewSet(viewsets.ModelViewSet):
    queryset = Button.objects.all()
    serializer_class = ButtonSerializer
