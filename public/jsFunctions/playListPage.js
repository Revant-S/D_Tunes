class TrackCard {
  constructor({
    card,
    id,
    likes,
    dislikes,
    likedByUser,
    name,
    disLikedByUser,
  }) {
    this.card = card;
    this.id = id;
    this.likes = likes;
    this.dislikes = dislikes;
    this.likedByUser = likedByUser;
    this.disLikedByUser = disLikedByUser;
    this.name = name;
  }

  async like() {
    const response = await axios.post(
      `http://localhost:5000/getTracks/like/${this.id}`,
      {
        data: 1,
      }
    );
    if (response.data.amt > 0) {
      this.likedByUser = true;
      this.disLikedByUser = false;
    } else {
      this.likedByUser = false;
    }
    updateLikeIcon(response.data.amt, true);
    return response.data;
  }

  async dislike() {
    console.log(this.id);
    const response = await axios.post(
      `http://localhost:5000/getTracks/like/${this.id}`,
      {
        data: -1,
      }
    );
    if (response.data.amt > 0) {
      this.disLikedByUser = true;
      this.likedByUser = false;
    } else {
      this.disLikedByUser = false;
    }
    updateLikeIcon(response.data.amt, false);
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
const allCards = document.querySelectorAll(".recomendationElement");
const showPlayListsNames = document.getElementById("showPlayListsNames");
const addToPlayListsBtn = document.getElementById("addToPlayListsBtn");
const addPlayListForm = document.getElementById("addPlayListForm");
let isSequentialPlayOn = false;
let songPlaying = null;
const listOfaudioTags = document.querySelectorAll("audio");
let playIngAudioIndex = 0;
async function showPlayListPopup() {
  const response = await axios.get(
    "http://localhost:5000/playlists/getPlayListNames"
  );
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
    showPlayListsNames
      .querySelector(".checkBoxSpace")
      .appendChild(adjustDivInput);
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
    if (amt > 0) {
      likeBtn.src = "/public/appImages/like-svgrepo-com.svg";
      disLikeBtnId.src = "/public/appImages/dislikeE.svg";
      return;
    }
    likeBtn.src = "/public/appImages/like-svgrepo-com(1).svg";
    return;
  }
  if (amt > 0) {
    disLikeBtnId.src = "/public/appImages/dislikedF.svg";
    likeBtn.src = "/public/appImages/like-svgrepo-com(1).svg";
    return;
  }
  disLikeBtnId.src = "/public/appImages/dislikeE.svg";
  return;
}

function updateIcon(to) {
  pause.querySelector("img").src =
    to === "pause"
      ? "/public/appImages/pause.svg"
      : "/public/appImages/play.svg";
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
    songPlaying.removeEventListener("timeupdate", updateRange);
  }

  const cardObj = cardObjects[cardId];
  likeBtn.src = cardObj.likedByUser
    ? "/public/appImages/like-svgrepo-com.svg"
    : "/public/appImages/like-svgrepo-com(1).svg";
  disLikeBtnId.src = cardObj.disLikedByUser
    ? "/public/appImages/dislikedF.svg"
    : "/public/appImages/dislikeE.svg";
  songPlaying = clickedAudio;

  clickedAudio.play();
  clickedAudio.addEventListener("timeupdate", updateRange);
  updateIcon("pause");
  rangeIn.value = 0;
  rangeIn.max = clickedAudio.duration;
}

function updateRange() {
  if (!songPlaying) return;
  rangeIn.value = songPlaying.currentTime;
  if (songPlaying.currentTime >= songPlaying.duration) {
    playIngAudioIndex++;
    playNextSong();
  }
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
}

async function handleDislike() {
  if (!songPlaying) return;
  const cardObj = cardObjects[songPlaying.parentNode.id];
  const response = await cardObj.dislike();
}

function playNextSong() {
  if (!isSequentialPlayOn) {
    (songPlaying = null), (playIngAudioIndex = 0);
    return;
  }
  songPlaying = listOfaudioTags[playIngAudioIndex];
  const cardRequired = cardObjects[`card-${playIngAudioIndex}`];
  likeBtn.src = cardRequired.likedByUser
    ? "/public/appImages/like-svgrepo-com.svg"
    : "/public/appImages/like-svgrepo-com(1).svg";
  disLikeBtnId.src = cardRequired.disLikedByUser
    ? "/public/appImages/dislikedF.svg"
    : "/public/appImages/dislikeE.svg";
  listOfaudioTags[playIngAudioIndex].addEventListener("timeupdate", () => {
    console.log("here");
    updateRange();
  });
  pausePlayFn();
}
document.getElementById("checkbox").addEventListener("change", (e) => {
  if (e.target.checked) {
    isSequentialPlayOn = true;
    songPlaying = listOfaudioTags[0];
    listOfaudioTags[playIngAudioIndex].addEventListener("timeupdate", () => {
      console.log("here");
      updateRange();
    });
    pausePlayFn();
    return;
  }
  isSequentialPlayOn = false;
});
document.addEventListener("DOMContentLoaded", () => {
  rangeIn.addEventListener("change", updateSongTime);
  forward.addEventListener("click", () => forwardOrBackward(10));
  back.addEventListener("click", () => forwardOrBackward(-10));
  pause.addEventListener("click", pausePlayFn);
  likeBtn.addEventListener("click", handleLike);
  disLikeBtnId.addEventListener("click", handleDislike);
  addToPlayListOption.addEventListener("click", showPlayListPopup);
  addToPlayListsBtn.addEventListener("click", AddToPlayLists);
  allCards.forEach((card, index) => {
    const fullInfo = JSON.parse(card.getAttribute("data-completeSongInfo"));
    card.addEventListener("click", (e) => {
      isSequentialPlayOn = false;
      document.getElementById("checkbox").checked = false;
      playSongOnCard(e);
    });
    const cardObj = new TrackCard({
      card: `card-${index}`,
      likedByUser: fullInfo.likedByUser,
      disLikedByUser: fullInfo.dislikedByUser,
      id: fullInfo.id,
    });
    cardObjects[`card-${index}`] = cardObj;
  });
  const nodeList = document.querySelectorAll(".deletePlaylistBtn");
  if (!nodeList || nodeList.length == 0) return;
  nodeList.forEach((node) => {
    node.addEventListener("click", async (e) => {
      const { playListId, trackId } = JSON.parse(
        e.target.getAttribute("data-Ids")
      );
      const response = await axios.put(
        "http://localhost:5000/playlists/removeTrack",
        {
          trackToRemove: trackId,
          playList: playListId,
        }
      );
      alert(response.data.message);
      window.location.reload();
    });
  });
});
