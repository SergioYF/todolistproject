# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0005_auto_20180702_1434'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='expired_date',
            field=models.DateField(default=datetime.datetime(2018, 7, 2, 17, 53, 36, 833218, tzinfo=utc), blank=True),
        ),
        migrations.AlterField(
            model_name='todo',
            name='start_date',
            field=models.DateField(default=datetime.datetime(2018, 7, 2, 17, 53, 36, 833170, tzinfo=utc)),
        ),
    ]
