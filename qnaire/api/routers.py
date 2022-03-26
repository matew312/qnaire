from rest_framework import routers

from .viewsets import ChoiceViewSet, QuestionnaireViewSet, QuestionViewSet, SectionViewSet

router = routers.SimpleRouter()
router.register('questionnaires', QuestionnaireViewSet)
router.register('questions', QuestionViewSet)
router.register('sections', SectionViewSet)
router.register('choices', ChoiceViewSet)

urlpatterns = router.urls