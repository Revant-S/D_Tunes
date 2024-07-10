// const { default: axios } = require("axios");
const createPlayListDiv = document.querySelector(".createPlaylist")
const createPlaylistDivDialog = document.getElementById("createPlayListDialog")
const submitButton = document.getElementById("createPlayListBtn");
const createPlayListForm = document.getElementById("createPlayListForm")
const workspace = document.querySelector(".workspace")
const playListSpace = document.querySelector(".playListSpace")
let playLists = {}
class PlayListCard{
    static numberOfPlayLists = 0
    constructor({playListDetails}){
        this.playListDetails = playListDetails
        PlayListCard.numberOfPlayLists++;
    }
    showAllSongs(){}
}

async function getAllTracks(e) {
    const playListId = playLists[e.target.parentNode.id].playListDetails.id
    const response = await axios.get(`http://localhost:5000/playlists/getPlayList/${playListId}`);
    console.log(response);
}


function createPlayListCard(data) {
    const playListDiv = document.createElement("div")
    playListDiv.classList.add("playListCard")
    const cardObj = new PlayListCard({playListDetails : data})
    playLists[`playList-${PlayListCard.numberOfPlayLists}`] = cardObj;
    playListDiv.id = `playList-${PlayListCard.numberOfPlayLists}`
    const playListImage = document.createElement("img")
    const h3Tag = document.createElement("h3")
    h3Tag.innerText = data.playListName;
    playListDiv.appendChild(h3Tag);
    playListImage.src = data.thumbNailURL;
    playListDiv.appendChild(playListImage)
    playListImage.addEventListener("click" , getAllTracks)
    playListSpace.appendChild(playListDiv)

}

function showAddPlatListOptions(e) {
    createPlaylistDivDialog.showModal()
}



async function createPlayList(event) {
    event.preventDefault();
    const formData = new FormData(createPlayListForm);
    createPlaylistDivDialog.close()
    const response = await axios.post("/playlists/createPlayList", formData , {
        headers : {
            'Content-Type': 'multipart/form-data'
        }
    });
    createPlayListCard(response.data)
}
function pageConstructor() {
    createPlayListDiv.addEventListener("click", showAddPlatListOptions);
    submitButton.addEventListener("click" , createPlayList)
}

pageConstructor()