const uploadSongBtn = document.getElementById("uploadSong");
const editProfileBtn = document.getElementById("Edit-Profile");
const audioPlayer = document.getElementById("audioPlayer");
const songs = document.querySelectorAll(".song");
let currentlyPlaying = null;

function uploadNewSong() {
    window.location.href = "/artist/uploadnewsong";
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

songs.forEach((song, index) => {
    const playPauseBtn = song.querySelector(".playPauseBtn");
    const progressBar = song.querySelector(".progress-bar");
    const progressTime = song.querySelector(".progress-time");
    
    playPauseBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        const songUrl = song.dataset.songUrl;

        if (currentlyPlaying === index) {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.textContent = "Pause";
            } else {
                audioPlayer.pause();
                playPauseBtn.textContent = "Play";
            }
        } else {
            if (currentlyPlaying !== null) {
                const previousSong = songs[currentlyPlaying];
                previousSong.querySelector(".playPauseBtn").textContent = "Play";
                previousSong.classList.remove('playing');
            }
            audioPlayer.src = songUrl;
            audioPlayer.play();
            playPauseBtn.textContent = "Pause";
            song.classList.add('playing');
            currentlyPlaying = index;
        }
    });

    progressBar.addEventListener("input", function() {
        if (currentlyPlaying === index) {
            const seekTime = audioPlayer.duration * (progressBar.value / 100);
            audioPlayer.currentTime = seekTime;
        }
    });
});

audioPlayer.addEventListener("timeupdate", function() {
    if (currentlyPlaying !== null) {
        const song = songs[currentlyPlaying];
        const progressBar = song.querySelector(".progress-bar");
        const progressTime = song.querySelector(".progress-time");
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
        progressTime.textContent = `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;
    }
});

audioPlayer.addEventListener("ended", function () {
    if (currentlyPlaying !== null) {
        const song = songs[currentlyPlaying];
        song.querySelector(".playPauseBtn").textContent = "Play";
        song.classList.remove('playing');
        song.querySelector(".progress-bar").value = 0;
        song.querySelector(".progress-time").textContent = "0:00 / 0:00";
        currentlyPlaying = null;
    }
});

uploadSongBtn.addEventListener("click", uploadNewSong);
