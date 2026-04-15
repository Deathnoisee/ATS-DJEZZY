from .models import Users, Password_reset_tokens
from rest_framework import serializers


class userSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = Users
        fields = ('uuid', 'username', 'last_name', 'email', 'password', 'isRH', 'created_at', 'updated_at', 'deleted_at', 'is_deleted')

    def create(self, validated_data):
        user = Users.objects.create(
            username=validated_data['username'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            isRH=validated_data.get('isRH', False),
            password=validated_data['password']
        )
        return user

class HRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('uuid', 'username', 'last_name', 'email', 'isRH', 'created_at', 'updated_at', 'deleted_at', 'is_deleted')
    def create(self, validated_data):
        user = Users.objects.create(
            username=validated_data['username'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            isRH=True,
            password=validated_data['password']
        )
        return user
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('uuid', 'username', 'last_name', 'email', 'isRH', 'created_at', 'updated_at', 'deleted_at', 'is_deleted')
        read_only_fields = ('uuid', 'email', 'created_at')

class passwordResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Password_reset_tokens
        fields = '__all__'