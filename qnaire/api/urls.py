from django.urls import path, include
from rest_framework.authtoken import views

urlpatterns = [
    path('auth/', views.obtain_auth_token),
    path('', include('api.routers')),
]
