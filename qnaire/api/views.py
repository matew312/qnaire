from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework import response
from rest_framework.views import APIView
from django.db.models import Q

from .serializers import ChoiceSerializer, PrivateQnaireIdSerializer, QuestionPolymorphicSerializer, QuestionnaireSerializer, ResponseSerializer, SectionSerializer

from .models import Answer, Choice, PrivateQnaireId, Question, Questionnaire, Response, Section


# Create your views here.

class ResponseView(APIView):

    def post(self, request, **kwargs):
        qnaire = get_object_or_404(Questionnaire, pk=kwargs['id'])

        private_qnaire_id = None
        if not qnaire.anonymous:
            ok = True
            private_qnaire_id_serializer = PrivateQnaireIdSerializer(
                data=request.data)
            if private_qnaire_id_serializer.is_valid():
                queryset = PrivateQnaireId.objects.filter(
                    pk=private_qnaire_id_serializer.validated_data['id'], qnaire=qnaire)
                if queryset.exists():
                    private_qnaire_id = queryset[0]
                else:
                    ok = False
            else:
                ok = False

            if not ok:
                return response.Response(
                    data={'detail': 'No private id has been provided, but the questionnaire is not anonymous'}, status=status.HTTP_400_BAD_REQUEST)

        response_serializer = ResponseSerializer(
            data=request.data, context={'qnaire': qnaire})
        if response_serializer.is_valid():
            # I could pass the qnaire to the save method if it was in the Response Model
            response_serializer.save()
            if private_qnaire_id is not None:
                private_qnaire_id.delete()
            return response.Response(data=response_serializer.data, status=status.HTTP_200_OK)
        else:
            return response.Response(data={'detail': response_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


def forbidden_if_not_owning_qnaire(qnaire, request):
    if request.user != qnaire.creator:
        return response.Response(
            {'detail': f"User {request.user} doesn't own the questionnaire"}, status=status.HTTP_403_FORBIDDEN)


class ResultView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, **kwargs):
        qnaire = get_object_or_404(Questionnaire, pk=kwargs['id'])
        forbidden = forbidden_if_not_owning_qnaire(qnaire, request)
        if forbidden:
            return forbidden

        qnaire_serializer = QuestionnaireSerializer(qnaire)

        sections = qnaire.section_set.all()
        section_serializer = SectionSerializer(sections, many=True)

        questions = Question.objects.filter(section__in=sections)
        question_serializer = QuestionPolymorphicSerializer(
            questions, many=True)

        choices = Choice.objects.filter(question__in=questions)
        choice_serializer = ChoiceSerializer(choices, many=True)

        # answers = Answer.objects.filter(
        #     Q(OpenAnswer___question__in=questions) |
        #     Q(RangeAnswer___question__in=questions) |
        #     Q(MultipleChoiceAnswer___question__in=questions))
        # answer_serializer = AnswerPolymorhicSerializer(answers, many=True)

        # TODO: OPTIMIZE THIS TO RETRIEVE IT IN ONE GO IF POSSIBLE (there are issues with select_related with polymorhic models)
        # Alternative solution is to include field 'qnaire' in Response. Then I could just do Response.objects.filter(qnaire=qnaire)
        responses_pks = Answer.objects.filter(
            (Q(OpenAnswer___question__in=questions) |
             Q(RangeAnswer___question__in=questions) |
             Q(MultipleChoiceAnswer___question__in=questions))).values_list('response', flat=True).distinct()
        responses = Response.objects.filter(pk__in=responses_pks)
        response_serializer = ResponseSerializer(responses, many=True)

        return response.Response({**qnaire_serializer.data,
                                  'sections': section_serializer.data,
                                  'questions': question_serializer.data,
                                  'choices': choice_serializer.data,
                                  # 'answers': answer_serializer.data,
                                  'responses': response_serializer.data
                                  })


class PrivateQnaireIdView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, **kwargs):
        qnaire = get_object_or_404(Questionnaire, pk=kwargs['id'])
        forbidden = forbidden_if_not_owning_qnaire(qnaire, request)
        if forbidden:
            return forbidden

        private_qnaire_id = PrivateQnaireId.objects.create(qnaire=qnaire)
        serializer = PrivateQnaireIdSerializer(private_qnaire_id)

        return response.Response(data=serializer.data, status=status.HTTP_200_OK)
