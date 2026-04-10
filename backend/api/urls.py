
from django.urls import path,include
from accounts import views as UserViews
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
# for google auth
# from .views import GoogleLoginView
urlpatterns = [
    path('register/',UserViews.RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-view/',UserViews.ProtectedView.as_view(),name='protected'),
    path('forgot-password/',UserViews.ForgotPasswordView.as_view(),name='forget-password'),
    path('reset-password/',UserViews.ResetPasswordView.as_view(),name='reset-password'),
    path('google-login/', UserViews.GoogleLoginView.as_view()), # for google auth
    # for facebook
    path('facebook-login/', UserViews.FacebookLoginView.as_view()),

    
]
  
