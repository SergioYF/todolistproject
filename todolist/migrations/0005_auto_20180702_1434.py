# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0004_auto_20180627_1816'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='click',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='todo',
            name='expired_date',
            field=models.DateField(default=datetime.datetime(2018, 7, 2, 6, 34, 40, 658532, tzinfo=utc), blank=True),
        ),
        migrations.AlterField(
            model_name='todo',
            name='start_date',
            field=models.DateField(default=datetime.datetime(2018, 7, 2, 6, 34, 40, 658492, tzinfo=utc)),
        ),
    ]
