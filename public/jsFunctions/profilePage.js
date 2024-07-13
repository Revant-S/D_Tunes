const acceptBtn = document.querySelectorAll(".AcceptFriendRequestBtn");
const rejectBtn = document.querySelectorAll(".RejectFriendRequestBtn");
const removeBtn = document.querySelectorAll(".RemoveFriendRequestBtn");
const RemoveFromFriendBtn = document.querySelectorAll(".RemoveFromFriendBtn");
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
    })    
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
    alert(response.data)
}
async function rejectFriendRequest(e) {
    const toReject = e.target.getAttribute("data-userId");
    const response = await axios.put("http://localhost:5000/user/rejectFriendRequest" , {
        data : { toReject }
    })
    alert(response.data);
}
async function removeFriendRequest(e) {
    const toRemove = e.target.getAttribute("data-userId");
    const response = await axios.put("http://localhost:5000/user/removeFriendRequest" , {
        data : { toRemove }
    })
    console.log(response);
    alert(response.data);
}
async function removeFromFriend(e) {
    const toRemove = e.target.getAttribute("data-userId");
    const response = await axios.put("http://localhost:5000/user/removeFromFriend" , {
        data : { toRemove }
    })
    console.log(response);
    alert(response.data);
}