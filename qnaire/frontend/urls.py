from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('questionnaires/', index),
    path('questionnaires/<int:id>/', index),
    path('questionnaires/<int:id>/respond/', index),
]
