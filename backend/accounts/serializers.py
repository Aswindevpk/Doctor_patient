from rest_framework import serializers
from accounts.models import CustomUser,Address
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    USER_TYPE_CHOICES = (
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    )
    user_type = serializers.ChoiceField(choices=USER_TYPE_CHOICES)
    username = serializers.CharField(max_length=255)
    password = serializers.CharField()

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['line1','city','state','pincode']

class RegisterSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = User
        fields =['username','email','password','first_name','last_name','user_type','address','profile_pic']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['username']:
            if CustomUser.objects.filter(username=data['username']).exists():
                raise serializers.ValidationError("Entered username is already taken by another user")
            if len(data['username']) < 3:
                raise serializers.ValidationError("username should be atleast 3 characters")
        if data['email']:
            if CustomUser.objects.filter(email=data['email']).exists():
                raise serializers.ValidationError("Entered email is already taken by another user")

        # validate the passowrd if is it in correct format
        validate_password(data['password'])
        return data
    
    def create(self, data):
        address_data = data.pop('address')
        user = CustomUser.objects.create_user(**data)
        address = Address.objects.create(user=user,**address_data)
        return data
    
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class UserDetailSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = User
        fields = ['username','email','password','first_name','last_name','user_type','address','profile_pic']
