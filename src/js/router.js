class Router {
    constructor() {
        document.addEventListener("click", (e) => this.#handleClick(e));
        addEventListener("popstate", (e) => this.#handlePopstate());
        this.prefetched = new Set();
        this.#prefetch();
    }
    
    go(href) {
        this.#replaceBody(href);
    }
    
    #prefetch() {
        const intersectionOpts = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                const url = entry.target.getAttribute('href');

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
            link.href.includes(document.location.origin) &&
            !link.href.includes('#') && // not an id anchor
            link.href !== (document.location.href || document.location.href + '/') &&
            !this.prefetched.has(link.href)
        });
    }

    async #replaceBody(href) {
        const parser = new DOMParser();
        const prev = location.href;
        const next = new URL(href, location.origin).href;
        const oldWin = window;

        if (prev === next) {
            return;
        }
        
        window.history.pushState({ next }, "", next);

        window.dispatchEvent(new CustomEvent("router:begin"));

        const doc = await fetch(next)
            .then((res) => res.text())
            .then((text) => parser.parseFromString(text, "text/html"));

        document.body.replaceWith(doc.body);
        this.#mergeHead(doc);

        this.#runScripts();

        for (const obj in window) {
            if (!obj in oldWin) {
                delete window[obj]
            }
        }

        window.dispatchEvent(new CustomEvent("router:end"));

        console.log(next);
    }

    #mergeHead(doc) {
        const getValidNodes = (doc) => Array.from(doc.querySelectorAll('head>:not([rel="prefetch"]'));
        const oldNodes = getValidNodes(document);
        const newNodes = getValidNodes(doc);

        const { staleNodes, freshNodes } = this.#partitionNodes(oldNodes, newNodes);

        staleNodes.forEach((node) => node.remove());

        document.head.append(...freshNodes);

    }

    #runScripts() {
        const scripts = document.body.querySelectorAll("script");

        scripts.forEach((script) => {
            const newScript = document.createElement("script");
            const attr = Array.from(script.attributes);
            for (const {key, prop} of attr) {
                newScript[key] = [prop];
            }

            newScript.append(script.textContent);
            script.replaceWith(newScript)
        })
    }

    #url(url) {
        const href = new URL(url || window.location.href, window.location.origin).href;
        return href.endsWith('/') || href.includes('.') || href.includes('#') ? href : `${href}/`;
    }

    #handleClick(e) {
        let anchor;

        for (let n = e.target; n.parentNode; n = n.parentNode) {
            if (n.nodeName === 'A') {
                anchor = n;
                break;
            }
        }

        if (anchor && anchor.host !== location.host) {
            anchor.target = '_blank';
            return;
        }

        if (anchor?.hasAttribute('href')) {
            const ahref = anchor.getAttribute('href');
            const url = new URL(ahref, location.href);

            e.preventDefault();

            const next = this.#url(url.href);

            this.#replaceBody(next);
        }
    }

    #handlePopstate() {
        this.#replaceBody(this.#url());
    }

    #partitionNodes(oldNodes, nextNodes) {
        const staleNodes = [];
        const freshNodes = []
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
            const oldInFresh = old ? freshNodes.findIndex((node) => node.isEqualNode(old)) : -1;
            if (oldInFresh !== -1) {
                freshNodes.splice(oldInFresh, 1);
                oldMark++;
                continue;
            }
            const nextInStale = next ? staleNodes.findIndex((node) => node.isEqualNode(next)) : -1;
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
    
export default ((parent = null) => {
    const router = new Router(parent);

    window.router = router;

    return router;
})()