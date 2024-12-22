from django.urls import path
from .views import HelloWorld, UserRegistrationView

urlpatterns = [
    path('hello/', HelloWorld.as_view(), name='hello_world'),
    path('register/', UserRegistrationView.as_view(), name='register'),
]