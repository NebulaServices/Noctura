function ab_cloak() {
    if (typeof document !== 'undefined') {
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
    };
};

function SubmitTitle() {
    if (typeof document !== 'undefined') {
        var title = document.getElementById("TitleInput").value;
        document.title = title;
        localStorage.setItem('savedTitle', title);
    }
};

function SetFavicon() {
    var initurl = document.getElementById("FaviconInput").value;
    
    var url = '/~/uv/' + encodeURIComponent(initurl);
    
    fetch(url)
      .then(response => response.text())
      .then(html => {
        var faviconPath = getFaviconPath(html);
        var faviconLink = document.querySelector('link[rel="icon"]');
        faviconLink.href = url;
        localStorage.setItem('savedFavicon', url);
        console.log('Favicon set:', url);
      })
      .catch(error => {
        console.error('Error fetching URL:', error);
      });
}

const abCloak = document.querySelector(".ab")

abCloak.onclick = ab_cloak;
