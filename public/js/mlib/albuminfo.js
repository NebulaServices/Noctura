let albumSongs = [];
let albumSongIndex = 0;
let aud = null;
let isPlaying = false;

function displayAlbumSongs(albumName) {
  const openRequest = indexedDB.open("songs_db", 2);

  openRequest.onupgradeneeded = function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("songs")) {
      db.createObjectStore("songs", { keyPath: "name" });
    }
  };

  openRequest.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["songs"], "readonly");
    const objectStore = transaction.objectStore("songs");

    let albumSort = [];
    const songsDiv = document.getElementById("albumsDivs");
    objectStore.openCursor().onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const song = cursor.value;
        if (song.album === albumName) {
          albumSort.push(song);
        }
        cursor.continue();
      } else {
        if (albumSort.length === 0) {
          songsDiv.textContent = "No songs found in album.";
          return;
        }
        albumSort.sort((a, b) => a.track - b.track); // sort the albumSongs array based on the track number
        albumSort.forEach(function (song, i) {
          song.index = i;
          const songDiv = document.createElement("div");
          songDiv.classList.add("songDiv");
          let songName;
          if (song.name == "Unknown Title") {
            songName = song.filename;
          } else {
            songName = song.name;
          }
          if (song.artist == "Unknown Artist") {
            song.artist = "";
          }
          if (song.album == "Unknown Album") {
            song.album = "";
          }
          if (song.year == "Unknown Year") {
            song.year = "";
          }
          songDiv.innerHTML = `<img class="songImage" src="${
            song.image || "../assets/defaultSong.jpg"
          }" onclick="playAlbumSong('${song.name}'); albumSongIndex = ${i};">
                                        <div class="songTitle">${songName}</div>
                                        <div class="songYear">${
                                          song.year || ""
                                        }</div>`;
          songsDiv.appendChild(songDiv);
        });
      }
    };
  };

  openRequest.onerror = function (event) {
    console.error("IndexedDB error: ", event.target.errorCode);
  };
}

function logAlbumSongs(albumName) {
  const openRequest = indexedDB.open("songs_db", 2);

  openRequest.onupgradeneeded = function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("songs")) {
      db.createObjectStore("songs", { keyPath: "name" });
    }
  };

  openRequest.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["songs"], "readonly");
    const objectStore = transaction.objectStore("songs");

    albumSongs = [];
    const allSongsRequest = objectStore.openCursor();
    allSongsRequest.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const song = cursor.value;
        if (song.album === albumName) {
          albumSongs[song.track - 1] = song.name;
          console.log(`Song added at position ${song.track - 1}: ${song.name}`);
        }
        cursor.continue();
      } else {
        // Remove any empty slots in the array
        const filteredSongs = albumSongs.filter(function (song) {
          return song !== undefined;
        });

        albumSongs.length = 0; // Clear the original array
        albumSongs.push(...filteredSongs); // Add the filtered songs back to the array

        console.log(`Songs in album "${albumName}":`);
        albumSongs.forEach(function (song) {
          console.log(song);
        });
      }
    };
    allSongsRequest.onerror = function (event) {
      console.error("IndexedDB error: ", event.target.errorCode);
    };
  };

  openRequest.onerror = function (event) {
    console.error("IndexedDB error: ", event.target.errorCode);
  };
}

function playAlbumSong(songName) {
  if (aud && !aud.paused) {
    // check if a song is playing and pause it if it is
    aud.pause();
  }
  const openRequest = indexedDB.open("songs_db", 2);

  openRequest.onsuccess = function (event) {
    const db = event.target.result;
    console.log(albumSongs);
    console.log(songName);
    const transaction = db.transaction(["songs"], "readonly");
    const objectStore = transaction.objectStore("songs");
    const getRequest = objectStore.get(songName);
    getRequest.onsuccess = function (event) {
      const songData = event.target.result.data;
      aud = new Audio(songData);
      isPlaying = !aud.paused;
      aud.play();
      getID3Data(songData);
      raiseSidebar();
      aud.addEventListener("ended", playNextSong);
    };
  };
}

function playPreviousSong() {
  if (albumSongIndex > 0) {
    albumSongIndex--;
  } else {
    albumSongIndex = albumSongs.length - 1;
  }
  playAlbumSong(albumSongs[albumSongIndex]);
}

function playNextSong() {
  if (albumSongIndex < albumSongs.length - 1) {
    albumSongIndex++;
  } else {
    albumSongIndex = 0;
  }
  playAlbumSong(albumSongs[albumSongIndex]);
}

const urlParams = new URLSearchParams(window.location.search);
const albumName = urlParams.get("album");
if (albumName) {
  displayAlbumSongs(albumName);
  logAlbumSongs(albumName);
}
document.title = `Album: ${albumName}`;
let pageTitle = document.getElementById("pageTitle");
pageTitle.innerHTML = `Album: ${albumName}`;

// SIDEBAR

function raiseSidebar() {
  let title = document.getElementById("songTitle");
  let artist = document.getElementById("songArtist");
  let picture = document.getElementById("songPhoto");
  let songTitle = localStorage.getItem("songTitle");
  let songArtist = localStorage.getItem("songArtist");
  let songArt = localStorage.getItem("songArt");

  if (songTitle === null) {
    songTitle = "Unknown Title";
  }
  if (songArtist === null) {
    songArtist = "Unknown Artist";
  }
  if (songArt === null) {
  } else {
    title.innerHTML = songTitle;
    artist.innerHTML = songArtist;
    picture.src = songArt;
  }
  progressBar();
  logCurrentTime();
}

