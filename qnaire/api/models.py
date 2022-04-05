from django.db import models
from django.core.validators import MinValueValidator
from polymorphic.models import PolymorphicModel
from accounts.models import User
from secrets import token_urlsafe

from .validators import GreaterThanValidator

# Create your models here.


class Respondent(models.Model):
    id = models.CharField(primary_key=True, max_length=64)


class Response(models.Model):
    respondent = models.ForeignKey(
        Respondent, on_delete=models.SET_NULL, null=True)
    submit_timestamp = models.DateTimeField(auto_now_add=True)


class Questionnaire(models.Model):
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100)
    desc = models.TextField(blank=True)
    anonymous = models.BooleanField(default=True)
    private = models.BooleanField(default=False)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.name}'


class Section(models.Model):
    qnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    desc = models.TextField(blank=True)
    order_num = models.IntegerField(validators=[MinValueValidator(0)])

    class Meta:
        indexes = [
            models.Index(fields=['qnaire', 'order_num']),
        ]

    def __str__(self) -> str:
        return f'{self.name}'


class Question(PolymorphicModel):
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    # maybe make question text a CharField and add new TextField called description
    text = models.TextField()
    mandatory = models.BooleanField()
    order_num = models.IntegerField(validators=[MinValueValidator(0)])

    class Meta:
        indexes = [
            models.Index(fields=['section', 'order_num']),
        ]

    def __str__(self) -> str:
        return f'{self.text}'


class OpenQuestion(Question):
    min_length = models.IntegerField(
        null=True, validators=[MinValueValidator(1)])
    max_length = models.IntegerField(
        null=True, validators=[MinValueValidator(1)])


class RangeQuestion(Question):
    ENUMERATE = 1
    SLIDER = 2
    FIELD = 3
    STAR_RATING = 4
    SMILEY_RATING = 5

    TYPE_CHOICES = (
        (ENUMERATE, 'Enumerate'),
        (SLIDER, 'Slider'),
        (FIELD, 'Field'),
        (STAR_RATING, 'Star rating'),
        (SMILEY_RATING, 'Smiley rating'),
    )

    MAX_CHOICES_FOR_ENUMERATE = 100
    MAX_SMILEYS = 5

    type = models.IntegerField(choices=TYPE_CHOICES)
    min = models.FloatField()
    max = models.FloatField()
    # only integer step will be allowed (the alternative is make all field decimal so that it would be possible to validate the step)
    step = models.IntegerField(null=True, validators=[GreaterThanValidator(0)])


class MultipleChoiceQuestion(Question):
    # min_answers=0 is allowed (it means that chosing nothing will be OK even if required=true)
    min_answers = models.IntegerField(validators=[MinValueValidator(0)])
    max_answers = models.IntegerField(
        null=True, validators=[MinValueValidator(0)])
    other_choice = models.BooleanField(default=False)
    random_order = models.BooleanField(default=False)


class Choice(models.Model):
    question = models.ForeignKey(
        MultipleChoiceQuestion, on_delete=models.CASCADE)
    text = models.CharField(max_length=100)
    order_num = models.IntegerField(
        validators=[MinValueValidator(0)])
    skip_to_section = models.ForeignKey(
        Section, on_delete=models.SET_NULL, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['question', 'order_num']),
        ]

    def __str__(self) -> str:
        return f'{self.text}'


class Answer(PolymorphicModel):
    response = models.ForeignKey(Response, on_delete=models.PROTECT)


class OpenAnswer(Answer):
    question = models.ForeignKey(OpenQuestion, on_delete=models.PROTECT)
    text = models.TextField(blank=True)


class RangeAnswer(Answer):
    question = models.ForeignKey(RangeQuestion, on_delete=models.PROTECT)
    num = models.FloatField(null=True)


class MultipleChoiceAnswer(Answer):
    question = models.ForeignKey(
        MultipleChoiceQuestion, on_delete=models.PROTECT)
    # saves me from having to create an "association table"
    choices = models.ManyToManyField(Choice)
    other_choice_text = models.TextField(blank=True)


class Component(models.Model):
    # add custom on_delete: if is_global then SET_NULL else CASCADE
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_global = models.BooleanField(default=False)
    data = models.TextField()  # maybe change this to JSONField


PRIVATE_QNAIRE_ID_LENGTH = 32


def generate_qnaire_private_id():
    while True:
        id = token_urlsafe(PRIVATE_QNAIRE_ID_LENGTH)
        if not PrivateQnaireId.objects.filter(id=id).exists():
            break
    return id


class PrivateQnaireId(models.Model):
    id = models.CharField(max_length=PRIVATE_QNAIRE_ID_LENGTH,
                          primary_key=True, default=generate_qnaire_private_id)
    qnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
