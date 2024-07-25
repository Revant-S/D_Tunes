const acceptBtn = document.querySelectorAll(".AcceptFriendRequestBtn");
const rejectBtn = document.querySelectorAll(".RejectFriendRequestBtn");
const removeBtn = document.querySelectorAll(".RemoveFriendRequestBtn");
const RemoveFromFriendBtn = document.querySelectorAll(".RemoveFromFriendBtn");
const acceptMergeRequest = document.querySelectorAll(".acceptMergeRequest");
const profileImage = document.getElementById("profile-image");
const changeProfileImage = document.getElementById("changeProfileImage");
const acceptSyncBtn = document.querySelectorAll(".acceptSyncBtn");
const url = window.location.href;
profileImage.addEventListener("click" , (e)=>{
    changeProfileImage.showModal();
})
function reloadWindow() {
    window.location.href = url
}




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
}
applyEventListnerToBtns();

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
    const response = await axios.put("http://localhost:5000/party/respondToRequest",{
        Accepted : true,
        id : requestId
    })
}