import abc
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


QUESTION_FIELDS = ('id', 'section', 'order_num', 'text', 'mandatory')


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = QUESTION_FIELDS

    # def validate(self, data):
    #     pass

    # #template method # this is redundant as I can just call super().validate()
    # @abc.abstractmethod
    # def do_validate(self, data):
    #     pass

# I inherit from QuestionSerializer so that base validation method can be potentially reused


class OpenQuestionSerializer(QuestionSerializer):
    class Meta:
        model = OpenQuestion
        fields = QUESTION_FIELDS + ('min_length', 'max_length', )

    def validate(self, data):
        super().validate(data)
        min_length = data['min_length']
        max_length = data['max_length']

        return data


class RangeQuestionSerializer(QuestionSerializer):

    class Meta:
        model = RangeQuestion
        fields = QUESTION_FIELDS + ('type', 'min', 'max', 'step')


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'text', 'order_num')
        list_serializer_class = DictSerializer


class MultipleChoiceQuestionSerializer(QuestionSerializer):
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


SECTION_FIELDS = ('id', 'qnaire', 'name', 'order_num')


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = SECTION_FIELDS
        list_serializer_class = DictSerializer

    # def validate(self, data):
        # I CAN'T VALIDATE ORDER_NUM WITHOUT BULK UPDATES (If I am changing order_num of a section, I am naturally changing order of some other ones)

        # self.instance contains the model instance during updates and this Serializer isn't for creation, so it's always fine
        # sections = self.instance.qnaire.section_set.exclude(pk=self.instance.pk)


# extra_kwargs = {'qnaire': {'write_only': True}} <-- This wasn't enough, because I want qnaire only for CREATE requests.
class CreateSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = SECTION_FIELDS + ('qnaire',)
        list_serializer_class = DictSerializer

    def validate(self, data):
        request = self.context.get('request')
        qnaire = data['qnaire']
        # make sure the created section belongs to a qnaire owned by the current user
        if qnaire.creator != request.user:
            raise serializers.ValidationError(
                f"User doesn't own the questionnaire '{qnaire}'")

        return data


class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ('id', 'name', 'anonymous', 'created_at')

    def validate(self, data):
        request = self.context.get('request')
        if data['name']:
            name = data['name']
            qs = Questionnaire.objects.filter(
                creator=request.user, name__iexact=name)
            if self.instance:
                qs = qs.exclude(id=self.instance.id)
            if qs.exists():
                raise serializers.ValidationError(
                    f"Name '{name}' already exists within questionnaires of user '{request.user}'")
        return data


# serializer for the Creation Page
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
