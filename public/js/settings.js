function ab_cloakReal() {
  if (typeof document !== "undefined") {
    var iframe = document.createElement("iframe");
    iframe.src = window.location.href;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";

    var newWindow = window.open("about:blank", "_blank");
    newWindow.document.body.appendChild(iframe);
    newWindow.document.body.style.width = "100%";
    newWindow.document.body.style.height = "100%";
    newWindow.document.body.style.margin = "0";
    newWindow.document.body.style.padding = "0";
  }
}

function SubmitTitle() {
  if (typeof document !== "undefined") {
    var title = document.getElementById("TitleInput").value;
    document.title = title;
    localStorage.setItem("savedTitle", title);
  }
}

function SetFavicon() {
  var initurl = document.getElementById("FaviconInput").value;

  var url = "/~/uv/" + encodeURIComponent(initurl);

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      var faviconLink = document.querySelector('link[rel="icon"]');
      faviconLink.href = url;
      localStorage.setItem("savedFavicon", url);
      console.log("Favicon set:", url);
    })
    .catch((error) => {
      console.error("Error fetching URL:", error);
    });
}

function TitlePreset(title) {
  if (typeof document !== "undefined") {
    document.title = title;
    localStorage.setItem("savedTitle", title);
  }
}

function FaviconPreset(url) {
  var encodedUrl = "/~/uv/" + encodeURIComponent(url);

  fetch(encodedUrl)
    .then((response) => response.text())
    .then((html) => {
      var faviconLink = document.querySelector('link[rel="icon"]');
      faviconLink.href = encodedUrl;
      localStorage.setItem("savedFavicon", encodedUrl);
      console.log("Favicon set:", encodedUrl);
    })
    .catch((error) => {
      console.error("Error fetching URL:", error);
    });
}

function Preset(temp) {
  if (temp == "default") {
    localStorage.removeItem("savedFavicon");
    localStorage.removeItem("savedTitle");
    var faviconLink = document.querySelector('link[rel="icon"]');
    faviconLink.href = "/favicon.svg";
    document.title = "Noctura";
  }

  if (temp == "googleclassroom") {
    TitlePreset("Google Classroom");
    FaviconPreset(
      "https://ssl.gstatic.com/classroom/ic_product_classroom_32.png"
    );
  }

  if (temp == "google") {
    TitlePreset("Google");
    FaviconPreset("https://www.google.com/favicon.ico");
  }

  if (temp == "googledrive") {
    TitlePreset("Google Drvie");
    FaviconPreset(
      "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png"
    );
  }

  if (temp == "edpuzzle") {
    TitlePreset("Edpuzzle");
    FaviconPreset("https://edpuzzle.imgix.net/favicons/favicon-32.png");
  }

  if (temp == "powerschool") {
    TitlePreset("Powerschool");
    FaviconPreset("https://www.powerschool.com/favicon.ico");
  }
}

var abCloakButton = document.querySelector(".ab");

abCloakButton.onclick = ab_cloakReal;
