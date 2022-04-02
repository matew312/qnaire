import abc
from random import choices
from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from .models import (
    MultipleChoiceAnswer,
    OpenAnswer,
    PrivateQnaireId,
    Questionnaire,
    Question,
    OpenQuestion,
    RangeAnswer,
    RangeQuestion,
    MultipleChoiceQuestion,
    Choice,
    Answer,
    Respondent,
    Component,
    Response,
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


def get_latest_field_value(field, data, instance):
    if field in data:
        return data[field]
    # returns None if instance is None or attr doesn't exist
    return getattr(instance, field, None)

# on update returns the old value, on create returns the new value


def get_original_field_value(field, data, instance):
    if instance:
        return getattr(instance, field, None)
    return data[field]


def validate_less_than_or_equal(a, b, a_field, b_field):
    if (a is None) or (b is None) or (a <= b):
        return
    raise serializers.ValidationError(
        f'{a_field} must be less than or equal to {b_field}')


def validate_less_than(a, b, a_field, b_field):
    if (a is None) or (b is None) or (a < b):
        return
    raise serializers.ValidationError(
        f'{a_field} must be less than {b_field}')


def raise_validation_error_if_mandatory(q):
    if q.mandatory:
        raise serializers.ValidationError(
            f"Question '{q}' is mandatory, but no answer was provided")


def raise_validation_error_if_qnaire_published(qnaire):
    if qnaire.published:
        raise serializers.ValidationError(
            f'Content of questionnaire {qnaire} cannot be modified, because the questionnaire is published')


QUESTION_FIELDS = ('id', 'section', 'order_num', 'text', 'mandatory')


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = QUESTION_FIELDS

    def validate(self, data):
        section = get_original_field_value('section', data, self.instance)
        raise_validation_error_if_qnaire_published(section.qnaire)

        # on update (having two serializers would be fine as well)
        if self.instance:
            if 'section' in data:
                # make sure the section is within the same qnaire as the previous one
                new_section = data['section']
                if new_section.qnaire != section.qnaire:
                    raise serializers.ValidationError(
                        f"New section is in a different questionnaire than the current section")
        # on create
        else:
            request = self.context.get('request')
            section = data['section']
            # make sure the created question belongs to a qnaire owned by the current user
            if section.qnaire.creator != request.user:
                raise serializers.ValidationError(
                    f"Section belongs to a questionnaire not owned by the user")

        return self.do_validate(data)

    # template method
    @abc.abstractmethod
    def do_validate(self, data):
        pass

# I inherit from QuestionSerializer so that base validation method can be potentially reused


class OpenQuestionSerializer(QuestionSerializer):
    class Meta:
        model = OpenQuestion
        fields = QUESTION_FIELDS + ('min_length', 'max_length', )

    def do_validate(self, data):
        min_length = get_latest_field_value('min_length', data, self.instance)
        max_length = get_latest_field_value('max_length', data, self.instance)
        validate_less_than_or_equal(
            min_length, max_length, 'min_length', 'max_length')

        return data


class RangeQuestionSerializer(QuestionSerializer):

    class Meta:
        model = RangeQuestion
        fields = QUESTION_FIELDS + ('type', 'min', 'max', 'step')

    def do_validate(self, data):
        min = get_latest_field_value('min', data, self.instance)
        max = get_latest_field_value('max', data, self.instance)
        validate_less_than(min, max, 'min', 'max')

        step = get_latest_field_value('step', data, self.instance)
        if step is not None:
            if not min.is_integer():
                raise serializers.ValidationError(
                    'min must be an integer when step is defined')
            if not max.is_integer():
                raise serializers.ValidationError(
                    'max must be an integer when step is defined')
            validate_less_than_or_equal(step, max - min, 'step', 'max - min')

        if 'type' in data:
            type = data['type']
            if type in [RangeQuestion.ENUMERATE, RangeQuestion.STAR_RATING, RangeQuestion.SMILEY_RATING]:
                if step is None:
                    type_name = dict(RangeQuestion.TYPE_CHOICES)[
                        RangeQuestion.ENUMERATE]
                    raise serializers.ValidationError(
                        f'step must be defined for type {type_name}')
                if (max - min) / step >= RangeQuestion.MAX_CHOICES_FOR_ENUMERATE:
                    raise serializers.ValidationError(
                        f'Number of choices would exceed {RangeQuestion.MAX_CHOICES_FOR_ENUMERATE}')
            if type == RangeQuestion.SMILEY_RATING:
                if step != 1 or min != 1 or max > RangeQuestion.MAX_SMILEYS:
                    raise serializers.ValidationError(
                        f'For type {type_name} these constraints must be true: step=1; min=1; 1 < max <= {RangeQuestion.MAX_SMILEYS}')
        return data


CHOICE_FIELDS = ('id', 'text', 'order_num', 'skip_to_section', 'question')


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = CHOICE_FIELDS
        extra_kwargs = {'question': {'read_only': True}}
        list_serializer_class = DictSerializer

    def validate(self, data):
        question = get_original_field_value('question', data, self.instance)
        raise_validation_error_if_qnaire_published(question.section.qnaire)

        request = self.context.get('request')
        question = self.instance.question if self.instance else data['question']
        qnaire = question.section.qnaire

        data = self.do_validate(data, qnaire, request)

        skip_to_section = data.get('skip_to_section')
        if skip_to_section is not None and skip_to_section.qnaire != qnaire:
            raise serializers.ValidationError(
                f"skip_to_section belong to a different questionnaire than the choice.")
        return data

    # template method
    def do_validate(self, data, qnaire, request):
        return data


class CreateChoiceSerializer(ChoiceSerializer):
    class Meta:
        model = Choice
        fields = CHOICE_FIELDS
        list_serializer_class = DictSerializer

    def do_validate(self, data, qnaire, request):
        # make sure the created choice belongs to a qnaire owned by the current user
        if qnaire.creator != request.user:
            raise serializers.ValidationError(
                f"The question belongs to a questionnaire not owned by the user")

        return data


class MultipleChoiceQuestionSerializer(QuestionSerializer):
    # choices = ChoiceSerializer(
    #     many=True, read_only=True, source='choice_set')

    class Meta:
        model = MultipleChoiceQuestion
        fields = QUESTION_FIELDS + \
            ('min_answers', 'max_answers', 'other_choice', 'random_order', )

    def do_validate(self, data):
        min_answers = get_latest_field_value(
            'min_answers', data, self.instance)
        max_answers = get_latest_field_value(
            'max_answers', data, self.instance)
        validate_less_than_or_equal(
            min_answers, max_answers, 'min_answers', 'max_answers')

        # make sure min_answers and max_answers doesn't exceed total number of choices
        if self.instance is None:
            validate_less_than_or_equal(
                min_answers, 0, 'min_answers', 'total number of choices')
        else:
            total_choices = Choice.objects.filter(
                question=self.instance).count()
            validate_less_than_or_equal(
                min_answers, total_choices, 'min_answers', 'total number of choices')
            if max_answers is not None:
                validate_less_than_or_equal(
                    max_answers, total_choices, 'max_answers', 'total number of choices')

        return data


class QuestionPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        # Question: QuestionSerializer, # instances of Question are not allowed
        OpenQuestion: OpenQuestionSerializer,
        RangeQuestion: RangeQuestionSerializer,
        MultipleChoiceQuestion: MultipleChoiceQuestionSerializer
    }

    class Meta:
        list_serializer_class = DictSerializer


