class TrackCard {
  constructor({ card, id, likes, dislikes, likeUserResponse }) {
    this.card = card;
    this.id = id;
    this.likes = likes;
    this.dislikes = dislikes;
    this.likeUserResponse = likeUserResponse;
  }

  async like() {
    const response = await axios.post(
      `http://localhost:5000/getTracks/like/${this.id}`,
      {
        data: 1,
      }
    );
    updateLikeIcon(response.data.amt, true);
    return response.data;
  }

  async dislike() {
    const response = await axios.post(
      `http://localhost:5000/getTracks/like/${this.id}`,
      {
        data: -1,
      }
    );
    updateLikeIcon(response.data.amt, false);
    return response.data;
  }
}

const recomendationList = document.querySelector(".recomendationList");
const rangeIn = document.getElementById("rangeIn");
const forward = document.querySelector(".forward");
const back = document.querySelector(".back");
const pause = document.querySelector(".pause");
const likeBtn = document.getElementById("likeBtnId");
const disLikeBtnId = document.getElementById("disLikeBtnId");
const AddToPlayListOption = document.querySelector(".AddToPlayListOption");

//PlayListr
const showPlayListsNames = document.getElementById("showPlayListsNames");
const addToPlayListsBtn = document.getElementById("addToPlayListsBtn");
const addPlayListForm = document.getElementById("addPlayListForm");

let songPlaying = null;
let cardObjects = {};

// PlayList dialog js
async function showPlayListPopup() {
  const response = await axios.get(
    "http://localhost:5000/playlists/getPlayListNames"
  );

  showPlayListsNames.showModal();
  // adjustDivINput.innerHTML = ""
  response.data.forEach((element) => {
    const label = document.createElement("label");
    label.title = "playList";
    label.innerText = element.playListName;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "playListName";
    const adjustDivINput = document.createElement("div");
    input.value = element._id;
    adjustDivINput.appendChild(label);
    adjustDivINput.appendChild(input);
    showPlayListsNames
      .querySelector(".checkBoxSpace")
      .appendChild(adjustDivINput);
  });
  const newInput = document.createElement("input");
  newInput.name = "SongToBeAdded";
  newInput.value = JSON.stringify(cardObjects[songPlaying.parentNode.id]);
  newInput.hidden = true;
  showPlayListsNames.querySelector(".checkBoxSpace").appendChild(newInput);
  console.log(response.data);
  console.log(cardObjects);
}
async function AddToPlayLists(e) {
  e.preventDefault();
  const formData = new FormData(addPlayListForm);
  const params = new URLSearchParams(formData);
  showPlayListsNames.close();
  const response = await axios.put(
    "http://localhost:5000/playlists/updatePlayLists",
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  showPlayListsNames.querySelector(".checkBoxSpace").innerHTML = "";
}
addToPlayListsBtn.addEventListener("click", AddToPlayLists);

function updateLikeIcon(amt, updateLike) {
  if (updateLike) {
    if (amt > 0) {
      likeBtn.src = "/public/appImages/like-svgrepo-com.svg";
      disLikeBtnId.src = "/public/appImages/dislikeE.svg";
      return;
    }
    likeBtn.src = "/public/appImages/like-svgrepo-com(1).svg";
    return;
  }
  // else update dislike

  if (amt > 0) {
    disLikeBtnId.src = "/public/appImages/dislikedF.svg";
    likeBtn.src = "/public/appImages/like-svgrepo-com(1).svg";
    return;
  }
  disLikeBtnId.src = "/public/appImages/dislikeE.svg";
  return;
}
function updateIcon(to) {
  const iconToBeUpdated = pause.querySelector("img");
  if (to == "pause") {
    iconToBeUpdated.src = "/public/appImages/pause.svg";
    return;
  }
  iconToBeUpdated.src = "/public/appImages/PlayListr.svg";
}
function forwardOrBackward(seconds) {
  if (!songPlaying) {
    return;
  }
  if (
    songPlaying.currentTime + seconds > songPlaying.duration ||
    songPlaying.currentTime < 0
  ) {
    return;
  }
  songPlaying.currentTime += seconds;
}

function playSongOnCard(e) {
  const clickedAudio = e.target.parentNode.querySelector("audio");
  const cardId = e.target.parentNode.id;
  console.log(songPlaying);
  if (songPlaying) {
    songPlaying.pause();
  }
  songPlaying = clickedAudio;
  clickedAudio.play();
  updateIcon("pause");
  rangeIn.value = 0;
  rangeIn.max = clickedAudio.duration;
}

function updateRange(e) {
  if (!songPlaying) {
    return;
  }
  rangeIn.value = songPlaying.currentTime;
}
function updateSongTime() {
  if (!songPlaying) {
    return;
  }
  songPlaying.currentTime = rangeIn.value;
}

function pausePlayFn() {
  if (!songPlaying) {
    return;
  }
  if (songPlaying.paused) {
    songPlaying.PlayListr();
    updateIcon("pause");
    return;
  }
  updateIcon("PlayListr");
  songPlaying.pause();
}

async function handleLike(e) {
  if (!songPlaying) return;
  await cardObjects[songPlaying.parentNode.id].like(1);
}
async function handleDislike(e) {
  if (!songPlaying) return;
  await cardObjects[songPlaying.parentNode.id].dislike(1);
}

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".recomendationElement img");
  images.forEach((img) => {
    img.addEventListener("click", playSongOnCard);
  });
});


