const url = window.location.href;
function reloadWindow() {
  window.location.href = url;
}


document.querySelector(".remove-friend-Request-Btn").addEventListener("click", async (e)=>{
  let target = e.target;
  const userId = target.getAttribute("data-userId");
 try {
  const response  = await axios.put("http://localhost:5000/user/removeFriendRequest" , {
    data : {
      toRemove : userId
    }
  })
  window.location.reload();
 } catch (error ) {
  console.log(error.message);
 }
  

})
document.querySelectorAll(".firend").forEach(friend =>{
  console.log('here');
  friend.addEventListener("click", (e)=>{
    let target = e.target;
    while(target != null && !target.classList.contains('firend')){
      target= target.parentNode;
    }
    const email = target.getAttribute("data-friendEmail");
    console.log(email);
    window.location.href = `/user/viewProfile/${email}`
  })
})





let friendRequestSent = false;
async function sendFriendRequest(e) {
  const userId = e.target.getAttribute("data-userId");
  const response = await axios.post(
    "http://localhost:5000/user/sendfriendRequest",
    {
      data: {
        recipient: userId,
      },
    }
  );
  document
    .getElementById("friend-request-btn")
    .parentNode.removeChild(document.getElementById("friend-request-btn"));
  alert(response.data.msg);
}
if (document.getElementById("friend-request-btn")) {
  document
    .getElementById("friend-request-btn")
    .addEventListener("click", sendFriendRequest);
}
const requestMergeBtn = document.querySelector(".requestBtn");
async function requestMerge(e) {
  try {
    await axios.post("http://localhost:5000/party/requestPlayList", {
      playListRequestedFor: e.target.parentNode
        .querySelector("h2")
        .getAttribute("data-id"),
    });
    alert("Request Made");
    requestMergeBtn.textContent = "Remove Request";
  } catch (error) {
    alert("CouldNot Make The Request");
    console.log(error);
  }
}

if (requestMergeBtn) {
  requestMergeBtn.addEventListener("click", requestMerge);
}
