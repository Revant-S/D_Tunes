document.getElementById("ShowPlayList").addEventListener("click", (e) => {
  window.location.href = "/playlists/getAllPlayLists";
});

document.getElementById("profile").addEventListener("click", (e) => {
  window.location.href = "/user/myprofile";
});

document.getElementById("Home").addEventListener("click", (e) => {
  if (window.location.href.includes("/home")) {
    return;
  }
  window.location.href = "/home";
});
document.getElementById("party-Mode").addEventListener("click", (e) => {
  window.location.href = "/playLists/partyMode";
});

document.getElementById("logoutBtn").addEventListener("click", async (e) => {
  console.log("HELLO!!!!!!!!!!");
  await axios.post("/user/logout");
  console.log("YO HELLO");
  location.reload();
});
