from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from .models import (
    Questionnaire,
    Question, 
    OpenQuestion, 
    RangeQuestion, 
    MultipleChoiceQuestion, 
    Choice, 
    Answer, 
    Respondent, 
    Component, 
    Section, 
    # PrivateQnaireId
)
# from django.contrib.auth.models import User


class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class OpenQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenQuestion
        fields = '__all__'


class RangeQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RangeQuestion
        fields = '__all__'


class MultipleChoiceQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoiceQuestion
        fields = '__all__'


class QuestionPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Question: QuestionSerializer,
        OpenQuestion: OpenQuestionSerializer,
        RangeQuestion: RangeQuestionSerializer,
        MultipleChoiceQuestion: MultipleChoiceQuestionSerializer
    }


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = '__all__'

# class PrivateQnaireIdSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PrivateQnaireId
#         fields = '__all__'

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class RespondentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respondent
        fields = '__all__'

class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = '__all__'
