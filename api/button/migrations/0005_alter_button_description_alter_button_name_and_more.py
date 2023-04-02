# Generated by Django 4.1.7 on 2023-04-02 00:33

import button.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("button", "0004_button_description"),
    ]

    operations = [
        migrations.AlterField(
            model_name="button",
            name="description",
            field=models.TextField(
                blank=True,
                default="Placeholder description",
                help_text="Description of button",
                max_length=256,
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="button",
            name="name",
            field=models.CharField(
                blank=True,
                default="Untitled",
                help_text="Name of button",
                max_length=256,
            ),
        ),
        migrations.AlterField(
            model_name="button",
            name="primary_color",
            field=models.CharField(
                blank=True,
                default="#000000",
                help_text="Hex color code, e.g. #000000",
                max_length=7,
                validators=[button.models.validate_hex_color],
            ),
        ),
        migrations.AlterField(
            model_name="button",
            name="secondary_color",
            field=models.CharField(
                blank=True,
                default="#FFFFFF",
                help_text="Hex color code, e.g. #FFFFFF",
                max_length=7,
                validators=[button.models.validate_hex_color],
            ),
        ),
        migrations.AlterField(
            model_name="button",
            name="text",
            field=models.CharField(
                blank=True,
                default="Delegate",
                help_text="Text to display on button",
                max_length=256,
            ),
        ),
    ]
