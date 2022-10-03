from time import sleep
from django.test import TestCase
# from rest_framework.test import APIRequestFactory, force_authenticate
# from .serializers import QuestionSerializer, OpenQuestionSerializer
# import api.serializers as serializers
# from .models import Section, Question, Questionnaire
# from accounts.models import User

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re


from .models import Questionnaire

from .viewsets import QuestionnaireViewSet

class QuestionnaireUITest(TestCase):
    BASE_URL= "http://127.0.0.1:8000/"

    def setUp(self):
        self.driver = webdriver.Firefox(executable_path="C:/Users/sim0323/Downloads/geckodriver.exe")

    def login(self):
        self.driver.get(f"{self.BASE_URL}login/")
        username_elem = self.driver.find_element(By.NAME, 'username')
        username_elem.send_keys('admin')
        admin_elem = self.driver.find_element(By.NAME, 'password')
        admin_elem.clear()
        admin_elem.send_keys('EaSo8OK1aioMdH')
        self.driver.find_element(By.XPATH, '//form//button[@type="submit"]').click()
        WebDriverWait(self.driver, 2).until(EC.presence_of_element_located((By.XPATH, '//h1')))

    def create_qnaire(self, name):
        self.driver.get(f"{self.BASE_URL}questionnaires/")
        WebDriverWait(self.driver, 2).until(EC.element_to_be_clickable((By.XPATH, '//span[text()="Vytvořit dotazník"]'))).click()
        name_elem = self.driver.find_element(By.NAME, 'name')
        name_elem.send_keys(name)
        self.driver.find_element(By.XPATH, '//form//button[@type="submit"]').click()
        url = self.driver.current_url
        if re.match(f"^{self.BASE_URL}questionnaires/[0-9]+$", url):
            qnaire_id = int(url.split('/')[-1])
            return qnaire_id
        else:
            return None

    def delete_qnaire(self, id):
        self.driver.get(f"{self.BASE_URL}questionnaires/{id}/")
        self.driver.find_element(By.XPATH, '//*[@data-testid="DeleteIcon"]').click()
        self.driver.find_element(By.XPATH, '//button[text()="Potvrdit"]').click()
        #I should check that the url with the id doesn't exist after the delete,
        #but the app currently displays an empty page in this case...

    #whitespace-only is allowed I guess
    test_params = [
        ('normal name', True),
        ('', False),
        (' ', True),
        ('x' * Questionnaire._meta.get_field('name').max_length, True),
        ('x' * (Questionnaire._meta.get_field('name').max_length + 1), False),
        ('3ččš', True)]

    def test(self):
        self.login()
        for name, result in self.test_params:
            with self.subTest(f'name="{name}", expected_result:{result}'):
                qnaire_id = self.create_qnaire(name)
                self.assertEqual(qnaire_id != None, result)
                if result:
                    name_on_page = self.driver.find_element(By.ID, 'questionnaire-name').get_attribute('value')
                    self.assertEqual(name_on_page, name)
                if qnaire_id is not None:
                    self.delete_qnaire(qnaire_id)


    def test_unique_name(self):
        self.login()
        qnaire_id = self.create_qnaire('normal name')
        self.create_qnaire('normal name')

        self.assertEqual(self.driver.current_url, f"{self.BASE_URL}questionnaires/")
        self.delete_qnaire(qnaire_id)

     
        
    def tearDown(self):
        self.driver.quit()


# Create your tests here.





# request_factory = APIRequestFactory()


# class QuestionSerializerTestCase(TestCase):
#     def mocked_validate_ordered_add(queryset, data):
#         if data['order_num'] > 0:
#             raise serializers.ValidationError(
#             {'order_num': 'Invalid order_num'})
#         return data

#     def get_create_question_request(self, section = 1, order_num = 0, text = 'test q'):
#         request = request_factory.post('/questions', {'section': section, 'text': text, 'order_num': order_num})
#         force_authenticate(request, user=self.user)
#         return request

#     def setUp(self):
#         serializers.validate_ordered_add = self.mocked_validate_ordered_add
#         self.user = User.objects.create(username='u', password='123')
#         qnaire = Questionnaire.objects.create(name='qnaire', creator=self.user)
#         section = Section.objects.create(qnaire=qnaire, order_num=0, name='s1')
#         self.param_list = [(self.get_create_question_request(), True), (self.get_create_question_request(1, 1), False)]
#         pass

#     def test_validate_create(self):
#         for request, result in self.param_list:
#             with self.subTest():
#                 serializer = OpenQuestionSerializer(data=request.data, context={'request': request})
#                 self.assertEquals(serializer.is_valid(), result)
