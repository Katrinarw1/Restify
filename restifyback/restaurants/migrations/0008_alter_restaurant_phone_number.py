# Generated by Django 4.0.2 on 2022-04-17 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0007_blogpost_blogpost_title unique for author'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='phone_number',
            field=models.CharField(max_length=20),
        ),
    ]
