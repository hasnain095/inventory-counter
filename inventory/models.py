from django.db import models

# Create your models here.


class Inventory(models.Model):
    """
        Store inventory with name and count
    """
    name = models.CharField(max_length=100, unique=True)
    count = models.PositiveIntegerField()

    def __str__(self):
        return self.name
