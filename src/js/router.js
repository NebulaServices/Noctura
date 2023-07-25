class Router {
  constructor() {
    document.addEventListener("click", (e) => this.#handleClick(e));
    window.addEventListener("popstate", (e) => this.#handlePopstate(e));
    this.prefetched = new Set();
    this.#prefetch();
  }

  go(href) {
    this.#replaceBody(href);
  }

  async #replaceBody(href, popstate = false) {
    const parser = new DOMParser();
    const prev = location.href;
    const next = new URL(href, location.origin).href;
    if (prev === next && !popstate) {
      return;
    }
    if (
      !popstate &&
      (!window.history.state || window.history.state.url !== next)
    ) {
      window.history.pushState({ next }, "internalLink", next);
    }

    window.dispatchEvent(new CustomEvent("router:begin"));

    const doc = await fetch(next)
      .then((res) => res.text())
      .then((text) => parser.parseFromString(text, "text/html"));

    if (doc.title) document.title = doc.title;

    const selector =
      "main.layout > div:not(.toast-container, .header, .top-banner, .footer)";

    document.body
      .querySelector(selector)
      .replaceWith(doc.body.querySelector(selector));
    this.#mergeHead(doc);
    this.#runScripts();
    window.dispatchEvent(new CustomEvent("router:end"));
  }

  #mergeHead(doc) {
    const getValidNodes = (doc) =>
      Array.from(
        doc.querySelectorAll('head>:not([rel="prefetch"], [data-cold])')
      );
    const oldNodes = getValidNodes(document);
    const newNodes = getValidNodes(doc);

    const { staleNodes, freshNodes } = this.#partitionNodes(oldNodes, newNodes);

    staleNodes.forEach((node) => node.remove());

    document.head.append(...freshNodes);
  }

  #runScripts() {
    const scripts = document.querySelectorAll(
      "script:not([data-cold])"
    );

    scripts.forEach((script) => {
      const newScript = document.createElement("script");
      const attr = Array.from(script.attributes);
      for (const { name, value } of attr) {
        newScript[name] = value;
      }

      newScript.append(script.textContent);
      script.replaceWith(newScript);
    });
  }

  #prefetch() {
    const intersectionOpts = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const url = entry.target.getAttribute("href");

        if (this.prefetched.has(url)) {
          observer.unobserve(entry.target);
          return;
        }

        if (entry.isIntersecting) {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = url;
          link.as = "document";

          document.head.appendChild(link);

          this.prefetched.add(url);
          observer.unobserve(entry.target);
        }
      }, intersectionOpts);
    });

    this.#allLinks().forEach((link) => observer.observe(link));
  }

  #allLinks() {
    return Array.from(document.links).filter((link) => {
      return (
        link.href.includes(document.location.origin) &&
        link.href.indexOf("#") == -1 && // not an id anchor
        link.href !==
          (document.location.href || document.location.href + "/") &&
        !this.prefetched.has(link.href)
      );
    });
  }

  #url(url) {
    const href = new URL(url || window.location.href).href;
    return href.endsWith("/") || href.includes(".") || href.includes("#")
      ? href
      : `${href}/`;
  }

  #handleClick(e) {
    let anchor;

    for (let n = e.target; n.parentNode; n = n.parentNode) {
      if (n.nodeName === "A") {
        anchor = n;
        break;
      }
    }

    if (anchor && this.#allLinks().indexOf(anchor) == -1) {
      if (anchor && anchor.hasAttribute("data-cold")) {
        return;
      }

      if (anchor && anchor.host !== location.host) {
        anchor.target = "_blank";
        return;
      }

      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if (anchor && anchor.hasAttribute("data-cold")) {
      return;
    }

    if (anchor?.hasAttribute("href")) {
      const ahref = anchor.getAttribute("href");
      const url = new URL(ahref, location.href);

      e.preventDefault();

      const next = this.#url(url.href);

      this.#replaceBody(next);
    }
  }

  #handlePopstate(e) {
    let anchor;

    for (let n = e.target; n.parentNode; n = n.parentNode) {
      if (n.nodeName === "A") {
        anchor = n;
        break;
      }
    }

    if (anchor && this.#allLinks().indexOf(anchor) == -1) {
      return;
    }

    this.#replaceBody(this.#url(), true);
  }

  #partitionNodes(oldNodes, nextNodes) {
    const staleNodes = [];
    const freshNodes = [];
    let oldMark = 0;
    let nextMark = 0;
    while (oldMark < oldNodes.length || nextMark < nextNodes.length) {
      const old = oldNodes[oldMark];
      const next = nextNodes[nextMark];
      if (old?.isEqualNode(next)) {
        oldMark++;
        nextMark++;
        continue;
      }
      const oldInFresh = old
        ? freshNodes.findIndex((node) => node.isEqualNode(old))
        : -1;
      if (oldInFresh !== -1) {
        freshNodes.splice(oldInFresh, 1);
        oldMark++;
        continue;
      }
      const nextInStale = next
        ? staleNodes.findIndex((node) => node.isEqualNode(next))
        : -1;
      if (nextInStale !== -1) {
        staleNodes.splice(nextInStale, 1);
        nextMark++;
        continue;
      }
      old && staleNodes.push(old);
      next && freshNodes.push(next);
      oldMark++;
      nextMark++;
    }

    return { staleNodes, freshNodes };
  }
}

export default (() => {
  const router = new Router();

  window.router = router;

  return router;
})();
