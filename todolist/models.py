from django.db import models
import django.utils.timezone as timezone

# Create your models here.


class UncompletedTodoManager(models.Manager):
    def get_queryset(self):
        return super(UncompletedTodoManager, self).get_queryset().filter(completed=False)


class Todo(models.Model):
    title = models.CharField(max_length=200, unique=True)
    detail = models.TextField()
    completed = models.BooleanField(default=False)
    # click = models.BooleanField(default=False)
    start_date = models.DateField(default=timezone.now())
    expired_date = models.DateField(default=timezone.now(), blank=True)
    priority = models.IntegerField(choices=[(1, 'normal'), (2, 'urgent'), (3, 'very urgent')], blank=True)

    objects = models.Manager()
    completed_objects = UncompletedTodoManager()
    #
    # def __init__(self, title, detail, start_date=None, expired_date=None, priority=None):
    #     self.title = title
    #     self.detail = detail
    #     self.completed = False
    #     self.click = False
    #     self.start_date = start_date or timezone.now()
    #     self.expired_date = expired_date or timezone.now()
    #     self.priority = priority or 1

    def __str__(self):
        if len(self.detail) < 20:
            detail = self.detail
        else:
            detail = self.detail[:20]
        return "{}: \n\t{}...".format(self.title, detail)

