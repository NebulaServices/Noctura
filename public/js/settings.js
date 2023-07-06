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

function favicon_cloak() {
    var initurl = prompt('Enter a URL: ', '');
    
    if (!initurl.startsWith('http://') && !initurl.startsWith('https://')) {
      initurl = 'https://' + initurl;
    }
    
    var url = '/~/uv/' + encodeURIComponent(initurl);
    
    fetch(url)
      .then(response => response.text())
      .then(html => {
        var faviconPath = getFaviconPath(html);
        console.log('Favicon path:', faviconPath);
        setFavicon(faviconPath);
      })
      .catch(error => {
        console.error('Error fetching URL:', error);
      });
  }
  
  
function getFaviconPath(html) {
    var regex = /<link.*?rel=["'](?:shortcut )?icon["'].*?href=["'](.*?)["'].*?>/i;
    var match = regex.exec(html);
    return match ? match[1] : null;
}

function setFavicon(faviconPath1) {
    var faviconPath = '/~/uv/' + encodeURIComponent('https://' + faviconPath1);
    var faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = faviconPath;
    localStorage.setItem('savedFavicon', faviconPath);
    console.log('Favicon set:', faviconPath);
}

const abCloak = document.querySelector(".ab")
const titleCloak = document.querySelector(".title")
const faviconCloak = document.querySelector(".faviconc")

abCloak.onclick = ab_cloak;
titleCloak.onclick = title_cloak;
faviconCloak.onclick = favicon_cloak;