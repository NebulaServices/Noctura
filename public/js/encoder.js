// Rammerhead Handler
const mod = (n, m) => ((n % m) + m) % m;
const baseDictionary =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~-";
const shuffledIndicator = "_rhs";

const generateDictionary = function () {
  let str = "";
  let split = baseDictionary.split("");
  while (split.length > 0) {
    str += split.splice(Math.floor(Math.random() * split.length), 1)[0];
  }
  return str;
};

class StrShuffler {
  constructor(dictionary = generateDictionary()) {
    this.dictionary = dictionary;
  }
  shuffle(str) {
    if (str.startsWith(shuffledIndicator)) {
      return str;
    }
    let shuffledStr = "";
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      const idx = baseDictionary.indexOf(char);
      if (char === "%" && str.length - i >= 3) {
        shuffledStr += char;
        shuffledStr += str.charAt(++i);
        shuffledStr += str.charAt(++i);
      } else if (idx === -1) {
        shuffledStr += char;
      } else {
        shuffledStr += this.dictionary.charAt(
          mod(idx + i, baseDictionary.length)
        );
      }
    }
    return shuffledIndicator + shuffledStr;
  }
  unshuffle(str) {
    if (!str.startsWith(shuffledIndicator)) {
      return str;
    }

    str = str.slice(shuffledIndicator.length);

    let unshuffledStr = "";
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      const idx = this.dictionary.indexOf(char);
      if (char === "%" && str.length - i >= 3) {
        unshuffledStr += char;
        unshuffledStr += str.charAt(++i);
        unshuffledStr += str.charAt(++i);
      } else if (idx === -1) {
        unshuffledStr += char;
      } else {
        unshuffledStr += baseDictionary.charAt(
          mod(idx - i, baseDictionary.length)
        );
      }
    }
    return unshuffledStr;
  }
}

function setError(err) {
  console.log(err);
}

function getPassword() {
  var element = document.getElementById("session-password");
  return element ? element.value : "";
}

function get(url, callback, shush = false) {
  var pwd = getPassword();
  if (pwd) {
    // really cheap way of adding a query parameter
    if (url.includes("?")) {
      url += "&pwd=" + pwd;
    } else {
      url += "?pwd=" + pwd;
    }
  }

  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.send();

  request.onerror = function () {
    if (!shush) setError("Cannot communicate with the server");
  };
  request.onload = function () {
    if (request.status === 200) {
      callback(request.responseText);
    } else {
      if (!shush)
        setError(
          'unexpected server response to not match "200". Server says "' +
            request.responseText +
            '"'
        );
    }
  };
}

var api = {
  needpassword(callback) {
    get("/needpassword", (value) => callback(value === "true"));
  },
  newsession(callback) {
    get("/newsession", callback);
  },
  editsession(id, httpProxy, enableShuffling, callback) {
    get(
      "/editsession?id=" +
        encodeURIComponent(id) +
        (httpProxy ? "&httpProxy=" + encodeURIComponent(httpProxy) : "") +
        "&enableShuffling=" +
        (enableShuffling ? "1" : "0"),
      function (res) {
        if (res !== "Success")
          return setError("unexpected response from server. received " + res);
        callback();
      }
    );
  },
  sessionexists(id, callback) {
    get("/sessionexists?id=" + encodeURIComponent(id), function (res) {
      if (res === "exists") return callback(true);
      if (res === "not found") return callback(false);
      setError("unexpected response from server. received" + res);
    });
  },
  deletesession(id, callback) {
    api.sessionexists(id, function (exists) {
      if (exists) {
        get("/deletesession?id=" + id, function (res) {
          if (res !== "Success" && res !== "not found")
            return setError("unexpected response from server. received " + res);
          callback();
        });
      } else {
        callback();
      }
    });
  },
  shuffleDict(id, callback) {
    get("/api/shuffleDict?id=" + encodeURIComponent(id), function (res) {
      callback(JSON.parse(res));
    });
  }
};

var localStorageKey = "rammerhead_sessionids";
var localStorageKeyDefault = "rammerhead_default_sessionid";

var sessionIdsStore = {
  get() {
    var rawData = localStorage.getItem(localStorageKey);
    if (!rawData) return [];
    try {
      var data = JSON.parse(rawData);
      if (!Array.isArray(data)) throw "getout";
      return data;
    } catch (e) {
      return [];
    }
  },
  set(data) {
    if (!data || !Array.isArray(data)) throw new TypeError("must be array");
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  },
  getDefault() {
    var sessionId = localStorage.getItem(localStorageKeyDefault);
    if (sessionId) {
      var data = sessionIdsStore.get();
      data.filter(function (e) {
        return e.id === sessionId;
      });
      if (data.length) return data[0];
    }
    return null;
  },
  setDefault(id) {
    localStorage.setItem(localStorageKeyDefault, id);
  }
};

function loadSessions() {
  var sessions = sessionIdsStore.get();
  var defaultSession = sessionIdsStore.getDefault();
}

function addSession(id) {
  var data = sessionIdsStore.get();
  data.unshift({ id: id, createdOn: new Date().toLocaleString() });
  sessionIdsStore.set(data);
}

function editSession(id, httpproxy, enableShuffling) {
  var data = sessionIdsStore.get();
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      data[i].httpproxy = httpproxy;
      data[i].enableShuffling = enableShuffling;
      sessionIdsStore.set(data);
      return;
    }
  }
  throw new TypeError("cannot find " + id);
}

window.addEventListener("load", function () {
  loadSessions();

  var sessionString = localStorage.getItem("session-string");

  if (!sessionString) {
    setError();
    api.newsession(function (id) {
      addSession(id); //Generate it
      localStorage.setItem("session-string", id); // Set localstorage
      console.log(`New rammerhead session made with session ID ${id}`);
    });
  }

  function isUrl(val = "") {
    if (
      /^http(s?):\/\//.test(val) ||
      (val.includes(".") && val.substr(0, 1) !== " ")
    )
      return true;
    return false;
  }
  function go() {
    setError();
    var id = localStorage.getItem("session-string");
    var httpproxy = "";
    var enableShuffling = true;
    var url =
      document.getElementById("home-input").value || "https://www.google.com/";
    if (!id) return setError("must generate a session id first");
    api.sessionexists(id, function (value) {
      if (!value)
        return setError(
          "session does not exist. try deleting or generating a new session"
        );
      api.editsession(id, httpproxy, enableShuffling, function () {
        editSession(id, httpproxy, enableShuffling);
        api.shuffleDict(id, function (shuffleDict) {
          let iframe = document.querySelector(".proxy-iframe");
          if (!iframe) {
            console.log("[ERROR] iframe not found! Try reloading.");
          }
          if (!isUrl(url)) {
            url = (
              localStorage.getItem("search-engine") ||
              "https://www.google.com/search?q=%s"
            ).replace("%s", encodeURIComponent(url));
          }
          if (!shuffleDict) {
            iframe.src = "/" + id + "/" + url;
          } else {
            var shuffler = new StrShuffler(shuffleDict);
            iframe.src = "/" + id + "/" + shuffler.shuffle(url);
          }
        });
      });
    });
  }

  document.getElementById("home-input").addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      Cookies.get("astro-proxy").toLowerCase() == "rammerhead"
    ) {
      go();
    }
  });
});
