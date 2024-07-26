const playlistSelect1 = document.getElementById('playlist-select-1');
const playlistSelect2 = document.getElementById('playlist-select-2');
const createPartyPlaylistBtn = document.getElementById('create-party-playlist');
const partyPlaylistResult = document.getElementById('party-playlist-result');
const playListStack = document.querySelector(".playList-stack");
const playListSelector = document.getElementById("playlist-select-1")
const addBtn = document.getElementById("Add-playlist");
let selectedPlayList = null
let playListArray = [];
function stackElementGenerate({name, id }) {
    const stackDiv = document.createElement("div");
    stackDiv.classList.add("stackDiv");
    const removeBtn = document.createElement("button");
    const h2 = document.createElement("h2")
    h2.innerText = name;
    removeBtn.innerText = "remove"
    removeBtn.id = "removeBtn";
    removeBtn.addEventListener("click" , removeFromTheStack)
    stackDiv.appendChild(h2);
    stackDiv.appendChild(removeBtn);
    stackDiv.id = id ;
    playListStack.appendChild(stackDiv)
}
function removeFromTheStack(e) {
    const option = document.createElement("option")
    option.value = e.target.id;
    option.textContent = e.target.parentNode.innerText
    playListSelector.appendChild(option);
    const p = playListArray.filter(playList => playList.id === e.target.id);
    playListArray.splice(playListArray.indexOf(p) , 1);
    e.target.parentNode.parentNode.removeChild(e.target.parentNode)
}
function moveToPlayListStack() {
    if (!selectedPlayList) return;
    addBtn.disabled = true;
    playListSelector.removeChild(playListSelector.options[selectedPlayList.optionIndex])
    stackElementGenerate({name :selectedPlayList.name , id :selectedPlayList.id})
    playListArray.push(selectedPlayList)
}
function showAddOption(e) {
    addBtn.disabled = false;
    const selectedIndex = e.target.selectedIndex;
    e.target.options[selectedIndex].classList.add("HighList-Option");
    selectedPlayList = {
        optionIndex : selectedIndex,
        name :  e.target.options[selectedIndex].textContent.trim(),
        id : e.target.options[selectedIndex].value
    }
}
let partyPlayListId = null
let wantToSave = false;
function partyPlaySong() {
    window.location.href = `/playlists/playPartyMode?id=${partyPlayListId}&&save=${wantToSave}`
}


const confirmationDiaglog = document.getElementById("confirmationDiaglog")
const PartyPlayBtn = document.querySelector(".PartyPlayBtn");
PartyPlayBtn.addEventListener("click" , partyPlaySong)

async function createPlayList() {
    const playListToSupply = [];
    playListArray.forEach((playList)=> playListToSupply.push(playList.id));
    const response = await axios.post("http://localhost:5000/playLists/tempPlayList" , {
        data : {
            playLists : playListToSupply
        }
    })
    partyPlayListId = response.data.newPlayListId
    confirmationDiaglog.showModal()
}
playListSelector.addEventListener("change" , showAddOption)
createPartyPlaylistBtn.addEventListener("click" , createPlayList)
addBtn.addEventListener("click" , moveToPlayListStack)