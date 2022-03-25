from distutils.log import Log
from django.urls import path
from .views import QuestionnaireCreationView, QuestionnaireView
from rest_framework.authtoken import views

urlpatterns = [
    path('auth/', views.obtain_auth_token),
    path('questionnaires/', QuestionnaireView.as_view()),
    path('questionnaires/<int:pk>/', QuestionnaireCreationView.as_view()),
]


