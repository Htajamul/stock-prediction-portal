from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type':'password'})
    class Meta:
        model = User
        fields = ['username','email','password']

   # User.Objects.create = save the password in a plain text
   # User.objects.create_user = automatically hash the password, so that we have use create_user method
    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user
        # OR
        # user User.objects.create_user(**validated_data)
        # return user


        # **validated_data OR validated_data['username'],
        #                     validated_data['email'],
        #                     validated_data['password']