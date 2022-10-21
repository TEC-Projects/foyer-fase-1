from django.db import models
from django.db.models.signals import post_delete

from .TheatreGood import TheatreGood
from .Area import Area


class Element(models.Model):
    # id = models.IntegerField(
    #     db_column='ELEMENT_ID'
    # )
    info = models.OneToOneField(
        TheatreGood,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='ELEMENT_ID'
    )
    area = models.ForeignKey(
        Area,
        models.CASCADE,
        db_column='AREA_ID'
    )

    class Meta:
        managed = False
        db_table = 'ELEMENT'

def delete_theatre_good(instance, **kwargs):
    instance.info.delete()


post_delete.connect(delete_theatre_good, Element)
