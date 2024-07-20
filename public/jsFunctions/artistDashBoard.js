const uploadSongBtn = document.getElementById("uploadSong")
const editProfileBtn = document.getElementById("Edit-Profile");

function uploadNewSong() {
    window.location.href = "/artist/uploadnewsong"
}




uploadSongBtn.addEventListener("click" , uploadNewSong);

