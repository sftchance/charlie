from rest_framework import serializers

from .models import ERC20

class ERC20Serializer(serializers.ModelSerializer):
    class Meta:
        model = ERC20
        fields = '__all__'
