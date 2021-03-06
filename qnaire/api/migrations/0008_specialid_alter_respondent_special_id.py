# Generated by Django 4.0.2 on 2022-03-27 15:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_answer_options_remove_answer_choices_value_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='SpecialId',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False)),
            ],
        ),
        migrations.AlterField(
            model_name='respondent',
            name='special_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.specialid'),
        ),
    ]
