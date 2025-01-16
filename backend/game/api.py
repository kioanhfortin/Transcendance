from django.urls import path
from . import views
from .views import UserStatisticsView, UserView, UserHistoryView, FriendsAPIView, UpdateAvatarView, send_otp, validate_otp, enable_2fa, PasswordResetRequestView, PasswordResetConfirmView
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import (
    LoginView,
    LogoutView,
    UserDetailsView,
    PasswordResetView, #TODO?
    PasswordChangeView #TODO
    )
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', LoginView.as_view(), name='api_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='api_register'),
    path('statistics/', UserStatisticsView.as_view(), name='api_statistics'),
    path('logout/', LogoutView.as_view(), name='api_logout'),
    path('user/', UserView.as_view(), name='api_user'),
    path('user-history/', UserHistoryView.as_view(), name='api_user-history'),
    path('update-avatar/', UpdateAvatarView.as_view(), name='api_update_avatar'),
    path('friends/', FriendsAPIView.as_view(), name='api_friends'),
    path('send-otp/', send_otp, name='send-otp'),
    path('validate-otp/', validate_otp, name='validate-otp'),
    path('enable-2fa/', enable_2fa, name='enable_2fa'),
    path('password-reset/', PasswordResetRequestView.as_view(), name="password-reset-request"),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
]