SECTION_FIELDS = ('id', 'name', 'desc', 'order_num')


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = SECTION_FIELDS
        list_serializer_class = DictSerializer

    def validate(self, data):
        qnaire = get_latest_field_value('qnaire')
        raise_validation_error_if_qnaire_published(qnaire)
        return self.do_validate(data)

        # I CAN'T VALIDATE ORDER_NUM WITHOUT BULK UPDATES (If I am changing order_num of a section, I am naturally changing order of some other ones)
        # self.instance contains the model instance during updates and this Serializer isn't for creation, so it's always fine
        # sections = self.instance.qnaire.section_set.exclude(pk=self.instance.pk)

        # extra_kwargs = {'qnaire': {'write_only': True}} <-- This wasn't enough, because I want qnaire only for CREATE requests.
        # If there was just one Serializer I would need to check if 'qnaire' in data and self.instance is not None then data['qnaire'] == self.instance.qnaire

    # template method
    def do_validate(self, data):
        return data


class CreateSectionSerializer(SectionSerializer):
    class Meta:
        model = Section
        fields = SECTION_FIELDS + ('qnaire',)
        list_serializer_class = DictSerializer

    def do_validate(self, data):
        request = self.context.get('request')
        qnaire = data['qnaire']
        # make sure the created section belongs to a qnaire owned by the current user
        if qnaire.creator != request.user:
            raise serializers.ValidationError(
                f"User doesn't own the questionnaire")

        return data


QUESTIONNAIRE_FIELDS = ('id', 'name', 'desc', 'anonymous',
                        'private', 'published', 'created_at')


class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = QUESTIONNAIRE_FIELDS

    def validate(self, data):
        print(data)
        request = self.context.get('request')
        if 'name' in data:
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
    choices = serializers.SerializerMethodField()

    class Meta:
        model = Questionnaire
        fields = QUESTIONNAIRE_FIELDS + ('sections', 'questions', 'choices')

    def get_questions(self, qnaire):
        questions = Question.objects.filter(
            section__in=qnaire.section_set.all())
        return QuestionPolymorphicSerializer(questions, many=True).data

    def get_choices(self, qnaire):
        choices = Choice.objects.filter(
            question__section__in=qnaire.section_set.all())
        return ChoiceSerializer(choices, many=True).data


ANSWER_FIELDS = ()


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ANSWER_FIELDS


