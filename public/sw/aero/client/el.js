(function() {
  window.__aero$meta = __aero$decodeURL(location.pathname+location.hash+location.search);
  
  function getElementNode(el) {
    if (!(el instanceof Element)) return;

    return el.constructor;
  }
  
  const attrs = {
    href: [HTMLAnchorElement],
    //src: [HTMLScriptElement, HTMLAudioElement, HTMLVideoElement, HTMLSourceElement, HTMLImageElement, HTMLIFrameElement, HTMLInputElement, HTMLEmbedElement, HTMLTrackElement]
  }

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      
      if (mutation.type=='childList') {
        for (var node of mutation.addedNodes) {
          if (node instanceof Element) { 
            var n = getElementNode(node);

            if (!node.getAttribute('aero-core')) {
              if (attrs['href'].includes(n)) {
                node.setAttribute('href', __aero$encodeURL(node.getAttribute('href'), __aero$meta));
              }
            }
          }
        }
      }
    }

    return;
  };
  
  const observer = new MutationObserver(callback);
  
  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
})();