// const { createBuilderStatusReporter } = require("typescript");

class TrackCard {
  constructor({ card, id, likes, dislikes, likedByUser, disLikedByUser, name }) {
    this.card = card;
    this.id = id;
    this.likes = likes || 0;
    this.dislikes = dislikes || 0;
    this.likedByUser = likedByUser || false;
    this.disLikedByUser = disLikedByUser || false;
    this.name = name;
  }

  async like() {
    const response = await axios.post(
      `http://localhost:5000/getTracks/like/${this.id}`,
      { data: 1 }
    );
    this.likedByUser = true;
    this.disLikedByUser = false;
    this.likes += 1;
    return response.data;
  }

  async dislike() {
    const response = await axios.post(
      `http://localhost:5000/getTracks/like/${this.id}`,
      { data: -1 }
    );
    this.likedByUser = false;
    this.disLikedByUser = true;
    this.dislikes += 1;
    return response.data;
  }
}

let cardObjects = {};
let cardElements = {};
const recommendationList = document.querySelector(".recomendationList");
const rangeIn = document.getElementById("rangeIn");
const forward = document.querySelector(".forward");
const back = document.querySelector(".back");
const pause = document.querySelector(".pause");
const likeBtn = document.getElementById("likeBtnId");
const disLikeBtnId = document.getElementById("disLikeBtnId");
const addToPlayListOption = document.querySelector(".AddToPlayListOption");
const allCards = document.querySelectorAll(".recomendationElement")
const showPlayListsNames = document.getElementById("showPlayListsNames");
const addToPlayListsBtn = document.getElementById("addToPlayListsBtn");
const addPlayListForm = document.getElementById("addPlayListForm");

let songPlaying = null;

async function showPlayListPopup() {
  const response = await axios.get("http://localhost:5000/playlists/getPlayListNames");
  showPlayListsNames.showModal();
  showPlayListsNames.querySelector(".checkBoxSpace").innerHTML = "";
  response.data.forEach((element) => {
    const label = document.createElement("label");
    label.title = "playList";
    label.innerText = element.playListName;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "playListName";
    const adjustDivInput = document.createElement("div");
    input.value = element._id;
    adjustDivInput.appendChild(label);
    adjustDivInput.appendChild(input);
    showPlayListsNames.querySelector(".checkBoxSpace").appendChild(adjustDivInput);
  });
  const newInput = document.createElement("input");
  newInput.name = "SongToBeAdded";
  newInput.value = JSON.stringify(cardObjects[songPlaying.parentNode.id]);
  newInput.hidden = true;
  showPlayListsNames.querySelector(".checkBoxSpace").appendChild(newInput);
}

async function AddToPlayLists(e) {
  e.preventDefault();
  const formData = new FormData(addPlayListForm);
  const params = new URLSearchParams(formData);
  showPlayListsNames.close();
  await axios.put(
    "http://localhost:5000/playlists/updatePlayLists",
    params.toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  showPlayListsNames.querySelector(".checkBoxSpace").innerHTML = "";
}

function updateLikeIcon(amt, updateLike) {
  if (updateLike) {
    likeBtn.src = amt > 0 ? "/public/appImages/like-svgrepo-com.svg" : "/public/appImages/like-svgrepo-com(1).svg";
    disLikeBtnId.src = "/public/appImages/dislikeE.svg";
  } else {
    disLikeBtnId.src = amt > 0 ? "/public/appImages/dislikedF.svg" : "/public/appImages/dislikeE.svg";
    likeBtn.src = "/public/appImages/like-svgrepo-com(1).svg";
  }
}

function updateIcon(to) {
  pause.querySelector("img").src = to === "pause" ? "/public/appImages/pause.svg" : "/public/appImages/play.svg";
}

function forwardOrBackward(seconds) {
  if (!songPlaying) return;
  const newTime = songPlaying.currentTime + seconds;
  if (newTime > songPlaying.duration || newTime < 0) return;
  songPlaying.currentTime = newTime;
}

function playSongOnCard(e) {
  const clickedAudio = e.target.parentNode.querySelector("audio");
  const cardId = e.target.parentNode.id;
  if (songPlaying) {
    songPlaying.pause();
    songPlaying.removeEventListener('timeupdate', updateRange);
  }
  const cardObj = cardObjects[cardId];
  likeBtn.src = cardObj.likedByUser ? "/public/appImages/like-svgrepo-com.svg" : "/public/appImages/like-svgrepo-com(1).svg";
  disLikeBtnId.src = cardObj.disLikedByUser ? "/public/appImages/dislikedF.svg" : "/public/appImages/dislikeE.svg";
  songPlaying = clickedAudio;
  clickedAudio.play();
  clickedAudio.addEventListener('timeupdate', updateRange);
  updateIcon("pause");
  rangeIn.value = 0;
  rangeIn.max = clickedAudio.duration;
}

function updateRange() {
  if (!songPlaying) return;
  rangeIn.value = songPlaying.currentTime;
}

function updateSongTime() {
  if (!songPlaying) return;
  songPlaying.currentTime = rangeIn.value;
}

function pausePlayFn() {
  if (!songPlaying) return;
  if (songPlaying.paused) {
    songPlaying.play();
    updateIcon("pause");
  } else {
    songPlaying.pause();
    updateIcon("play");
  }
}

async function handleLike() {
  if (!songPlaying) return;
  const cardObj = cardObjects[songPlaying.parentNode.id];
  const response = await cardObj.like();
  updateLikeIcon(cardObj.likes, true);
}

async function handleDislike() {
  if (!songPlaying) return;
  const cardObj = cardObjects[songPlaying.parentNode.id];
  const response = await cardObj.dislike();
  updateLikeIcon(cardObj.dislikes, false);
}


document.addEventListener("DOMContentLoaded", () => {
  rangeIn.addEventListener("change", updateSongTime);
  forward.addEventListener('click', () => forwardOrBackward(10));
  back.addEventListener('click', () => forwardOrBackward(-10));
  pause.addEventListener('click', pausePlayFn);
  likeBtn.addEventListener('click', handleLike);
  disLikeBtnId.addEventListener('click', handleDislike);
  addToPlayListOption.addEventListener('click', showPlayListPopup);
  addToPlayListsBtn.addEventListener('click', AddToPlayLists);
  allCards.forEach((card , index)=>{
    const fullInfo = JSON.parse(card.getAttribute("data-completeSongInfo"));
    card.addEventListener("click" , playSongOnCard)
    const cardObj = new TrackCard({
      card : `card-${index}`,
      likedByUser : fullInfo.likedByUser,
      disLikedByUser : fullInfo.dislikedByUser,

    })
    cardObjects[`card-${index}`] =  cardObj
  })
});