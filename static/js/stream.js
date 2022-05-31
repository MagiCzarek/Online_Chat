const ID = '05c70608a3f1419c8d38ed6aeef50e17'
const ROOM_NAME = sessionStorage.getItem('room_name')
const TOKEN = sessionStorage.getItem('token')

const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})
let USER_NAME = sessionStorage.getItem('user_name')
let USER_ID = Number(sessionStorage.getItem('USER_ID'))
let tracks = []
let users = {}
// function for chat_room
let joinAndDisplayStream = async () => {
    document.getElementById('chatroom-name').innerText = ROOM_NAME
    client.on('user-published', joinUserHandler)
    client.on('user-left', leaveUserHandler)


    try{
        await client.join(ID, ROOM_NAME, TOKEN, USER_ID)
    }catch (join_error){
        console.error(join_error)
        window.open('/','_self')

    }


    tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let videoPlayer = `<div class="video-container" id="user-container-${USER_ID}">
                <div class="username-wrapper"><span class="user-name">Name </span></div>
                <div class="video-content-player" id="user-${USER_ID}"></div>
            </div>`
    document.getElementById('video-stream').insertAdjacentHTML('beforeend', videoPlayer)

    tracks[1].play(`user-${USER_ID}`)

    await client.publish([tracks[0], tracks[1]])
}
//handling leaving the page
let leaveUserHandler = async(user)=> {
    delete users[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

//handling joining new user to chat
let joinUserHandler = async (user, media) => {
    users[user.uid] = user
    await client.subscribe(user, media)

    if (media === 'audio') {
        user.audioTrack.play()

    }

    if (media === 'video') {
        let videoPlayer = document.getElementById(`user-conatiner-${user.uid}`)
        if (videoPlayer != null) {
            videoPlayer.remove()
        }
        videoPlayer = `<div class="video-container" id="user-container-${user.uid}">
                <div class="username-wrapper"><span class="user-name">Name </span></div>
                <div class="video-content-player" id="user-${user.uid}"></div>
            </div>`
        document.getElementById('video-stream').insertAdjacentHTML('beforeend', videoPlayer)
        user.videoTrack.play(`user-${user.uid}`)
    }

}
//function for handling microphone mute
let switchMicrophone = async (e)=>{
    if(tracks[0].muted){
        await tracks[0].setMuted(false)
        e.target.style.backgroundColor = '#D3D3D3FF'
    }else{
         await tracks[0].setMuted(true)
        e.target.style.backgroundColor = '#ff726f'
    }

}

//function for handling camera switch
let switchCamera = async (e)=>{
    if(tracks[1].muted){
        await tracks[1].setMuted(false)
        e.target.style.backgroundColor = '#D3D3D3FF'
    }else{
         await tracks[1].setMuted(true)
        e.target.style.backgroundColor = '#ff726f'
    }

}

//Function for handling leave button leaving the stream
let leaveAndRemoveStream= async () => {
    for (let i=0; tracks.length >i;i++){
        tracks[i].stop()
        tracks[i].close()

    }
    await client.leave()
    window.open('/','_self')

}

joinAndDisplayStream()

document.getElementById('exit-btn').addEventListener('click',leaveAndRemoveStream)
document.getElementById('video-btn').addEventListener('click',switchCamera)
document.getElementById('micro-btn').addEventListener('click',switchMicrophone)

console.log('connected to stream')