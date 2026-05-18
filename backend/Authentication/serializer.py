from djoser.serializers import UserSerializer as DjoserUserSerializer
from .models import Users
from rest_framework import serializers


class candidateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = Users
        exclude = [  'created_at', 'updated_at', 'deleted_at', 'is_deleted', 'is_superuser', 'groups', 'user_permissions', 'last_login']
    def create(self, validated_data):
        return Users.objects.create_user(**validated_data)


class hrSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = Users
        exclude = ['created_at', 'updated_at', 'deleted_at', 'is_deleted', 'groups', 'user_permissions', 'last_login']

    def create(self, validated_data):
        validated_data['isRH'] = True
        validated_data['is_superuser'] = False
        return Users.objects.create_user(**validated_data)

class DjoserUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['uuid', 'username', 'email', 'last_name', 'isRH', 'is_superuser']
        read_only_fields = ['uuid', 'username', 'email', 'last_name', 'isRH', 'is_superuser']
class HRUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['username', 'last_name', 'email']



