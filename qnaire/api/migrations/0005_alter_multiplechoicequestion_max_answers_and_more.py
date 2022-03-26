# Generated by Django 4.0.2 on 2022-03-26 17:14

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_multiplechoicequestion_max_answers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='multiplechoicequestion',
            name='max_answers',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='multiplechoicequestion',
            name='min_answers',
            field=models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]
