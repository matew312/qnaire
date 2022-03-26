from rest_framework import permissions, viewsets
from .mixins import UserQuerySetMixin, MultiSerializerViewSetMixin
from .models import Choice, Question, Questionnaire, Section
from .serializers import (
    ChoiceSerializer,
    CreateChoiceSerializer,
    CreateSectionSerializer,
    QuestionnaireCreationSerializer,
    QuestionnaireSerializer,
    QuestionPolymorphicSerializer,
    SectionSerializer,
)


class QuestionnaireViewSet(UserQuerySetMixin, MultiSerializerViewSetMixin, viewsets.ModelViewSet):
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer
    serializer_action_classes = {'retrieve': QuestionnaireCreationSerializer}

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class SectionViewSet(UserQuerySetMixin, MultiSerializerViewSetMixin, viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    serializer_action_classes = {'create': CreateSectionSerializer}
    user_field = 'qnaire__creator'


class QuestionViewSet(UserQuerySetMixin, viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionPolymorphicSerializer
    user_field = 'section__qnaire__creator'


class ChoiceViewSet(UserQuerySetMixin, MultiSerializerViewSetMixin, viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    serializer_action_classes = {'create': CreateChoiceSerializer}
    # I'm not sure how much the performance will hurt from this.
    # And it's not like allowing users to GET Choices of other users would be terrible.
    user_field = 'question__section__qnaire__creator'
