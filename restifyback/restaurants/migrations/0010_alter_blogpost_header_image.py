# Generated by Django 4.0.2 on 2022-04-19 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0009_alter_restaurant_address_alter_restaurant_email_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogpost',
            name='header_image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
