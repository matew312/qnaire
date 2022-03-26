from rest_framework import routers

from .viewsets import QuestionnaireViewSet, QuestionViewSet, SectionViewSet

router = routers.SimpleRouter()
router.register('questionnaires', QuestionnaireViewSet)
router.register('questions', QuestionViewSet)
router.register('sections', SectionViewSet)

urlpatterns = router.urls