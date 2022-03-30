from django.urls import path, include
from .views import index

urlpatterns = [
    path('', index),
    path('login/', index),
    path('questionnaires/', index),
    path('questionnaires/<int:pk>/', index),
    path('questionnaires/<int:pk>/respond/', index),
    path('questionnaires/<int:pk>/respond/<str:private_id>', index),
]
