export class TrackCard {
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
let songPlaying = null;
let cardObjects = {};

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
  iconToBeUpdated.src = "/public/appImages/play.svg";
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
    songPlaying.play();
    updateIcon("pause");
    return;
  }
  updateIcon("play");
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

function appendToRecommendationList(obj, index) {
  const audioPlayer = new Audio(obj.track);
  audioPlayer.addEventListener("timeupdate", updateRange);
  const card = document.createElement("div");
  const img = document.createElement("img");
  img.src = obj.images;
  const nameDiv = document.createElement("div");
  const h3Tag = document.createElement("h3");
  h3Tag.innerText = obj.TrackName;
  nameDiv.appendChild(h3Tag);
  nameDiv.classList.add("CardnameDiv");
  card.appendChild(img);
  card.appendChild(nameDiv);
  card.appendChild(audioPlayer);
  card.id = `card-${index}`;
  card.classList.add("recomendationElement");
  img.addEventListener("click", playSongOnCard);
  const cardObj = new TrackCard({
    card: `card-${index}`,
    id: obj.id,
    likes: obj.likes ?? 0,
    dislikes: obj.dislikes ?? 0,
    likeUserResponse: obj.likeUserResponse,
  });
  cardObjects[`card-${index}`] = cardObj;
  recomendationList.appendChild(card);

  rangeIn.addEventListener("change", updateSongTime);
  pause.querySelector("img").addEventListener("click", pausePlayFn);
  forward.addEventListener("click", () => {
    forwardOrBackward(10);
  });
  back.addEventListener("click", () => {
    forwardOrBackward(-10);
  });
  likeBtn.addEventListener("click", handleLike);
  disLikeBtnId.addEventListener("click", handleDislike);
}

async function getdata() {
  try {
    const response = await axios.get(
      "http://localhost:5000/getTracks/getAllTracks",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}

async function populaterecommendationList() {
  const List = await getdata();
  List.forEach((element, index) => {
    appendToRecommendationList(element, index);
  });
}

populaterecommendationList();
