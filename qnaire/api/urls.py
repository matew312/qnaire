from django.urls import path
from .views import QuestionnaireView, QuestionView

urlpatterns = [
    path('questionnaire', QuestionnaireView.as_view()),
    path('question', QuestionView.as_view()),
]
