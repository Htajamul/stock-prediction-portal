from django.shortcuts import render

# Create your views here.

from .serializers import UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# for forget passsword
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes,force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail

# for google auth
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken

# for fb 
import requests
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

# User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        response={
            'status':'request was permitted'
        }
        return Response(response)

class ForgotPasswordView(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        email = request.data.get('email')
        # print(email)
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)
        uid = urlsafe_base64_encode(force_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        reset_link = f"http://localhost:5173/reset/{uid}/{token}"
        send_mail(
            subject="Password Reset",
            message=f"Click this link to reset password: {reset_link}",
            from_email="htajamul123@gmail.com",
            recipient_list=[email],
        )
        return Response({"message": "Reset link sent to email"})
    
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')
        # print(uid,token,password)
        try:
            User_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=User_id)
        except:
            return Response({"error": "Invalid UID"}, status=400)
        if not PasswordResetTokenGenerator().check_token(user,token):
            return Response({"error": "Invalid or expired token"}, status=400)
         #  Validate password
        if len(password) < 6:
            return Response({"error": "Password too short"}, status=400)
        user.set_password(password)
        user.save()
        return Response({"message": "Password reset successful"}, status=200)
    


class GoogleLoginView(APIView):
    def post(self,request):
        token = request.data.get('token')
        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                '1047035170486-ikuvctc7fihsomn71onsbhre1egfp3hf.apps.googleusercontent.com'
            )
            email = idinfo['email']
            name = idinfo.get('name', '')
            # print(name,email)
            user, created = User.objects.get_or_create(
                username=email,
                defaults={'email': email}
            )
            # Generate JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
        except ValueError:
            return Response({"error": "Invalid token"}, status=400)    
        

class FacebookLoginView(APIView):
    def post(self, request):
        access_token = request.data.get('access_token')
        # print(access_token)
        if not access_token:
            return Response({"error": "Access token required"}, status=400)

        try:
            # Get user info from Facebook
            url = f"https://graph.facebook.com/me?fields=id,name,email&access_token={access_token}"
            # print(url)
            response = requests.get(url)
            data = response.json() # user data get from fb
            if 'error' in data:
                return Response({"error": "Invalid token"}, status=400)

            email = data.get('email')
            name = data.get('name')
            if not email:
                email = f"{data['id']}@facebook.com"
            #  Create or get user
            user = User.objects.filter(email=email).first()
            if not user:
                user = User.objects.create(
                    username=email,
                    email=email
            )
            # user, created = User.objects.get_or_create(
            #     email=email,
            #     defaults={"username": email}
            # )

            #  Generate JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "email": user.email,
                    "name": name
                }
            })
        except Exception:
            return Response({"error": "Something went wrong"}, status=500)        