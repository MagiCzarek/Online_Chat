import random
import time

from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.

def menu_view(request):
    return render(request,'chat/menu.html')

def chat_room_view(request):
    return render(request,'chat/chat_room.html')

def generate_token(request):
    # Build token with uid
    appId = '05c70608a3f1419c8d38ed6aeef50e17'
    appCertificate ='efff08f26e6948eca9cd366292019b2a'
    channelName = request.GET['channel']
    uid = random.randint(1,500)
    role = 1
    expirationTime = 3600*24
    timeStamp = time.time()
    privilegeExpiredTs = timeStamp +expirationTime


    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token':token, 'uid':uid},safe=False)
