from django.urls import path
from .views import HelloWorld, UserStatisticsView # UserRegistrationView,
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import (
    LoginView,
    LogoutView,
    UserDetailsView,
    PasswordResetView,
    PasswordChangeView
    )
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('hello/', HelloWorld.as_view(), name='hello_world'),
    path("login/", LoginView.as_view(), name="api_login"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='api_register'),
    path('statistics/', UserStatisticsView.as_view(), name='api_statistics'),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]