class OpenAnswerSerializer(AnswerSerializer):
    class Meta:
        model = OpenAnswer
        fields = ANSWER_FIELDS + ('question', 'text')

    def validate(self, data):
        q = data['question']
        if 'text' not in data or len(data['text']) == 0:
            raise_validation_error_if_mandatory(q)
            return data

        text = data['text']
        if q.min_length is not None and len(text) < q.min_length:
            raise serializers.ValidationError(
                f"Answer to question '{q}' must be at least {q.min_length} characters long")
        if q.max_length is not None and len(text) > q.max_length:
            raise serializers.ValidationError(
                f"Answer to question '{q}' must be shorter than {q.min_length} characters")
        return data


class RangeAnswerSerializer(AnswerSerializer):
    class Meta:
        model = RangeAnswer
        fields = ANSWER_FIELDS + ('question', 'num')

    def validate(self, data):
        q = data['question']
        if 'num' not in data:
            raise_validation_error_if_mandatory(q)
            return data

        num = data['num']
        if num < q.min:
            raise serializers.ValidationError(
                f"Answer to question '{q}' must be greater than or equal to {q.min}")
        if num > q.max:
            raise serializers.ValidationError(
                f"Answer to question '{q}' must be less than or equal to {q.max}")
        if q.step is not None and num % q.step != 0:
            raise serializers.ValidationError(
                f"Answer to question '{q}' must be divisible by {q.step}")
        return data


class MultipleChoiceAnswerSerializer(AnswerSerializer):
    class Meta:
        model = MultipleChoiceAnswer
        fields = ANSWER_FIELDS + ('question', 'choices', 'other_choice_text')
        extra_kwargs = {'choices': {'required': False}}

    def validate(self, data):
        q = data['question']
        choice_pool = set(q.choice_set.all())
        if 'choices' not in data:
            selected_choices = []
            total_selected_choices = 0
        else:
            selected_choices = data['choices']
            total_selected_choices = len(selected_choices)

        if 'other_choice_text' in data and len(data['other_choice_text']) > 0:
            if not q.other_choice:
                raise serializers.ValidationError(
                    f"Other choice is not allowed for question '{q}'")
            else:
                total_selected_choices += 1

        if total_selected_choices == 0 and q.min_answers > 0:
            raise_validation_error_if_mandatory(q)
            return data

        if total_selected_choices < q.min_answers:
            raise serializers.ValidationError(
                f"Fewer choices were selected for question '{q}' than the allowed minimum of {q.min_answers}")

        if total_selected_choices > q.max_answers:
            raise serializers.ValidationError(
                f"More choices were selected for question '{q}' than the allowed maximum of {q.max_answers}")

        for choice in selected_choices:
            if choice not in choice_pool:
                raise serializers.ValidationError(
                    f"Invalid choice was provided as answer to question '{q}'")
            # remove the choice from pool to prevent duplicate choices
            choice_pool.remove(choice)

        return data


class AnswerPolymorhicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        # Answer: AnswerSerializer,
        OpenAnswer: OpenAnswerSerializer,
        RangeAnswer: RangeAnswerSerializer,
        MultipleChoiceAnswer: MultipleChoiceAnswerSerializer
    }


class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerPolymorhicSerializer(many=True, source='answer_set')

    class Meta:
        model = Response
        fields = ('answers', 'respondent', 'submit_timestamp')
        # extra_kwargs = {'respondent': {'required': False}} # this should be automatic by having the field be null=True

    def validate(self, data):
        qnaire = self.context.get('qnaire')
        if not qnaire.published:
            raise serializers.ValidationError(
                'Response cannot be submited because questionnaire is not published')

        respondent = data.get('respondent')
        if qnaire.anonymous and respondent is not None:
            raise serializers.ValidationError(
                "Response can't contain a respondent because the questionnaire is anonymous")
        elif not qnaire.anonymous and respondent is None:
            raise serializers.ValidationError(
                "Response must contain a respondent because the questionnaire is not anonymous")

        questions = set(Question.objects.filter(section__qnaire=qnaire))
        for answer in data['answer_set']:
            if answer['question'] not in questions:
                raise serializers.ValidationError(
                    'Response contains an answer to a question which is not a part of the given questionnaire')
            else:
                questions.remove(answer['question'])
        if len(questions) != 0:
            raise serializers.ValidationError(
                'Answers were not provide for every question of the questionnaire')

        return data

    # I need to make a custom create method for serializing relationships, and hence I also have to branch Answer based on type
    def create(self, validated_data):
        answers_data = validated_data.pop('answer_set')
        response = Response.objects.create(**validated_data)
        for answer_data in answers_data:
            # resourcetype has already been validated by the polymorphic serializer
            type = answer_data.pop('resourcetype')
            answer_class = None
            choices = None
            if type == 'OpenAnswer':
                answer_class = OpenAnswer
            elif type == 'RangeAnswer':
                answer_class = RangeAnswer
            elif type == 'MultipleChoiceAnswer':
                answer_class = MultipleChoiceAnswer
                if 'choices' in answer_data:
                    choices = answer_data.pop('choices')
            answer = answer_class.objects.create(
                response=response, **answer_data)
            if choices is not None:
                answer.choices.set(choices)
        return response


class PrivateQnaireIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateQnaireId
        fields = ('id', )

# class RespondentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Respondent
#         fields = ()

# class ComponentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Component
#         fields = ()
