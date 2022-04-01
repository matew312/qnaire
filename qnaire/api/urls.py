from django.urls import path, include
from rest_framework.authtoken import views

from .views import PrivateQnaireIdView, ResponseView, ResultView

urlpatterns = [
    path('auth/', views.obtain_auth_token),
    path('questionnaires/<int:id>/response/', ResponseView.as_view()),
    path('questionnaires/<int:id>/result/', ResultView.as_view()),
    path('questionnaires/<int:id>/private-id/', PrivateQnaireIdView.as_view()),
    path('', include('api.routers')),
]
