# Generated by Django 4.0.2 on 2022-03-30 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_questionnaire_desc_section_desc'),
    ]

    operations = [
        migrations.AddField(
            model_name='questionnaire',
            name='private',
            field=models.BooleanField(default=False),
        ),
    ]
