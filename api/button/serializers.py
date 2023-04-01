from rest_framework import serializers

from erc20.serializers import ERC20Serializer

from .models import Button


class ButtonSerializer (serializers.ModelSerializer):
    class Meta:
        model = Button
        fields = "__all__"

class NestedButtonSerializer(serializers.ModelSerializer):
    tokens = ERC20Serializer(many=True, read_only=True)

    class Meta:
        model = Button
        fields = "__all__"
