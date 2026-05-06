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
        exclude = [ 'isRH', 'created_at', 'updated_at', 'deleted_at', 'is_deleted', 'is_superuser', 'groups', 'user_permissions', 'last_login']
    def create(self, validated_data):
        validated_data['isRH'] = True
        return Users.objects.create_user(**validated_data)


class HRUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['username', 'last_name', 'email']


class DjoserUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['uuid', 'username', 'email', 'last_name', 'isRH', 'is_superuser', 'is_active']
        read_only_fields = ['uuid', 'username', 'email', 'last_name', 'isRH', 'is_superuser', 'is_active']

