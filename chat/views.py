from django.shortcuts import render

# Create your views here.

def menu_view(request):
    return render(request,'chat/menu.html')

def chat_room_view(request):
    return render(request,'chat/chat_room.html')
