# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0040_user_has_given_referral_bonus_user_referred_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='currency',
            field=models.CharField(blank=True, default='BDT', max_length=10),
        ),
    ]
