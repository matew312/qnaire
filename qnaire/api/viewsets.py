from rest_framework import permissions, viewsets
from .mixins import UserQuerySetMixin, MultiSerializerViewSetMixin
from .models import Question, Questionnaire, Section
from .serializers import (
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
