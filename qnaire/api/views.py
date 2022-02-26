from django.shortcuts import render
from rest_framework import generics
from .models import Questionnaire
from .serializers import QuestionnaireSerializer

# Create your views here.

class QuestionnaireView(generics.ListAPIView):
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer

