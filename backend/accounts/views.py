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
         # ✅ Validate password
        if len(password) < 6:
            return Response({"error": "Password too short"}, status=400)
        user.set_password(password)
        user.save()
        return Response({"message": "Password reset successful"}, status=200)