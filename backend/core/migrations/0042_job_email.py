# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0041_job_currency'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='email',
            field=models.CharField(default='N/A', max_length=100),
        ),
    ]
