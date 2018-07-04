import django.utils.timezone as timezone
from rest_framework import serializers

from .models import Todo


class TodoSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=200)
    detail = serializers.CharField()
    completed = serializers.BooleanField(default=False)
    start_date = serializers.DateField(default=timezone.now())
    expired_date = serializers.DateField(default=timezone.now())
    priority = serializers.IntegerField()

    class Meta:
        model = Todo
        fields = ('title', 'detail', 'completed', 'start_date', 'expired_date', 'priority')

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.detail = validated_data.get('detail', instance.detail)
        instance.completed = validated_data.get('completed', instance.completed)
        instance.start_date = timezone.now()
        instance.expired_date = validated_data.get('expired_date', instance.expired_date)
        instance.priority = validated_data.get('priority', instance.priority)
        instance.save()
        return instance

    def create(self, validated_data):
        return Todo(**validated_data)
