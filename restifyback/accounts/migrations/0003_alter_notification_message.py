# Generated by Django 4.0.2 on 2022-03-15 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_notification'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='message',
            field=models.CharField(choices=[('0', 'Liked your restaurant'), ('1', 'Followed your restaurant'), ('2', 'Commented on your restaurant'), ('3', 'Liked your blog post'), ('4', 'Posted a new blog post'), ('5', 'Has updated their menu')], max_length=1),
        ),
    ]
