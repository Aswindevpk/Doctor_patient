# Generated by Django 5.0.7 on 2024-08-03 17:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_blog_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='summary',
            field=models.TextField(default=''),
        ),
    ]
