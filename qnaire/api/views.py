from django.shortcuts import render
from rest_framework import generics
from .models import Question, Questionnaire
from .serializers import QuestionnaireSerializer, QuestionPolymorphicSerializer

# Create your views here.

class QuestionnaireView(generics.ListAPIView):
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer

class QuestionView(generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionPolymorphicSerializer

