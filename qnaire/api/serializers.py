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
from accounts.models import User


# http://concisecoder.io/2018/11/17/normalize-your-django-rest-serializers/
class DictSerializer(serializers.ListSerializer):
    dict_key = 'id'

    @property
    def data(self):
        """
        Overriden to return a ReturnDict instead of a ReturnList.
        """
        ret = super(serializers.ListSerializer, self).data
        return serializers.ReturnDict(ret, serializer=self)

    def to_representation(self, data):
        """
        Converts the data from a list to a dictionary.
        """
        items = super(DictSerializer, self).to_representation(data)
        return {item[self.dict_key]: item for item in items}


class LoginSerializer(serializers.Serializer):
     email = serializers.EmailField()
     password = serializers.CharField(max_length=128)

class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ('id', 'name', 'anonymous', 'created_at')


class CreateQuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ('name', 'anonymous')


# section_id works as well
QUESTION_FIELDS = ('id', 'section', 'order_num', 'text', 'mandatory')


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = QUESTION_FIELDS


class OpenQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenQuestion
        fields = QUESTION_FIELDS + ('min_length', 'max_length', )


class RangeQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = RangeQuestion
        fields = QUESTION_FIELDS + ('type', 'min', 'max', 'step')


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'text', 'order_num')
        list_serializer_class = DictSerializer
        


class MultipleChoiceQuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(
        many=True, read_only=True, source='choice_set')

    class Meta:
        model = MultipleChoiceQuestion
        fields = QUESTION_FIELDS + \
            ('min_answers', 'max_answers', 'other_choice', 'random_order', 'choices',)


class QuestionPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Question: QuestionSerializer,
        OpenQuestion: OpenQuestionSerializer,
        RangeQuestion: RangeQuestionSerializer,
        MultipleChoiceQuestion: MultipleChoiceQuestionSerializer
    }

    class Meta:
        list_serializer_class = DictSerializer


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('id', 'name', 'order_num')
        list_serializer_class = DictSerializer


class QuestionnaireCreationSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, source='section_set')
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Questionnaire
        fields = ('id', 'name', 'anonymous',
                  'created_at', 'sections', 'questions')

    def get_questions(self, qnaire):
        sections = Section.objects.filter(qnaire=qnaire)
        questions = Question.objects.filter(section__in=sections)
        return QuestionPolymorphicSerializer(questions, many=True).data


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
