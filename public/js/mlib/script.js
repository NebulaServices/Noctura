var jsmediatags = window.jsmediatags;
// AUDIO HANDLING 

f.onchange = e => {
  const files = f.files;
  for (let i = 0; i < files.length; i++) {
    if (files[i].type.indexOf('audio/') !== 0) {
      console.warn(`File ${files[i].name} is not an audio file`);
      continue;
    }

    const reader = new FileReader();
    reader.onload = function() {
      const str = this.result;
const fileName = files[i].name.replace(/\s/g, "_").replace(/'/g, "");
      // Get the ID3 data for the song
      getID3Data(str, true, fileName, function(id3Data) {
        // Add the song data and ID3 data to indexedDB
        const openRequest = indexedDB.open("songs_db", 2);
        openRequest.onupgradeneeded = function(event) {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("songs")) {
            db.createObjectStore("songs", { keyPath: "name" });
          }
        };

        openRequest.onsuccess = function(event) {
          const db = event.target.result;
          const transaction = db.transaction(["songs"], "readwrite");
          const objectStore = transaction.objectStore("songs");
          objectStore.add({ name: fileName, data: str, id3Data: id3Data });
          aud = new Audio(str);
          localStorage.setItem("loaded", "1")
        };

        openRequest.onerror = function(event) {
          console.error("IndexedDB error: ", event.target.errorCode);
        };
      });
    };

    reader.readAsDataURL(files[i]);
  }
};

let songs = [];
let aud;
let currentSongIndex = 0;
let isPlaying = false;
var data_streams = localStorage.getItem("data_streams") || 0;
async function playSong(songTitle) {
  const db = await openSongsDB();
  const transaction = db.transaction(["songs"], "readonly");
  const objectStore = transaction.objectStore("songs");
  
  songs = await new Promise((resolve, reject) => {
    const request = objectStore.getAllKeys();
    request.onsuccess = function(event) {
      const keys = event.target.result;
      resolve(keys);
    };
    request.onerror = reject;
  });
  
  currentSongIndex = songs.indexOf(songTitle);
  if (currentSongIndex < 0) {
    console.error(`Song not found: ${songTitle}`);
    return;
  }
  
  const songData = await new Promise((resolve, reject) => {
    const getRequest = objectStore.get(songs[currentSongIndex]);
    getRequest.onsuccess = function(event) {
      const songData = event.target.result.data;
      resolve(songData);
    };
    getRequest.onerror = reject;
  });
  
  // pause the previous audio element before creating a new one
  if (aud) {
    aud.pause();
  }
  
  aud = new Audio(songData);
  isPlaying = !aud.paused;
  aud.play();
   getID3Data(songData);
      progressBar();
      logCurrentTime();
      raiseSidebar();
  
  // Automatically play the next song when this one is done
  aud.addEventListener("ended", function() {
    if (currentSongIndex === songs.length - 1) {
      currentSongIndex = 0;
    } else {
      currentSongIndex += 1;
    }
    playSong(songs[currentSongIndex]);
  });
}

async function openSongsDB() {
  const dbName = "songs_db";
  const dbVersion = 2;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function(event) {
      console.error("IndexedDB error: ", event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = function(event) {
      const db = event.target.result;
      console.log("Database opened successfully");
      resolve(db);
    };
  });
}

document.getElementById("songData").addEventListener("click", function(event) {
  // pause the current audio if it's being played and a different song is clicked
  if (aud && isPlaying) {
    aud.pause();
  }

  // update the current song index based on the song being clicked
  currentSongIndex = songs.indexOf(event.target.innerHTML.replace(" ", "_"));
  playSong(songs[currentSongIndex]);
});


document.getElementById("volumeControl").addEventListener("input", function(event) {
  if (aud) {
    aud.volume = event.target.value;
  }
});
function goBack() {
  if (aud) {
    aud.pause();
  }
  // Decrement the index, wrapping around to the end of the array if necessary
  currentSongIndex = (currentSongIndex + songs.length - 1) % songs.length;
  playSong(songs[currentSongIndex]);
}

function goForward() {
  if (aud) {
    aud.pause();
  }
  // Increment the index, wrapping around to the beginning of the array if necessary
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(songs[currentSongIndex]);
}


function pausePlay() {
let pause = document.getElementById("pause");

  // updated the isPlaying flag based on the state of audio
  if (aud && !aud.paused) {
    aud.pause();
    isPlaying = false;
  } else if (aud) {
    aud.play();
    isPlaying = true;
  }

}

function mutePlay() {
let mute = document.getElementById("mute");
let muted = document.getElementById("muted");

  if (aud && !aud.muted) {
    aud.muted = true;
    muted.style.display = "block";
    mute.style.display = "none";
  }
}

function unmutePlay() {
  if (aud && aud.muted) {
    aud.muted = false;
    mute.style.display = "block";
    muted.style.display = "none";
  }
}


function progressBar() {
  if (!isPlaying) {
    setInterval(function() {
      const currentTime = aud.currentTime;
      const duration = aud.duration;
      const progress = (currentTime / duration) * 100;
      document.getElementById("progressBar").style.width = `${progress}%`;
    }, 1000); // update the progress bar every 1000 milliseconds (1 second)
  }
}

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}

