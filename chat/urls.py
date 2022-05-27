from . import views
from django.urls import path

urlpatterns = [
    path('', views.menu_view),
    path('chat_room/', views.chat_room_view),

]