function progressBar() {
  if (!isPlaying) {
    setInterval(function () {
      const currentTime = aud.currentTime;
      const duration = aud.duration;
      const progress = (currentTime / duration) * 100;
      document.getElementById("progressBar").style.width = `${progress}%`;
    }, 1000); // update the progress bar every 1000 milliseconds (1 second)
  }
}

function logCurrentTime() {
  let timeDiv = document.getElementById("currentTime");
  setInterval(function () {
    const currentTime = aud.currentTime;
    const duration = aud.duration;
    const elapsedMinutes = Math.floor(currentTime / 60);
    const elapsedSeconds = Math.floor(currentTime % 60);
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);
    const timeString =
      `${elapsedMinutes.toString().padStart(2, "0")}:${elapsedSeconds
        .toString()
        .padStart(2, "0")}/` +
      `${totalMinutes.toString().padStart(2, "0")}:${totalSeconds
        .toString()
        .padStart(2, "0")}`;
    timeDiv.innerHTML = timeString;
  }, 1000); // update the log every 1000 milliseconds (1 second)
}

function pausePlay() {
  // updated the isPlaying flag based on the state of audio
  if (aud && !aud.paused) {
    aud.pause();
    isPlaying = false;
  } else if (aud) {
    aud.play();
    isPlaying = true;
  }
}

function getID3Data(songData, isUpload, fileName) {
  try {
    let x = dataURItoBlob(songData);
    jsmediatags.read(x, {
      onSuccess: function (tag) {
        console.log(tag);
        let title = tag.tags.title || fileName;
        let artist = tag.tags.artist || "";
        let album = tag.tags.album || "";
        let year = tag.tags.year || "";
        let picture = tag.tags.picture;
        let trackNum = tag.tags.track || "";

        let imageStr = null;
        if (picture) {
          let base64String = "";
          for (let i = 0; i < picture.data.length; i++) {
            base64String += String.fromCharCode(picture.data[i]);
          }
          let base64 =
            "data:" + picture.format + ";base64," + window.btoa(base64String);
          imageStr = base64;
        } else {
          imageStr = "../assets/defaultSong.jpg";
        }

        if (isUpload) {
          const openRequest = indexedDB.open("songs_db", 2);
          openRequest.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("songs")) {
              db.createObjectStore("songs", { keyPath: "name" });
            }
          };

          openRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(["songs"], "readwrite");
            const objectStore = transaction.objectStore("songs");
            objectStore.add({
              name: title,
              artist: artist,
              album: album,
              year: year,
              data: songData,
              image: imageStr,
              filename: fileName,
              track: trackNum
            });
            console.log(songData);
            localStorage.setItem("loaded", "1");
          };

          openRequest.onerror = function (event) {
            console.error("IndexedDB error: ", event.target.errorCode);
          };
        }

        let songTitle = document.getElementById("songTitle");
        if (title === null) {
          title = fileName;
          localStorage.setItem("songTitle", title);
        } else if (title === "") {
          title = fileName;
          localStorage.setItem("songTitle", title);
        } else {
          songTitle.innerHTML = title;
          localStorage.setItem("songTitle", title);
        }
        let songArtist = document.getElementById("songArtist");
        if (artist === null) {
          artist = "Unknown Artist";
          localStorage.setItem("songArtist", artist);
        } else if (artist === "") {
          artist = "Unknown Artist";
          localStorage.setItem("songArtist", artist);
        } else {
          songArtist.innerHTML = artist;
          localStorage.setItem("songArtist", artist);
        }

        let songAlbum;
        if (album === null) {
          album = "Unknown Album";
          localStorage.setItem("songAlbum", album);
        } else if (album === "") {
          album = "Unknown Album";
          localStorage.setItem("songAlbum", album);
        } else {
          songAlbum = album;
          localStorage.setItem("songAlbum", album);
        }
        let songPhoto = document.getElementById("songPhoto");
        if (imageStr) {
          songPhoto.src = imageStr;
          localStorage.setItem("songArt", imageStr);
        } else {
          console.log("No picture found.");
        }
        console.log("Title: " + title + ", Artist: " + artist);
        if (!isUpload) {
          let duration = aud.duration;
        }
      },
      onError: function (error) {
        let title = fileName || "Unknown Title";
        let artist = "" || "Unknown Artist";
        let album = "" || "Unknown Album";
        let year = "" || "Unknown Year";
        let imageStr = "../assets/defaultSong.jpg";
        let trackNum = "" || "Unknown Track Number";
        let songTitle = document.getElementById("songTitle");
        songTitle.innerHTML = title;
        localStorage.setItem("songTitle", title);

        let songArtist = document.getElementById("songArtist");
        songArtist.innerHTML = artist;
        localStorage.setItem("songArtist", artist);

        let songAlbum = album;
        localStorage.setItem("songAlbum", album);

        let songPhoto = document.getElementById("songPhoto");
        songPhoto.src = imageStr;
        localStorage.setItem("songArt", imageStr);
        if (isUpload) {
          const openRequest = indexedDB.open("songs_db", 2);
          openRequest.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("songs")) {
              db.createObjectStore("songs", { keyPath: "name" });
            }
          };

          openRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(["songs"], "readwrite");
            const objectStore = transaction.objectStore("songs");
            objectStore.add({
              name: title,
              artist: artist,
              album: album,
              year: year,
              data: songData,
              image: imageStr,
              filename: fileName,
              track: trackNum
            });
            console.log(songData);
            localStorage.setItem("loaded", "1");
          };
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}
