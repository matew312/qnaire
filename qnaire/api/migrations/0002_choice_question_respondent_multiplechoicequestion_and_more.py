# Generated by Django 4.0.2 on 2022-03-11 10:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Choice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('mandatory', models.BooleanField()),
                ('order_num', models.IntegerField()),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='Respondent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('special_id', models.CharField(max_length=64)),
                ('submit_timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='MultipleChoiceQuestion',
            fields=[
                ('question_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.question')),
                ('min_answers', models.IntegerField()),
                ('max_answers', models.IntegerField()),
                ('other_choice', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.question',),
        ),
        migrations.CreateModel(
            name='OpenQuestion',
            fields=[
                ('question_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.question')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.question',),
        ),
        migrations.CreateModel(
            name='RangeQuestion',
            fields=[
                ('question_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.question')),
                ('type', models.CharField(max_length=20)),
                ('min', models.FloatField()),
                ('max', models.FloatField()),
                ('step', models.FloatField()),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.question',),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('order_num', models.IntegerField()),
                ('qnaire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.questionnaire')),
            ],
        ),
        migrations.AddField(
            model_name='question',
            name='section',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.section'),
        ),
        migrations.CreateModel(
            name='PrivateQnaireId',
            fields=[
                ('id', models.CharField(max_length=32, primary_key=True, serialize=False)),
                ('qnaire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.questionnaire')),
            ],
        ),
        migrations.CreateModel(
            name='Component',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_global', models.BooleanField(default=False)),
                ('data', models.TextField()),
                ('creator', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value_type', models.CharField(max_length=20)),
                ('text_value', models.TextField(default='')),
                ('num_value', models.FloatField(null=True)),
                ('choices_value', models.ManyToManyField(to='api.Choice')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.question')),
                ('respondent', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.respondent')),
            ],
        ),
        migrations.AddField(
            model_name='choice',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.multiplechoicequestion'),
        ),
    ]
