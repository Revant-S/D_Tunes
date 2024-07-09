const recomendationList = document.querySelector(".recomendationList");
const rangeIn = document.getElementById("rangeIn")
const forward = document.querySelector(".forward")
const back = document.querySelector(".back")
const pause = document.querySelector(".pause")
let songPlaying = null

function updateIcon(to) {
    const iconToBeUpdated  = pause.querySelector("img")
    if (to == "pause") {
        iconToBeUpdated.src = "/public/appImages/pause.svg"
        return
    }
    iconToBeUpdated.src = "/public/appImages/play.svg"
}
function forwardOrBackward(seconds) {

    if (!songPlaying) {
        return
    }
    if (songPlaying.currentTime + seconds > songPlaying.duration || songPlaying.currentTime < 0) {
        return
    }
    songPlaying.currentTime+= seconds
}


function playSongOnCard(e) {
    const clickedAudio = e.target.parentNode.querySelector("audio")
    console.log(songPlaying);
    if (songPlaying) {
        songPlaying.pause()
    }
    songPlaying = clickedAudio
    clickedAudio.play();
    updateIcon("pause")
    rangeIn.value = 0

    rangeIn.max = clickedAudio.duration
}

function updateRange(e) {
    if (!songPlaying) {
        return
    }
    rangeIn.value = songPlaying.currentTime 
}
function updateSongTime() {
    if (!songPlaying) {
        return
    }
    songPlaying.currentTime = rangeIn.value
}

function pausePlayFn() {
    if (!songPlaying) {
        return
    }
    if (songPlaying.paused) {
        songPlaying.play();
        updateIcon("pause")
        return
    }
    updateIcon("play")
    songPlaying.pause()

}

function appendToRecommendationList(obj) {
    const audioPlayer = new Audio(obj.track)
    audioPlayer.addEventListener("timeupdate" ,updateRange)
    const card = document.createElement("div")
    const img = document.createElement("img")
    img.src = obj.images;
    const nameDiv = document.createElement("div");
    const h3Tag = document.createElement("h3");
    h3Tag.innerText=obj.TrackName;
    nameDiv.appendChild(h3Tag)
    nameDiv.classList.add("CardnameDiv")
    card.appendChild(img)
    card.appendChild(nameDiv);
    card.appendChild(audioPlayer)
    card.classList.add("recomendationElement")
    img.addEventListener("click" , playSongOnCard)
    recomendationList.appendChild(card)
    rangeIn.addEventListener("change" , updateSongTime)
    pause.querySelector("img").addEventListener("click" , pausePlayFn)
    forward.addEventListener("click" , ()=>{forwardOrBackward(10)})
    back.addEventListener("click" , ()=>{forwardOrBackward(-10)})
}

async function getdata() {
    try {
        const response = await axios.get("http://localhost:5000/getTracks/getAllTracks" , {
            headers : {
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
}


async function populaterecommendationList() {
    const List = await getdata()
    List.forEach(element => {
        appendToRecommendationList(element)
    });
}

populaterecommendationList()