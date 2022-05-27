const ID = '05c70608a3f1419c8d38ed6aeef50e17'
const CHANNEL = 'main'
const TOKEN = '00605c70608a3f1419c8d38ed6aeef50e17IAB/HP4tgb1e8anLfuhyKgAj3xRmE5a0D1XfrX5R12HS8WTNKL8AAAAAEAC0lltg9mWSYgEAAQD0ZZJi'

const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})
let USER_ID;
let tracks = []
let users = {}

let joinAndDisplayStream = async () => {
    client.on('user-published', joinUserHandler)

    client.on('user-left', leaveUserHandler)
    USER_ID = await client.join(ID, CHANNEL, TOKEN, null)

    tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let videoPlayer = `<div class="video-container" id="user-container-${USER_ID}">
                <div class="username-wrapper"><span class="user-name">Name </span></div>
                <div class="video-content-player" id="user-${USER_ID}"></div>
            </div>`
    document.getElementById('video-stream').insertAdjacentHTML('beforeend', videoPlayer)

    tracks[1].play(`user-${USER_ID}`)

    await client.publish([tracks[0], tracks[1]])
}
let leaveUserHandler = async(user)=> {
    delete users[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}


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
joinAndDisplayStream()

console.log('connected to stream')