function logCurrentTime() {
  let timeDiv = document.getElementById("currentTime");
  setInterval(function() {
    const currentTime = aud.currentTime;
    const duration = aud.duration;
    const elapsedMinutes = Math.floor(currentTime / 60);
    const elapsedSeconds = Math.floor(currentTime % 60);
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);
    const timeString = `${elapsedMinutes.toString().padStart(2, '0')}:${elapsedSeconds.toString().padStart(2, '0')}/` +
                       `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
    timeDiv.innerHTML = timeString;
  }, 1000); // update the log every 1000 milliseconds (1 second)
}


function clearDatabase() {
  const openRequest = indexedDB.open("songs_db", 2);
  openRequest.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(["songs"], "readwrite");
    const objectStore = transaction.objectStore("songs");
    const objectStoreRequest = objectStore.clear();

    objectStoreRequest.onsuccess = function(event) {
      console.log("Successfully cleared the object store.");
    };

    objectStoreRequest.onerror = function(event) {
      console.error("Failed to clear the object store: ", event.target.errorCode);
    };
  };
  localStorage.setItem("loaded", "0");
  openRequest.onerror = function(event) {
    console.error("IndexedDB error: ", event.target.errorCode);
  };
}

function clearStreams() {
  localStorage.setItem("data_streams", 0);
}


function getID3Data(songData, isUpload, fileName) {
  try {
    let x = dataURItoBlob(songData);
    jsmediatags.read(x, {
      onSuccess: function(tag) {
        console.log(tag);
        let title = tag.tags.title ? tag.tags.title.replace(/'/g, '') : fileName.replace(/'/g, '');
        let artist = tag.tags.artist ? tag.tags.artist.replace(/'/g, '') : "";
        let album = tag.tags.album ? tag.tags.album.replace(/'/g, '') : "";
        let year = tag.tags.year || "";
        let picture = tag.tags.picture;
        let trackNum = tag.tags.track || "";

        let imageStr = null;
        if (picture) {
          let base64String = "";
          for (let i = 0; i < picture.data.length; i++) {
            base64String += String.fromCharCode(picture.data[i]);
          }
          let base64 = "data:" + picture.format + ";base64," +
            window.btoa(base64String);
          imageStr = base64;
        } else {
          imageStr = "/mlib/default.jpg";
        }

        if (isUpload) {
          const openRequest = indexedDB.open("songs_db", 2);
          openRequest.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("songs")) {
              db.createObjectStore("songs", { keyPath: "name" });
            }
          };

          openRequest.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(["songs"], "readwrite");
            const objectStore = transaction.objectStore("songs");
            objectStore.add({ name: title, artist: artist, album: album, year: year, data: songData, image: imageStr, filename: fileName, track: trackNum });
            localStorage.setItem("loaded", "1")
          };

          openRequest.onerror = function(event) {
            console.error("IndexedDB error: ", event.target.errorCode);
          };
        }

        let songTitle = document.getElementById("songTitle");
        if (title === null || title === undefined || title === "") {
          title = fileName;
          localStorage.setItem("songTitle", title);
        } else {
          songTitle.innerHTML = title;
          localStorage.setItem("songTitle", title);
        }
        let songArtist = document.getElementById("songArtist");
        if (artist === null || artist === undefined || artist === "") {
          artist = "Unknown Artist";
          localStorage.setItem("songArtist", artist);
        } else {
          songArtist.innerHTML = artist;
          localStorage.setItem("songArtist", artist);
        }

        let songAlbum;
        if (album === null || album === undefined || album === "") {
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
        autoSetXenBg();
        autoSendNoti();
        if (!isUpload) {
          let duration = aud.duration;
        }
      },
      onError: function(error) {
        console.log(":(", error.type, error.info);
        let title = tag.tags.title ? tag.tags.title.replace(/'/g, '') : fileName.replace(/'/g, '');
        let artist = tag.tags.artist ? tag.tags.artist.replace(/'/g, '') : "";
        let album = tag.tags.album ? tag.tags.album.replace(/'/g, '') : "";
        let year = "" || "Unknown Year";
        let imageStr = "assets/defaultSong.jpg";
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
      openRequest.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("songs")) {
          db.createObjectStore("songs", { keyPath: "name" });
        }
      };

      openRequest.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["songs"], "readwrite");
        const objectStore = transaction.objectStore("songs");
        objectStore.add({ name: title, artist: artist, album: album, year: year, data: songData, image: imageStr, filename: fileName, track: trackNum });
        localStorage.setItem("loaded", "1")
      };
    }
  }
    });

}catch (e) {
  console.log(e);
}
}


function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

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


function padTime(num) {
  return (num < 10) ? "0" + num : num;
}

// format time in seconds to mm:ss format
function formatTime(time) {
  if (typeof time !== 'number') {
    return '--:--';
  }

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  if (hours > 0) {
    return `${hours}:${padTime(minutes)}:${padTime(seconds)}`;
  } else {
    return `${minutes}:${padTime(seconds)}`;
  }
}

function formatMs(time) {
  const minutes = Math.floor(time / 60000);
  const seconds = ((time % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function showDevTools() {
let devTools = document.getElementById("devTools");

if (devTools.style.display === "block") {
  devTools.style.display = "none";
} else {
  devTools.style.display = "block";
}
}