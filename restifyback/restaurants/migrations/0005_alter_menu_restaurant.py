# Generated by Django 4.0.2 on 2022-03-15 06:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0004_alter_menu_restaurant'),
    ]

    operations = [
        migrations.AlterField(
            model_name='menu',
            name='restaurant',
            field=models.ForeignKey(default='kat', on_delete=django.db.models.deletion.CASCADE, related_name='restaurant_menu', to='restaurants.restaurant', verbose_name='restaurant_menus'),
        ),
    ]
