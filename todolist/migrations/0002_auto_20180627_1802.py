# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='expired_date',
            field=models.DateField(blank=True),
        ),
        migrations.AlterField(
            model_name='todo',
            name='priority',
            field=models.IntegerField(blank=True, choices=[(1, b'normal'), (2, b'urgent'), (3, b'very urgent')]),
        ),
        migrations.AlterField(
            model_name='todo',
            name='start_date',
            field=models.DateField(blank=True),
        ),
    ]
