const wrapper = document.querySelector(".wrapper"),
  musicName = wrapper.querySelector(".name"),
  musicArtist = wrapper.querySelector(".artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  repeatBtn = wrapper.querySelector("#repeat-plist"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  mainAudio = wrapper.querySelector("#main-audio"),
  musicImg = document.querySelector(".img-area img"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = wrapper.querySelector("#close"),
  volumeSlider = document.getElementById("volume-slider");

let musicIndex = 1;
let repeatMode = "repeat";

function loadMusic(index) {
  const song = allMusic[index - 1];
  musicName.innerText = song.name;
  musicArtist.innerText = song.artist;
  mainAudio.src = `http://localhost:3000/songs/${song.src}.mp3`;
  musicImg.src = `images/${song.img}.jpg`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

playPauseBtn.addEventListener("click", () => {
  const isPlaying = wrapper.classList.contains("paused");
  isPlaying ? pauseMusic() : playMusic();
});

prevBtn.addEventListener("click", () => {
  musicIndex = musicIndex === 1 ? allMusic.length : musicIndex - 1;
  loadMusic(musicIndex);
  playMusic();
});

nextBtn.addEventListener("click", () => {
  playNext();
});

function playNext() {
  if (repeatMode === "shuffle") {
    let randIndex;
    do {
      randIndex = Math.floor(Math.random() * allMusic.length) + 1;
    } while (randIndex === musicIndex);
    musicIndex = randIndex;
  } else {
    musicIndex = musicIndex === allMusic.length ? 1 : musicIndex + 1;
  }
  loadMusic(musicIndex);
  playMusic();
}

mainAudio.addEventListener("ended", () => {
  if (repeatMode === "repeat") {
    playNext();
  } else if (repeatMode === "repeat_one") {
    mainAudio.currentTime = 0;
    mainAudio.play();
  } else if (repeatMode === "shuffle") {
    playNext();
  }
});

repeatBtn.addEventListener("click", () => {
  if (repeatMode === "repeat") {
    repeatMode = "repeat_one";
    repeatBtn.innerText = "repeat_one";
    repeatBtn.title = "Repeat current song";
  } else if (repeatMode === "repeat_one") {
    repeatMode = "shuffle";
    repeatBtn.innerText = "shuffle";
    repeatBtn.title = "Shuffle";
  } else {
    repeatMode = "repeat";
    repeatBtn.innerText = "repeat";
    repeatBtn.title = "Playlist looped";
  }
});

mainAudio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = mainAudio;
  let percent = (currentTime / duration) * 100;
  progressBar.style.width = `${percent}%`;

  wrapper.querySelector(".current-time").innerText = formatTime(currentTime);
  wrapper.querySelector(".max-duration").innerText = formatTime(duration);
});

progressArea.addEventListener("click", (e) => {
  let width = progressArea.clientWidth;
  let clickX = e.offsetX;
  mainAudio.currentTime = (clickX / width) * mainAudio.duration;
});

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  if (seconds < 10) seconds = "0" + seconds;
  return `${minutes}:${seconds}`;
}

volumeSlider.addEventListener("input", () => {
  mainAudio.volume = volumeSlider.value;
});

window.addEventListener("load", () => {
  loadMusic(musicIndex);
});

const ulTag = wrapper.querySelector(".music-list ul");
allMusic.forEach((song, i) => {
  let li = document.createElement("li");
  li.innerHTML = `
    <div class="row">
      <span>${song.name}</span>
      <p>${song.artist}</p>
    </div>
    <audio src="http://localhost:3000/songs/${song.src}.mp3"></audio>
  `;
  li.setAttribute("data-index", i + 1);
  li.onclick = () => {
    musicIndex = i + 1;
    loadMusic(musicIndex);
    playMusic();
    musicList.classList.remove("show");
  };
  ulTag.appendChild(li);
});

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
  musicList.classList.remove("show");
});
