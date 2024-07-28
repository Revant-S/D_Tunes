const acceptBtn = document.querySelectorAll(".AcceptFriendRequestBtn");
const rejectBtn = document.querySelectorAll(".RejectFriendRequestBtn");
const removeBtn = document.querySelectorAll(".RemoveFriendRequestBtn");
const RemoveFromFriendBtn = document.querySelectorAll(".RemoveFromFriendBtn");
const acceptMergeRequest = document.querySelectorAll(".acceptMergeRequest");
const profileImage = document.getElementById("profile-image");
const changeProfileImage = document.getElementById("changeProfileImage");
const acceptSyncBtn = document.querySelectorAll(".acceptSyncBtn");
const url = window.location.href;
const publibPlayLists = document.querySelectorAll(".playList")
profileImage.addEventListener("click" , (e)=>{
    changeProfileImage.showModal();
})
function reloadWindow() {
    window.location.href = url
}
console.log(publibPlayLists);



function applyEventListnerToBtns() {
    acceptBtn.forEach(btn =>{
        btn.addEventListener("click" , acceptFriendRequest)
    })    
    rejectBtn.forEach(btn =>{
        btn.addEventListener("click" , rejectFriendRequest)
    })    
    removeBtn.forEach(btn =>{
        btn.addEventListener("click" , removeFriendRequest)
    })    
    RemoveFromFriendBtn.forEach(btn =>{
        btn.addEventListener("click" , removeFromFriend)
    });
    acceptMergeRequest.forEach(btn =>{
        btn.addEventListener("click" , acceptTheMerge)
    }); 
    publibPlayLists.forEach(publibPlayList =>{
        publibPlayList.addEventListener("click" , openThePlayList)
    })
}
applyEventListnerToBtns();

function openThePlayList(e) {
    let target = e.target;
    while (target != null && !target.classList.contains('playList')) {
        target = target.parentElement;
    }
    if (target) {
        const playListId = target.getAttribute("data-playListId");
        window.location.href = `/playlists/playListPage/${playListId}`;
    } else {
        console.log("No playlist item found");
    }

}



async function acceptFriendRequest(e) {
    const UserToAccept = e.target.getAttribute("data-userId");
    const response = await axios.post("http://localhost:5000/user/acceptFriendRequest" , {
        data : {
            acceptedOf : UserToAccept
        }
    })
    e.target.parentNode.parentNode
    reloadWindow()
}
async function rejectFriendRequest(e) {
    const toReject = e.target.getAttribute("data-userId");
    const response = await axios.put("http://localhost:5000/user/rejectFriendRequest" , {
        data : { toReject }
    })
    reloadWindow()
}
async function removeFriendRequest(e) {
    const toRemove = e.target.getAttribute("data-userId");
    const response = await axios.put("http://localhost:5000/user/removeFriendRequest" , {
        data : { toRemove }
    })
    console.log(response);
    reloadWindow()
}
async function removeFromFriend(e) {
    const toRemove = e.target.getAttribute("data-userId");
    const response = await axios.put("http://localhost:5000/user/removeFromFriend" , {
        data : { toRemove }
    })
    console.log(response);
    reloadWindow()
}

async function acceptTheMerge(e) {
    const requestId = e.target.getAttribute("data-requestId");
   try {
    const response = await axios.put("http://localhost:5000/party/respondToRequest",{
        Accepted : true,
        id : requestId
    })
    e.target.parentNode.parentNode.removeChild(e.target.parentNode)
   } catch (error) {
    console.log(error);
    alert("Couldnt accept the request")
   }
}