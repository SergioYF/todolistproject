from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.TodoList.as_view(), name='todo-list'),
	url(r'^save$', views.save, name='save'),
]
