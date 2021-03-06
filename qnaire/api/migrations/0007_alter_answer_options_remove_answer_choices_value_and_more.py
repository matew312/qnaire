# Generated by Django 4.0.2 on 2022-03-27 14:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('api', '0006_alter_multiplechoicequestion_min_answers'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='answer',
            options={'base_manager_name': 'objects'},
        ),
        migrations.RemoveField(
            model_name='answer',
            name='choices_value',
        ),
        migrations.RemoveField(
            model_name='answer',
            name='num_value',
        ),
        migrations.RemoveField(
            model_name='answer',
            name='question',
        ),
        migrations.RemoveField(
            model_name='answer',
            name='text_value',
        ),
        migrations.RemoveField(
            model_name='answer',
            name='value_type',
        ),
        migrations.AddField(
            model_name='answer',
            name='polymorphic_ctype',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype'),
        ),
        migrations.AlterField(
            model_name='respondent',
            name='special_id',
            field=models.CharField(max_length=64, null=True),
        ),
        migrations.CreateModel(
            name='RangeAnswer',
            fields=[
                ('answer_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.answer')),
                ('num', models.FloatField()),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.rangequestion')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.answer',),
        ),
        migrations.CreateModel(
            name='OpenAnswer',
            fields=[
                ('answer_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.answer')),
                ('text', models.TextField()),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.openquestion')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.answer',),
        ),
        migrations.CreateModel(
            name='MultipleChoiceAnswer',
            fields=[
                ('answer_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.answer')),
                ('other_choice_text', models.TextField(blank=True)),
                ('choices', models.ManyToManyField(to='api.Choice')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.multiplechoicequestion')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.answer',),
        ),
    ]
