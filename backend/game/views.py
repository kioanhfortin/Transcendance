from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer

# Create your views here.
class HelloWorld(APIView):
    renderer_classes = [JSONRenderer]
    def get(self, request):
        return Response({"message": "Hello, world!"}, status=status.HTTP_200_OK)