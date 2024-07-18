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
}

async function getAllTracks(e) {
    const playListId = playLists[e.target.parentNode.id].playListDetails.id
    window.location.href = `/playlists/playListPage/${playListId}`
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
    workspace.appendChild(playListDiv)
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
    console.log(response.data);
    createPlayListCard(response.data)
}
async function pageConstructor() {
    const allPlayListCards = document.querySelectorAll(".playListCard")
    allPlayListCards.forEach((card)=>{
        const playListDetails = {
            id : card.dataset.playlistid,
            playListName : card.querySelector("h3").innerText,
            thumbNailURL : card.querySelector("img").src
        }
        const obj = new PlayListCard({playListDetails})
        playLists[`playList-${PlayListCard.numberOfPlayLists}`] = obj;
        card.id = `playList-${PlayListCard.numberOfPlayLists}`
    })
    allPlayListCards.forEach(card =>{
        card.querySelector("img").addEventListener("click" ,getAllTracks )
    })
    createPlayListDiv.addEventListener("click", showAddPlatListOptions);
    submitButton.addEventListener("click" , createPlayList)
}

pageConstructor()