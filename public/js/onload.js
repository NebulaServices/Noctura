function faviconLoad() {
    var faviconPath = localStorage.getItem('savedFavicon');
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

function titleLoad() {
    var title = localStorage.getItem('savedTitle');
    document.title = title;
};

faviconLoad();
titleLoad();