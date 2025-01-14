from django.urls import path
from . import views
from .views import UserStatisticsView, UserView, AddFriendAPIView, ListFriendsAPIView, send_otp, validate_otp
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
    path('add-friend/', AddFriendAPIView.as_view(), name='add_friend'),
    path('friends/', ListFriendsAPIView.as_view(), name='list_friends'),
    path('send-otp/', send_otp, name='send-otp'),
    path('validate-otp/', validate_otp, name='validate-otp'),
]
