from rest_framework import serializers
from .models import User, FarmerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type', 'phone_number', 'first_name', 'last_name']
        read_only_fields = ['id']


class FarmerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = FarmerProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'user_type', 'phone_number', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
