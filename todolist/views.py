from django.shortcuts import render
from django.utils.six import BytesIO
from rest_framework import generics
from rest_framework.parsers import JSONParser

from .models import Todo
from .serializers import TodoSerializer


class TodoList(generics.ListCreateAPIView):

    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


def save(request):
    get = request.GET
    str_extract = get['str']
    stream = BytesIO(str_extract)
    json_list = JSONParser().parse(stream)
    obj_list = []
    title_key_dict = {}

    obj_ori = Todo.objects.all()
    index = 0
    for todo in obj_ori:
        title_key_dict[todo.title] = index
        index += 1

    for data in json_list:
        title = data['title']
        if title in title_key_dict.keys():
            index = title_key_dict[title]
            serializer = TodoSerializer(obj_ori[index], data=data)
            if serializer.is_valid(raise_exception=True):
                todo = serializer.save()
                todo.save()
            else:
                print(serializer.errors)
                raise ValueError
            title_key_dict.pop(title)
        else:
            serializer = TodoSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                todo = serializer.save()
                todo.save()
            else:
                print(serializer.errors)
                raise ValueError
        obj_list.append(todo)

    for title in title_key_dict.keys():
        index = title_key_dict[title]
        obj_ori[index].delete()

    return render(request, 'index.html')


def index(request):
    return render(request, 'templates/index.html')

