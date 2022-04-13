from django.urls import path, include
from .views import index

urlpatterns = [
    path('', index),
    path('login/', index),
    path('questionnaires/', index),
    path('questionnaires/<int:pk>/', index),
    path('questionnaires/<int:pk>/response/', index),
    path('questionnaires/<int:pk>/response/<str:private_id>/', index),
]
