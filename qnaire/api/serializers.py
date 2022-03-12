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
        fields = ('id', 'name', 'anonymous', 'created_at')

class CreateQuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ('name', 'anonymous')


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'text', 'mandatory', 'order_num')

class OpenQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenQuestion
        fields = ('id', 'text', 'mandatory', 'order_num')

class RangeQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RangeQuestion
        fields = ('id', 'text', 'mandatory', 'order_num', 'type', 'min', 'max', 'step')


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('text', 'order_num')

class MultipleChoiceQuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, source='choice_set')

    class Meta:
        model = MultipleChoiceQuestion
        fields = ('id', 'text', 'mandatory', 'order_num', 'min_answers', 'max_answers', 'other_choice', 'random_order', 'choices')

class QuestionPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Question: QuestionSerializer,
        OpenQuestion: OpenQuestionSerializer,
        RangeQuestion: RangeQuestionSerializer,
        MultipleChoiceQuestion: MultipleChoiceQuestionSerializer
    }


class SectionSerializer(serializers.ModelSerializer):
    questions = QuestionPolymorphicSerializer(many=True, source='question_set')

    class Meta:
        model = Section
        fields = ('id', 'name', 'order_num', 'questions')

class QuestionnaireCreationSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, source='section_set')

    class Meta:
        model = Questionnaire
        fields = ('name', 'anonymous', 'created_at', 'sections')



# class PrivateQnaireIdSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PrivateQnaireId
#         fields = '__all__'

# class AnswerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Answer
#         fields = '__all__'

# class RespondentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Respondent
#         fields = '__all__'

# class ComponentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Component
#         fields = '__all__'
