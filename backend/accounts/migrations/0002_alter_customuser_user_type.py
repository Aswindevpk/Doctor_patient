# Generated by Django 5.0.7 on 2024-07-31 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='user_type',
            field=models.CharField(blank=True, choices=[('doctor', 'Doctor'), ('patient', 'Patient')], default=None, max_length=10, null=True),
        ),
    ]
