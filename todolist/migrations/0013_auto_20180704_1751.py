# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0012_auto_20180704_1740'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='expired_date',
            field=models.DateField(default=datetime.datetime(2018, 7, 4, 9, 51, 47, 500535, tzinfo=utc), blank=True),
        ),
        migrations.AlterField(
            model_name='todo',
            name='start_date',
            field=models.DateField(default=datetime.datetime(2018, 7, 4, 9, 51, 47, 500488, tzinfo=utc)),
        ),
    ]
