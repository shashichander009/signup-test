from rest_framework import serializers
from .models import CustomUser
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

class EmailSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

class PhoneSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['phone_number', 'password']

    def validate_phone_number(self, value):
        """Ensure phone number is exactly 10 digits."""
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        return value

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    email_or_phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email_or_phone = data.get("email_or_phone")
        password = data.get("password")

        user = None
        if "@" in email_or_phone:
            user = CustomUser.objects.filter(email=email_or_phone).first()
        else:
            user = CustomUser.objects.filter(phone_number=email_or_phone).first()

        if user and user.check_password(password):
            tokens = RefreshToken.for_user(user)
            return {
                "access": str(tokens.access_token),
                "refresh": str(tokens),
            }
        raise serializers.ValidationError("Invalid credentials")