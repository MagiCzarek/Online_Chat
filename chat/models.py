from django.db import models

# Create your models here.

class ChatRoomUser(models.Model):
    user_name = models.CharField(max_length=100)
    user_id = models.CharField(max_length=100)
    room_name = models.CharField(max_length=100)

    def __str__(self):
        return self.user_name, self.user_id, self.room_name



