from django.shortcuts import render
from django.http import HttpResponse, response

# Create your views here.
def test_view(request):
    return HttpResponse('Test')
