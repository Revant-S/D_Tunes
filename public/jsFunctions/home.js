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
    if (response.data.amt >0) {
      this.likedByUser = true
      this.disLikedByUser = false
    }else{
      this.likedByUser = false
    }
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
    if (response.data.amt >0) {
      this.disLikedByUser = true
      this.likedByUser = false
    }else{
      this.disLikedByUser = false
    }
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
const searchBar = document.getElementById("searchBar");
const showPlayListsNames = document.getElementById("showPlayListsNames");
const addToPlayListsBtn = document.getElementById("addToPlayListsBtn");
const addPlayListForm = document.getElementById("addPlayListForm");
let songPlaying = null;
let cardObjects = {};
let cardElements = {};

// window.location.href = "/home"
async function showPlayListPopup() {
  const response = await axios.get(
    "http://localhost:5000/playlists/getPlayListNames"
  );
  console.log(response.data);
  showPlayListsNames.showModal();
  response.data.forEach((element) => {
    const label = document.createElement("label");
    label.title = "playList";
    label.innerText = element.playListName;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "playListName";
    const songInPlayList = element.trackList.filter(track =>{
      console.log( track.id );
      console.log(songPlaying);
      return  track.id == cardObjects[songPlaying.parentNode.id].id
    })
    console.log(songPlaying.parentNode.id);

    console.log();
    if(songInPlayList.length){
      input.checked = true;
    }
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
  if (songPlaying) {
    songPlaying.pause();
  }
  const cardObj = cardObjects[cardId];
  console.log("LOOK HERE !!!!!!!!!!");
  console.log(cardObj);
  if (cardObj.likedByUser) {
    likeBtn.src = "/public/appImages/like-svgrepo-com.svg";
  } else {
    likeBtn.src = "/public/appImages/like-svgrepo-com(1).svg";
  }
  if (cardObj.disLikedByUser) {
    disLikeBtnId.src = "/public/appImages/dislikedF.svg";
  } else {
    disLikeBtnId.src = "/public/appImages/dislikeE.svg";
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
    name: obj.TrackName,
    likedByUser: obj.likedByUser,
    disLikedByUser: obj.dislikedByUser,
  });
  cardObjects[`card-${index}`] = cardObj;
  cardElements[`card-${index}`] = card;
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
  console.log(AddToPlayListOption);
  AddToPlayListOption.querySelector("img").addEventListener(
    "click",
    showPlayListPopup
  );
}
async function getdata(search = "shape of you") {
  try {
    const response = await axios.get(
      "http://localhost:5000/getTracks/getAllTracks",
      {
        params: {
          search
        } , 
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
       const redirectUrl = error.response.data.redirect;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.log("Unauthorized access");
      }
    } else {
      console.log(error.message);
    }
  }
}
async function populaterecommendationList() {
  const List = await getdata();
  List.forEach((element, index) => {
    appendToRecommendationList(element, index);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".recomendationElement img");
  images.forEach((img) => {
    img.addEventListener("click", playSongOnCard);
  });
});
let showList = [];
function showFilteredLists() {
  recomendationList.innerHTML = "";
  let toShow = [];
  showList.forEach((element) => {
    toShow.push(cardElements[element]);
  });
  toShow.forEach((element) => {
    recomendationList.appendChild(element);
  });
}
let searchForUser = false;
//Toggle Switch Controls and switching the search Functionality
searchBar.addEventListener("input",async (e) => {
  showList = [];
  if (!searchForUser) {
    console.log("HERE");
    const reqArray = updateSearchSongs(e.target.value.toLowerCase());
  } else {
    const reqArray = updateUserSearch(e.target.value.toLowerCase());
  }
});

function showThisUserProfile(e) {
  const email = e.target.parentNode.querySelector(".user-email").innerText
  window.location.href = `/user/viewProfile/${email}`
}

function createUserCard(user) {
  const card = document.createElement("div");
  card.classList.add("user-card");
  const img = document.createElement("img");
  img.src = user.profileImageUrl;
  img.alt = `${user.userName}'s profile picture`;
  img.classList.add("user-avatar");
  const name = document.createElement("h2");
  name.innerText = user.userName;
  name.classList.add("user-name");
  const email = document.createElement("p");
  email.innerText = user.emailId;
  email.classList.add("user-email");
  const role = document.createElement("p");
  role.innerText = `Role: ${user.role}`;
  role.classList.add("user-role");
  const stats = document.createElement("div");
  stats.classList.add("user-stats");
  stats.innerHTML = `
    <p>Friends: ${user.friends.length}</p>
    <p>Published Music: ${user.musicPublished.length}</p>
  `;
  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(email);
  card.appendChild(role);
  card.appendChild(stats);
  
  return card;
}

function showUserCards(reqArray) {
  recomendationList.innerHTML = "";
  reqArray.forEach((user) => {
    const card = createUserCard(user);
    card.addEventListener("click", showThisUserProfile);
    recomendationList.appendChild(card);
  });
}

const updateUserSearch = debounce(async (text) => {
  console.log(text);
  const cardsToUpdate = await axios.get(
    "http://localhost:5000/user/searchUser",
    {
      params: {
        search: text,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  showUserCards(cardsToUpdate.data);
}, 1000);

const updateSearchSongs = debounce(async (text) => {
  try {
    const response = await axios.get("http://localhost:5000/getTracks/searchTracks", {
      params: {
        search: text
      },
      headers: {
        "Content-Type": "application/json",
      }
    });
    recomendationList.innerHTML = '';
    cardObjects = {};
    cardElements = {};
    showList = [];
    response.data.forEach((element, index) => {
      appendToRecommendationList(element, index);
      showList.push(`card-${index}`);
    });
    showFilteredLists();
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}, 1000);



document.getElementById("checkbox").addEventListener("change", (e) => {
  searchForUser = e.target.checked;
});
function debounce(cb, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
populaterecommendationList();
