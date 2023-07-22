const dom = new DOMParser().parseFromString("", "text/html");

// const cache = await caches.open("astro-scripts");

// console.log(cache)

// cache.keys().then(async (keys) => {
//     console.log(keys);
//     for (const { url } of keys) {
//         // const body = await (await cache.match(url)).blob();
//         // const body = await res.blob();

//         // const blobURL = URL.createObjectURL(new Blob([`let moduleID = "${url.split('/').pop().split('.')[0]}";\n`, body], { type: 'application/javascript' }), { type: 'application/javascript' });

//         // let script = document.createElement('script');
//         // script.src = blobURL;
//         // script.type = 'module';
//         // script.defer = true

//         // document.head.appendChild(script);
//         console.log(url);
//     }
// });

window.addEventListener("inject:cache", (event) => {
  if (!window.cache) {
    window.cache = event.detail.cache;

    cache.keys().then(async (keys) => {
      for (const { url } of keys) {
        const body = await (await cache.match(url)).blob();

        const blobURL = URL.createObjectURL(
          new Blob(
            [`let moduleID = "${url.split("/").pop().split(".")[0]}";\n`, body],
            { type: "application/javascript" }
          ),
          { type: "application/javascript" }
        );

        let script = document.createElement("script");
        script.src = blobURL;
        script.type = "module";
        script.defer = true;

        document.head.appendChild(script);
      }
    });
  }
});

let color = "#fff";
let backgroundColor = "#000";
let settings1 = "#111";
let settings2 = "#222";
let settings3 = "#333";

let win = window.frameElement
  ? window.frameElement.ownerDocument.defaultView
  : window;

var uuid = function () {
  var uid = () => Math.floor(Math.random() * 0x10000).toString(16);

  return (
    uid() +
    uid() +
    "-" +
    uid() +
    "-" +
    uid() +
    "-" +
    uid() +
    "-" +
    uid() +
    uid() +
    uid()
  );
};

window.UUID =
  (window.frameElement && window.frameElement.dataset.uuid) || uuid();

if (window.frameElement) {
  window.frameElement.dataset.uuid = window.UUID;
  if (win.saveTab) {
    setTimeout(function () {
      Promise.resolve().then(async () =>
        win.saveTab(
          window.UUID,
          document.title,
          location.pathname.includes("/~/aero/")
            ? new Function("return __aero$meta.href")()
            : new Function("return this.location.href")(),
          Object.getOwnPropertyDescriptor(window, "location").get.call(window)
            .href
        )
      );
    }, 5000);
  }

  let doc = frameElement.ownerDocument;

  color = getComputedStyle(doc.documentElement).getPropertyValue(
    "--font-color"
  );
  backgroundColor = getComputedStyle(doc.documentElement).getPropertyValue(
    "--primary-bg-color"
  );
  settings1 = getComputedStyle(doc.documentElement).getPropertyValue(
    "--settings-1"
  );
  settings2 = getComputedStyle(doc.documentElement).getPropertyValue(
    "--settings-2"
  );
  settings3 = getComputedStyle(doc.documentElement).getPropertyValue(
    "--settings-3"
  );
}

if (!Reflect.get(win, "location").pathname.startsWith("/games")) {
  var container = document.createElement("div");
  container.id = "noctura-menu";

  container.innerHTML = `
    <button onclick="location.reload()">Reload</button>
    <button onclick="var d=document;d.fullscreenElement?d.exitFullscreen&&d.exitFullscreen():d.documentElement.requestFullscreen();">Fullscreen</button>
    ${
      window.frameElement
        ? '<button onclick="window.frameElement.style.display = `none`">Close</button>'
        : ""
    }
    <button id="noctura-close-menu">Close Menu</button>

    <input id="noctura-nav-input" value="${
      location.pathname.includes("/~/aero/")
        ? new Function("return __aero$meta.href")()
        : new Function("return this.location.href")()
    }">
    `;

  container.querySelector("#noctura-close-menu").onclick = function () {
    container.style.display = "none";
  };

  container.querySelector("#noctura-nav-input").onkeydown = function (e) {
    if (e.key == "Enter") {
      location.pathname.includes("/~/aero/")
        ? new Function(
            `return this.location.href = "/~/aero/${encodeURIComponent(
              this.value
            )}"`
          )()
        : new Function(`return this.location.href = "${this.value}"`)();
      new Function(`return this.location.href = "${this.value}"`)();
    }

    return e;
  };

  var style = document.createElement("style");

  style.innerHTML = `
    html:fullscreen, body:fullscreen {
        background: white;
    }

    #noctura-menu {
        position: fixed;
        top: 0;
        left: 50%;
        font-weight: 400 !important;
        height: min-content;
        padding: 5px 10px;
        border-radius: 5px;
        background: ${backgroundColor};
        color: #fff;
        transform: translate(-50%, 0);
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
        margin: 0 !important;
        width: 500px;
        z-index: 99999;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-family: sans-serif;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    }

    #noctura-nav-input {
        border: none;
        outline: none;
        background-color: ${settings1};
        color: ${color};
        padding: 5px 10px;
        border-radius: 5px;
        transition: 0.1s ease-in-out;
        font-family: sans-serif;
        font-size: 12px;
        flex: 1;
    }

    #noctura-menu button {
        border: none;
        outline: none;
        background-color: transparent;
        color: ${color};
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 5px;
        transition: 0.1s ease-in-out;
    }

    #noctura-menu button:hover {
        background-color: ${settings3};
        color: ${color};
    }
    `;

  container.appendChild(style);

  // make the container draggable

  var x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0,
    drag = false;

  container.addEventListener("mousedown", function (e) {
    if (e.target.tagName == "INPUT" || e.target.tagName == "BUTTON") return;

    e.preventDefault();

    x2 = e.clientX;
    y2 = e.clientY;

    drag = true;
  });

  document.addEventListener("mousemove", function (e) {
    if (drag) {
      e.preventDefault();

      x1 = x2 - e.clientX;
      y1 = y2 - e.clientY;
      x2 = e.clientX;
      y2 = e.clientY;

      if (container.offsetTop - y1 < 0) return;
      if (container.offsetLeft - x1 < 0) return;

      if (container.offsetTop - y1 > window.innerHeight) return;
      if (container.offsetLeft - x1 > window.innerWidth) return;

      container.style.top = container.offsetTop - y1 + "px";
      container.style.left = container.offsetLeft - x1 + "px";
    }
  });

  document.addEventListener("mouseup", function (e) {
    drag = false;
  });

  document.body.appendChild(container);
}
