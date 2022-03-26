from enum import Enum
from django.db import models
from django.core.validators import MinValueValidator
from polymorphic.models import PolymorphicModel
from accounts.models import User
from secrets import token_urlsafe

from .validators import GreaterThanValidator

# Create your models here.


class Respondent(models.Model):
    # will be modified later to fit requirements
    special_id = models.CharField(max_length=64)
    submit_timestamp = models.DateTimeField(auto_now_add=True)


class Questionnaire(models.Model):
    name = models.CharField(max_length=100)
    anonymous = models.BooleanField(default=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.name}'


class Section(models.Model):
    qnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order_num = models.IntegerField(validators=[MinValueValidator(0)])

    def __str__(self) -> str:
        return f'{self.name}'


class Question(PolymorphicModel):
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    # maybe make question text a CharField and add new TextField called description
    text = models.TextField()
    mandatory = models.BooleanField()
    order_num = models.IntegerField(validators=[MinValueValidator(0)])

    def __str__(self) -> str:
        return f'{self.text}'


class OpenQuestion(Question):
    min_length = models.IntegerField(
        null=True, validators=[MinValueValidator(0)])
    max_length = models.IntegerField(
        null=True, validators=[MinValueValidator(0)])


class RangeQuestion(Question):
    # IntegerField for type seems more reasonable than CharField
    ENUMERATE = 1
    SLIDER = 2
    FIELD = 3
    # later add 'rating'

    TYPE_CHOICES = (
        (ENUMERATE, 'Enumerate'),
        (SLIDER, 'Slider'),
        (FIELD, 'Field')
    )

    MAX_CHOICES_FOR_ENUMERATE = 100

    type = models.IntegerField(choices=TYPE_CHOICES)
    # maybe change these to DecimalField later (and num_value in Answer)
    min = models.FloatField()
    max = models.FloatField()
    step = models.FloatField(null=True, validators=[GreaterThanValidator(0)])


class MultipleChoiceQuestion(Question):
    # I will allow 0 min_answers (it means the chosing nothing will be OK even if required=true)
    min_answers = models.IntegerField(validators=[MinValueValidator(0)])
    max_answers = models.IntegerField(
        null=True, validators=[MinValueValidator(0)])
    other_choice = models.BooleanField(default=False)
    random_order = models.BooleanField(default=False)


class Choice(models.Model):
    question = models.ForeignKey(
        MultipleChoiceQuestion, on_delete=models.CASCADE)
    text = models.CharField(max_length=100)
    order_num = models.IntegerField(validators=[MinValueValidator(0)])

    def __str__(self) -> str:
        return f'{self.text}'


class Answer(models.Model):
    CHOICE = 1
    TEXT = 2
    DECIMAL = 3
    VALUES_TYPES = (
        (CHOICE, 'Choice'),
        (TEXT, 'Text'),
        (DECIMAL, 'Decimal')
    )

    respondent = models.ForeignKey(Respondent, on_delete=models.PROTECT)
    question = models.ForeignKey(Question, on_delete=models.PROTECT)
    value_type = models.IntegerField(choices=VALUES_TYPES)
    text_value = models.TextField(default='')
    num_value = models.FloatField(null=True)
    choices_value = models.ManyToManyField(Choice)


class Component(models.Model):
    # add custom on_delete: if is_global then SET_NULL else CASCADE
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_global = models.BooleanField(default=False)
    data = models.TextField()  # maybe change this to JSONField


PRIVATE_QNAIRE_ID_LENGTH = 32


def generate_qnaire_private_id():
    while True:
        id = token_urlsafe(PRIVATE_QNAIRE_ID_LENGTH)
        if PrivateQnaireId.objects.filter(id=id).count() == 0:
            break
    return id


class PrivateQnaireId(models.Model):
    id = models.CharField(max_length=PRIVATE_QNAIRE_ID_LENGTH,
                          primary_key=True, default=generate_qnaire_private_id)
    qnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
