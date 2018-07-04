# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0010_auto_20180703_2026'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todo',
            name='click',
        ),
        migrations.AlterField(
            model_name='todo',
            name='expired_date',
            field=models.DateField(default=datetime.datetime(2018, 7, 4, 9, 22, 33, 33575, tzinfo=utc), blank=True),
        ),
        migrations.AlterField(
            model_name='todo',
            name='start_date',
            field=models.DateField(default=datetime.datetime(2018, 7, 4, 9, 22, 33, 33460, tzinfo=utc)),
        ),
    ]
