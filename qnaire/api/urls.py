from django.urls import path
from .views import QuestionnaireCreationView, QuestionnaireView, QuestionView

urlpatterns = [
    path('questionnaires/', QuestionnaireView.as_view()),
    path('questionnaires/<int:pk>/', QuestionnaireCreationView.as_view()),
    path('questions/', QuestionView.as_view()),
]
