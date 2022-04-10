from django.db.models import F
from rest_framework import permissions, viewsets, response, status
from rest_framework.decorators import action
from .mixins import OrderedViewSetMixin, UserQuerySetMixin, MultiSerializerViewSetMixin
from .models import Answer, Choice, Question, Questionnaire, Section
from .serializers import (
    AnswerPolymorhicSerializer,
    ChoiceSerializer,
    CreateChoiceSerializer,
    CreateSectionSerializer,
    QuestionMoveSerializer,
    QuestionSerializer,
    QuestionTypePolymorphicSerializer,
    QuestionnaireCreationSerializer,
    QuestionnaireSerializer,
    QuestionPolymorphicSerializer,
    SectionMoveSerializer,
    SectionSerializer,
)


class QuestionnaireViewSet(UserQuerySetMixin, MultiSerializerViewSetMixin, viewsets.ModelViewSet):
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer
    serializer_action_classes = {'retrieve': QuestionnaireCreationSerializer}

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


def handle_ordered_destroy(model, obj, serializer, **filters):
    order_num = obj.order_num
    model.objects.filter(order_num__gt=order_num, **
                         filters).update(order_num=F('order_num') - 1)
    obj.delete()
    changed_objs = model.objects.filter(
        order_num__gte=order_num, **filters)
    return response.Response(data=serializer(changed_objs, many=True).data, status=status.HTTP_200_OK)


# for section movement and question movement within section


def handle_simple_move(model, src, order_num, serializer, **filters):
    moved_up = src.order_num > order_num
    if moved_up:
        qs_between = model.objects.filter(
            order_num__lt=src.order_num, order_num__gte=order_num, **filters)
        qs_between.update(order_num=F('order_num') + 1)
    else:
        qs_between = model.objects.filter(
            order_num__lte=order_num, order_num__gt=src.order_num, **filters)
        qs_between.update(order_num=F('order_num') - 1)
    old_order_num = src.order_num
    src.order_num = order_num
    src.save()

    min, max = sorted([old_order_num, order_num])
    changed_objects = model.objects.filter(
        order_num__lte=max, order_num__gte=min, **filters)
    return response.Response(serializer(changed_objects, many=True).data, status=status.HTTP_200_OK)


class SectionViewSet(UserQuerySetMixin, MultiSerializerViewSetMixin, OrderedViewSetMixin, viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    serializer_action_classes = {'create': CreateSectionSerializer}
    user_field = 'qnaire__creator'
    order_scope_field = 'qnaire'
    list_serializer_class = serializer_class  # for OrderedViewSetMixin

    @action(detail=True, methods=['PATCH'])
    def move(self, request, pk=None):
        src_section = self.get_object()
        move_serializer = SectionMoveSerializer(
            data=request.data, context={'src': src_section})
        if move_serializer.is_valid():
            order_num = move_serializer.validated_data['order_num']
            if order_num == src_section.order_num:
                return response.Response(status=status.HTTP_204_NO_CONTENT)
            return handle_simple_move(Section, src_section, order_num, SectionSerializer, qnaire=src_section.qnaire)

        else:
            return response.Response(move_serializer.errors,
                                     status=status.HTTP_400_BAD_REQUEST)


class QuestionViewSet(UserQuerySetMixin, OrderedViewSetMixin, viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionPolymorphicSerializer
    user_field = 'section__qnaire__creator'
    order_scope_field = 'section'
    list_serializer_class = serializer_class  # for OrderedViewSetMixin

    @action(detail=True, methods=['PATCH'])
    def move(self, request, pk=None):
        src_question = self.get_object()
        move_serializer = QuestionMoveSerializer(
            data=request.data, context={'src': src_question})
        move_serializer.is_valid(raise_exception=True)

        order_num = move_serializer.validated_data['order_num']
        section = move_serializer.validated_data['section']
        section_changed = section != src_question.section
        if order_num == src_question.order_num and not section_changed:
            return response.Response(status=status.HTTP_204_NO_CONTENT)

        if not section_changed:
            return handle_simple_move(Question, src_question, order_num, QuestionPolymorphicSerializer, section=section)

        old_section = src_question.section
        old_order_num = src_question.order_num
        Question.objects.filter(section=old_section, order_num__gt=old_order_num).update(
            order_num=F('order_num') - 1)
        Question.objects.filter(section=section, order_num__gte=order_num).update(
            order_num=F('order_num') + 1)
        src_question.section = section
        src_question.order_num = order_num
        src_question.save()

        changed_questions = list(Question.objects.filter(
            section=old_section, order_num__gte=old_order_num))
        changed_questions += list(Question.objects.filter(
            section=section, order_num__gte=order_num))
        return response.Response(QuestionPolymorphicSerializer(changed_questions, many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['PATCH'])
    def type(self, request, pk=None):
        question = self.get_object()
        serializer = QuestionTypePolymorphicSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        field_values = {'id': question.id, 'section': question.section,
                        'order_num': question.order_num, 'text': question.text, 'mandatory': question.mandatory}
        question.delete()
        new_question = serializer.save(**field_values)
        return response.Response(QuestionPolymorphicSerializer(new_question).data, status=status.HTTP_200_OK)


class ChoiceViewSet(UserQuerySetMixin, MultiSerializerViewSetMixin, OrderedViewSetMixin, viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    serializer_action_classes = {'create': CreateChoiceSerializer}
    # I'm not sure how much the performance will hurt from this.
    # And it's not like allowing users to GET Choices of other users would be terrible.
    user_field = 'question__section__qnaire__creator'
    order_scope_field = 'question'
    list_serializer_class = ChoiceSerializer

    def perform_destroy(self, instance):
        question = instance.question
        new_total_choices = question.choice_set.count()
        if question.max_answers is not None and question.max_answers > new_total_choices:
            question.max_answers = new_total_choices
            question.save()
        instance.delete()


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerPolymorhicSerializer
