(function () {
  const CACHE = "astro-tabs";

  let dock = null;
  let panel = null;
  let button = null;
  let count = null;
  let open = false;
  let activeId = null;

  const frames = () =>
    Array.from(document.querySelectorAll("iframe[data-uuid]"));
  const frameFor = (id) =>
    document.querySelector('iframe[data-uuid="' + id + '"]');

  async function getData() {
    const cache = await caches.open(CACHE);
    const keys = await cache.keys();
    const data = [];

    for (const key of keys) {
      try {
        data.push(await cache.match(key).then((res) => res.json()));
      } catch (e) {
        /* skip corrupt record */
      }
    }

    return data;
  }

  async function saveRecord(record) {
    const cache = await caches.open(CACHE);
    await cache.put(
      "/" + record.id + ".json",
      new Response(JSON.stringify(record), {
        headers: { "Content-Type": "application/json" }
      })
    );
  }

  function headerOffset() {
    const header = document.querySelector(".header");
    return header ? Math.round(header.getBoundingClientRect().height) : 0;
  }

  function placeFrame(frame) {
    const offset = headerOffset();
    frame.style.position = "fixed";
    frame.style.top = offset + "px";
    frame.style.left = "0";
    frame.style.width = "100%";
    // iframes are replaced elements: top+bottom+height:auto collapses to the
    // intrinsic 150px, so the height must be explicit.
    frame.style.height = "calc(100dvh - " + offset + "px)";
    frame.style.zIndex = "500";
  }

  function makeFrame(record) {
    const frame = document.createElement("iframe");
    frame.classList.add("proxy-iframe", "tab-frame");
    frame.dataset.uuid = record.id;
    frame.src = record.pHref;
    placeFrame(frame);
    frame.style.display = "none";
    document.body.appendChild(frame);
    return frame;
  }

  function setScrollLock(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
  }

  function showFrame(id) {
    window.scrollTo({ top: 0, behavior: "instant" });
    setScrollLock(true);
    frames().forEach(function (frame) {
      frame.style.display = frame.dataset.uuid === id ? "block" : "none";
      if (frame.dataset.uuid === id) placeFrame(frame);
    });
    activeId = id;
    if (dock && open) setOpen(false);
    else render();
  }

  function hideFrames() {
    setScrollLock(false);
    frames().forEach(function (frame) {
      frame.style.display = "none";
    });
    activeId = null;
    render();
  }

  async function openTab(url) {
    const record = {
      id:
        window.crypto && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()) + Math.random().toString(16).slice(2),
      title: new URL(url).hostname || url,
      href: url,
      pHref: window.scramjet.encodeUrl(url)
    };

    await saveRecord(record);

    const frame = makeFrame(record);
    showFrame(record.id);

    return { id: record.id, iframe: frame };
  }

  async function activate(id) {
    if (id === activeId) {
      hideFrames();
      return;
    }

    if (!frameFor(id)) {
      const record = (await getData()).find(function (r) {
        return r.id === id;
      });
      if (!record) return;
      makeFrame(record);
    }

    showFrame(id);
  }

  async function remove(id) {
    const cache = await caches.open(CACHE);
    await cache.delete("/" + id + ".json");

    const frame = frameFor(id);
    if (frame) frame.remove();
    if (activeId === id) {
      activeId = null;
      setScrollLock(false);
    }

    render();
  }

  function hostOf(href) {
    try {
      return new URL(href).hostname;
    } catch (e) {
      return href;
    }
  }

  async function render() {
    if (!panel) return;

    const data = await getData();

    if (count) {
      count.hidden = !data.length;
      count.textContent = String(data.length);
    }

    panel.innerHTML = "";

    if (!data.length) {
      const empty = document.createElement("div");
      empty.className = "tabs-empty";
      empty.textContent = "No tabs yet — search to open one.";
      panel.appendChild(empty);
      return;
    }

    data.forEach(function (record) {
      const card = document.createElement("div");
      card.className = "tab-card" + (record.id === activeId ? " active" : "");
      card.setAttribute("role", "listitem");

      const main = document.createElement("button");
      main.type = "button";
      main.className = "tab-main";

      const title = document.createElement("span");
      title.className = "tab-title";
      title.textContent = record.title;

      const link = document.createElement("span");
      link.className = "tab-link";
      link.textContent = hostOf(record.href);

      main.appendChild(title);
      main.appendChild(link);
      main.addEventListener("click", function () {
        activate(record.id);
      });

      const close = document.createElement("button");
      close.type = "button";
      close.className = "tab-close";
      close.setAttribute("aria-label", "Close " + record.title);
      close.textContent = "×";
      close.addEventListener("click", function () {
        remove(record.id);
      });

      card.appendChild(main);
      card.appendChild(close);
      panel.appendChild(card);
    });
  }

  function setOpen(value) {
    open = value;
    dock.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close tabs" : "Open tabs");
    if (open) render();
  }

  function init() {
    dock = document.getElementById("tabs-dock");
    panel = document.getElementById("tabs-list");
    button = document.getElementById("tabs-btn");
    count = document.getElementById("tabs-count");

    if (!dock || !panel || !button) return;

    button.addEventListener("click", function () {
      setOpen(!open);
    });

    document.addEventListener("pointerdown", function (e) {
      if (open && !dock.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) setOpen(false);
    });

    render();
  }

  window.tabs = {
    open: openTab,
    activate: activate,
    remove: remove,
    deactivate: hideFrames,
    refresh: render
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
