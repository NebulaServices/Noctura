class Router {
  prefetched: Set<string>;

  constructor() {
    document.addEventListener("click", (e) => this.#handleClick(e));
    window.addEventListener("popstate", () => this.#handlePopstate());
    this.prefetched = new Set();
    this.#prefetch();
  }

  go(href: string) {
    this.#replaceBody(href);
  }

  async #replaceBody(href: string, popstate = false) {
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

    await this.#preloadStyles(doc);

    const selector =
      "main.layout > div:not(.toast-container, .header, .top-banner, .footer, .site-footer)";

    const current = document.body.querySelector<HTMLElement>(selector);
    const incoming = doc.body.querySelector<HTMLElement>(selector);

    const swap = () => {
      if (doc.title) document.title = doc.title;

      if (current && incoming) current.replaceWith(incoming);
      window.scrollTo({ top: 0, behavior: "instant" });
      this.#mergeHead(doc);
      this.#runScripts();
    };

    const done = () => {
      window.dispatchEvent(new CustomEvent("router:end"));
    };

    const withTransition = document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    if (withTransition.startViewTransition && current && incoming) {
      current.style.viewTransitionName = "page-content";
      incoming.style.viewTransitionName = "page-content";

      const section = (href: string) =>
        new URL(href, location.origin).pathname.split("/")[1] || "";
      if (section(prev) !== "" && section(prev) === section(next))
        document.documentElement.classList.add("vt-quick");

      const transition = withTransition.startViewTransition(swap);

      transition.ready.catch((err) =>
        console.warn("[router] view transition skipped:", err)
      );

      transition.finished.finally(() => {
        incoming.style.viewTransitionName = "";
        document.documentElement.classList.remove("vt-quick");
        done();
      });
    } else {
      swap();
      done();
    }
  }

  async #preloadStyles(doc: Document) {
    const fresh = Array.from(
      doc.querySelectorAll<HTMLLinkElement>('head link[rel="stylesheet"]')
    ).filter((link) => {
      const href = link.getAttribute("href");
      return (
        href &&
        !document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)
      );
    });

    if (!fresh.length) return;

    await Promise.race([
      Promise.all(
        fresh.map(
          (link) =>
            new Promise<void>((resolve) => {
              const preload = document.createElement("link");
              preload.rel = "preload";
              preload.as = "style";
              preload.href = link.href;
              preload.onload = () => resolve();
              preload.onerror = () => resolve();
              document.head.appendChild(preload);
            })
        )
      ),
      new Promise<void>((resolve) => setTimeout(resolve, 2000))
    ]);
  }

  #mergeHead(doc: Document) {
    const getValidNodes = (root: Document): Element[] =>
      Array.from(
        root.querySelectorAll('head>:not([rel="prefetch"], [data-cold])')
      );
    const oldNodes = getValidNodes(document);
    const newNodes = getValidNodes(doc);

    const { staleNodes, freshNodes } = this.#partitionNodes(oldNodes, newNodes);

    staleNodes.forEach((node) => node.remove());

    document.head.append(...freshNodes);
  }

  #runScripts() {
    const scripts = document.querySelectorAll("script:not([data-cold])");

    scripts.forEach((script) => {
      const newScript = document.createElement("script");
      const attr = Array.from(script.attributes);
      for (const { name, value } of attr) {
        (newScript as unknown as Record<string, string>)[name] = value;
      }

      newScript.append(script.textContent ?? "");
      script.replaceWith(newScript);
    });
  }

  #prefetch() {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const url = entry.target.getAttribute("href");

        if (!url || this.prefetched.has(url)) {
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
      });
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

  #url(url?: string) {
    const href = new URL(url || window.location.href).href;
    return href.endsWith("/") || href.includes(".") || href.includes("#")
      ? href
      : `${href}/`;
  }

  #handleClick(e: MouseEvent) {
    let anchor: HTMLAnchorElement | undefined;

    for (
      let n: Node | null = e.target as Node | null;
      n && n.parentNode;
      n = n.parentNode
    ) {
      if (n.nodeName === "A") {
        anchor = n as HTMLAnchorElement;
        break;
      }
    }

    if (anchor && this.#allLinks().indexOf(anchor) == -1) {
      if (anchor.hasAttribute("data-cold")) {
        return;
      }

      if (anchor.host !== location.host) {
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
      const ahref = anchor.getAttribute("href")!;
      const url = new URL(ahref, location.href);

      e.preventDefault();

      const next = this.#url(url.href);

      this.#replaceBody(next);
    }
  }

  #handlePopstate() {
    this.#replaceBody(this.#url(), true);
  }

  #partitionNodes(oldNodes: Element[], nextNodes: Element[]) {
    const staleNodes: Element[] = [];
    const freshNodes: Element[] = [];
    let oldMark = 0;
    let nextMark = 0;
    while (oldMark < oldNodes.length || nextMark < nextNodes.length) {
      const old = oldNodes[oldMark];
      const next = nextNodes[nextMark];
      if (old?.isEqualNode(next ?? null)) {
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
      if (old) staleNodes.push(old);
      if (next) freshNodes.push(next);
      oldMark++;
      nextMark++;
    }

    return { staleNodes, freshNodes };
  }
}

declare global {
  interface Window {
    router: Router;
  }
}

export default (() => {
  const router = new Router();

  window.router = router;

  return router;
})();
