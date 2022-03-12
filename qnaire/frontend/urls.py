from django.urls import path, include
from .views import index

urlpatterns = [
    path('', index),
    path('questionnaires/', index),
    path('questionnaires/<int:pk>/', index),
    path('questionnaires/<int:pk>/respond/', index),
]
