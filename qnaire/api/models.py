from django.db import models
from django.contrib.auth.models import User # create a custom user if needed

# Create your models here.

class Questionnaire(models.Model):
    name = models.CharField(max_length=100)
    anonymous = models.BooleanField(default=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True) # leave it nullable for now (in that case I will needed to check it during creation)
    created_at = models.DateTimeField(auto_now_add=True)


