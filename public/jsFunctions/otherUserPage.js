const url = window.location.href;
function reloadWindow() {
  window.location.href = url;
}
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
