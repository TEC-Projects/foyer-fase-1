from django.db import models


class TheatreGood(models.Model):
    id = models.IntegerField(
        db_column='THEATRE_GOOD_ID',
        primary_key=True,
        auto_created=True
    )
    name = models.CharField(
        max_length=25
    )
    description = models.CharField(
        max_length=150
    )
    location = models.CharField(
        max_length=150
    )

    class Meta:
        managed = False
        db_table = 'THEATRE_GOOD'
