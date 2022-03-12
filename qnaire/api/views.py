from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Question
from .serializers import CreateQuestionnaireSerializer, QuestionnaireCreationSerializer, QuestionnaireSerializer, QuestionPolymorphicSerializer

#import logging
#logging.basicConfig(level=logging.DEBUG)

# Create your views here.

class QuestionnaireView(generics.ListAPIView):
    def get_queryset(self):
        user = self.request.user
        return user.questionnaire_set.all()

    serializer_class = QuestionnaireSerializer
    permission_classes = [permissions.IsAuthenticated]

class QuestionnaireCreationView(generics.RetrieveAPIView):
    def get_queryset(self):
        user = self.request.user
        return user.questionnaire_set.all()

    serializer_class = QuestionnaireCreationSerializer
    permission_classes = [permissions.IsAuthenticated]


class CreateQuestionnaireView(generics.CreateAPIView):
    serializer_class = CreateQuestionnaireSerializer
    permission_classes = [permissions.IsAuthenticated]

class QuestionView(generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionPolymorphicSerializer

