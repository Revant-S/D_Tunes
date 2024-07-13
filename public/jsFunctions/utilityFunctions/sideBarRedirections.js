document.getElementById("ShowPlayList").addEventListener("click",(e)=>{
    window.location.href = "/playlists/getAllPlayLists"
})

document.getElementById("profile").addEventListener("click",(e)=>{
    console.log("clicked");
    window.location.href = "/user/myprofile"
})

