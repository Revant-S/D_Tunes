let friendRequestSent= false

async function sendFriendRequest(e) {
    const userId = e.target.getAttribute("data-userId")

    const response = await axios.post("http://localhost:5000/user/sendfriendRequest", {
        data : {
            recipient : userId
        }
    })
    
    alert(response.data.msg)
}





document.getElementById("friend-request-btn").addEventListener("click",sendFriendRequest)