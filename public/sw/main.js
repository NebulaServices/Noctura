let bareServer = "tomp.app";

importScripts("/sw/uv/uv.bundle.js");
importScripts("/sw/uv/uv.config.js");
importScripts("/sw/uv/uv.sw.js");

importScripts("/sw/dynamic/dynamic.config.js");
importScripts("/sw/dynamic/dynamic.worker.js");

addEventListener("install", async function (event) {
  event.waitUntil(self.skipWaiting());

  const cache = await caches.open("astro-scripts");

  cache.keys().then(async (keys) => {
    for (var { url } of keys) {
      const res = await cache.match(url);
      const body = await res.text();

      (0, eval)(
        `let moduleID = "${url.split("/").pop().split(".")[0]}";\n` + body
      );
    }
  });
});

addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

const warn = (err, src, lin, col) => {
  return console.warn(
    `%c[%cWORKER ERROR%c] %c${err}\n%c[%cAT%c] %c${src || "UNKNOWN"}:${
      lin || "UNKNOWN"
    }:${col || "UNKNOWN"}`,
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

const oglist = self.onerror;
self.onerror = function (event, source, line, col, error) {
  if (oglist) oglist(...arguments);

  warn(error.toString(), source, line, col);

  return true;
};

const ogrej = self.onunhandledrejection;
self.onunhandledrejection = function (event, source, line, col, error) {
  if (ogrej) ogrej(...arguments);

  warn(event.reason.toString(), event.stack, "", "");

  return true;
};

const p = new Promise(async (res) => {
  const cache = await caches.open("astro-data");

  if (await cache.match("/bare.txt")) {
    bareServer = await (await cache.match("/bare.txt")).text();
  }

  try {
    const req = await fetch("http://" + bareServer.replace(/\/$/, "") + "/", {
      redirect: "follow"
    });

    self.__uv$config.bare = req.url;
    self.__dynamic$config.bare.path = req.url;
  } catch {}

  if (navigator.onLine) {
    self.dynamic = new Dynamic(self.__dynamic$config);
    self.uv = new UVServiceWorker(self.__uv$config);
  }

  res(await caches.open("astro-cache"));
});

addEventListener("message", async (e) => {
  if (e.data == "updateCloak") {
    self.clients.matchAll().then((list) => {
      for (var client of list) {
        if (client.id == e.source.id) continue;

        client.postMessage("updateCloak");
      }
    });
  }
});

addEventListener("fetch", function (event) {
  event.respondWith(
    (async function () {
      try {
        const cache = await p;

        if (await cache.match(event.request.url))
          return await cache.match(event.request.url);

        if (event.request.url.endsWith("?sw=ignore"))
          return await fetch(event.request);

        if (navigator.onLine) {
          if (event.request.url.startsWith(location.origin + "/~/uv/")) {
            return await self.uv.fetch(event);
          }

          if (await self.dynamic.route(event)) {
            return await self.dynamic.fetch(event);
          }
        } else {
          if (event.request.url.startsWith(location.origin + "/~/")) {
            return new Response("Offline", { status: 500 });
          }
        }

        if (
          event.request.destination === "font" ||
          (event.request.destination === "image" &&
            event.request.url.startsWith(location.origin + "/icons/games/")) ||
          event.request.url.startsWith(location.origin + "/_astro/")
        ) {
          var res;
          const req =
            (await cache.match(event.request.url)) ||
            ((res = await fetch(event.request)),
            await cache.put(event.request.url, res.clone()),
            res);

          return req;
        }

        return await fetch(event.request);
      } catch (e) {
        onerror("", event.request.url, "", "", e);

        return new Response(e.toString(), { status: 500 });
      }
    })()
  );
});
