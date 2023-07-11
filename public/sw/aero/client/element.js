(function() {
  
  function getElementNode(el) {
    if (!(el instanceof Element)) return;

    return el.constructor;
  }
  
  const attrs = {
    href: [HTMLAnchorElement, HTMLLinkElement, HTMLBaseElement, HTMLAreaElement],
    src: [HTMLScriptElement, HTMLAudioElement, HTMLVideoElement, HTMLSourceElement, HTMLImageElement, HTMLIFrameElement, HTMLInputElement, HTMLEmbedElement, HTMLTrackElement],
  	action: [HTMLFormElement],
  }

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      /*
      if (mutation.type=='childList') {
        for (var node of mutation.addedNodes) {
          if (node instanceof Element) { 
            var n = getElementNode(node);
            if (attrs['href'].includes(n)) {
              if (node.getAttribute('href')&&!(node.getAttribute('aero-core'))) node.href = __aero$encodeURL(node.getAttribute('href'), __aero$meta);
            }
  
            if (attrs['src'].includes(n)) {
              if (node.getAttribute('src')&&!(node.getAttribute('aero-core'))) node.src = __aero$encodeURL(node.getAttribute('src'), __aero$meta);
            }
          }
        }
      }*/

      if (mutation.type=='attributes') {
        console.log(mutation)
        if (attrs[mutation.attributeName]) {
          mutation.target.setAttribute(mutation.attributeName, __aero$encodeURL(mutation.target.getAttribute(mutation.attributeName), __aero$meta));
        }
      }
    }

    return;
  };
  
  const observer = new ResizeObserver(callback);
  
  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
})();