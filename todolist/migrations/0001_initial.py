# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(unique=True, max_length=200)),
                ('detail', models.TextField()),
                ('completed', models.BooleanField()),
                ('start_date', models.DateField()),
                ('expired_date', models.DateField()),
                ('priority', models.IntegerField(choices=[(1, b'normal'), (2, b'urgent'), (3, b'very urgent')])),
            ],
        ),
    ]
