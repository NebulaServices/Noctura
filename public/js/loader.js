// FILE IS RUN BEFORE PAGE LOAD

(() => {
  const theme = localStorage.getItem("theme") || "amoled";
  document.querySelector("style#dynamic-style").innerHTML =
    "* {transition: all 0s !important;}";
  document.documentElement.dataset.theme = theme;
  if (theme == "custom") {
    document.querySelector(
      "style#dynamic-style"
    ).innerHTML += `[data-theme="custom"] {${[
      "primary-bg-color",
      "secondary-bg-color",
      "settings-1",
      "settings-2",
      "settings-3",
      "font-color",
      "primary-text-color",
      "nav-btn-color-darker",
      "nav-btn-color"
    ]
      .map((e) =>
        localStorage.getItem(e)
          ? `--${e}: ${localStorage.getItem(e) + " !important"}`
          : ""
      )
      .join(";")}}`;
  }
  document.querySelector("style#dynamic-style").innerHTML = "* {}";

  const warn = (err, src, lin, col, type = "CLIENT") => {
    return console.warn(
      `%c[%c${type} ERROR%c] %c${err}\n%c[%cAT%c] %c${
        src || (lin ? location.href : "UNKNOWN")
      }:${lin || "UNKNOWN"}:${col || "UNKNOWN"}`,
      "color: white; font-weight: bold;",
      "color: red; font-weight: bold;",
      "color: white; font-weight: bold;",
      "font-weight: 100; color: white",
      "color: white; font-weight: bold;",
      "color: red; font-weight: bold;",
      "color: white; font-weight: bold;",
      "font-weight: 100; color: white"
    );
  };

  const oglist = window.onerror;
  window.onerror = function (event, source, line, col, error) {
    if (oglist) oglist(...arguments);

    warn(error.toString(), source, line, col);

    return true;
  };

  const ogrej = window.onunhandledrejection;
  window.onunhandledrejection = function (event, source, line, col, error) {
    if (ogrej) ogrej(...arguments);

    warn(event.reason.toString(), source, line, col);

    return true;
  };

  window.addEventListener("router:end", (event) => {
    var url =
      "/" +
      location.pathname
        .split("?")[0]
        .replace(/(\/$|^\/)/g, "")
        .replace(/settings\/(privacy|cloaking|unblock|theme)/, "settings/general")
        .replace(/console\/(scripts|themes)/, "console/scripts");

    document
      .querySelectorAll(".nav-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document.querySelector(`.nav-btn[href="${url}"]`).classList.add("active");

    titleLoad();
    faviconLoad();
  });

  caches.open("astro-modules").then(async (modules) => {
    for await (let { url } of await modules.keys()) {
      const module = await modules.match(url);
      const blob = await module.blob();
      const blobURL = URL.createObjectURL(blob, {
        type: "application/javascript"
      });

      let script = document.createElement("script");
      script.type = "module";
      script.src = blobURL;
      script.async = "";

      document.head.appendChild(script);
    }
  });

  window.faviconLoad = function faviconLoad() {
    var faviconPath = localStorage.getItem("savedFavicon");
    var faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = faviconPath || "/icon.png";
  };

  window.titleLoad = function titleLoad() {
    var title = localStorage.getItem("savedTitle") || "Noctura";
    document.title = title;
  };

  faviconLoad();
  titleLoad();
})();