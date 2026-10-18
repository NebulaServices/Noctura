importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
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
self.onunhandledrejection = function (event) {
  if (ogrej) ogrej(...arguments);

  warn(event.reason.toString(), event.stack, "", "");

  return true;
};

const p = caches.open("astro-cache");

async function injectScripts(response, event) {
  if (
    event.request.destination !== "document" &&
    event.request.destination !== "iframe"
  )
    return response;

  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  const cache = await caches.open("astro-scripts");
  const keys = await cache.keys();
  if (!keys.length) return response;

  let code = "";
  for (const req of keys) {
    const res = await cache.match(req);
    code +=
      "\n;(function () { try {\n" +
      (await res.text()) +
      "\n} catch (e) { console.warn('[noctura inject]', e); } })();";
  }

  let html = await response.text();
  const tag =
    "<script>" + code.replace(/<\/script/gi, "<\\/script") + "</scr" + "ipt>";
  html = html.includes("</body>")
    ? html.replace("</body>", tag + "</body>")
    : html + tag;

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

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

        await scramjet.loadConfig();
        if (scramjet.route(event)) {
          if (!navigator.onLine)
            return new Response("Offline", { status: 500 });

          return await injectScripts(await scramjet.fetch(event), event);
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
        warn(e.toString(), event.request.url, "", "");

        return new Response(e.toString(), { status: 500 });
      }
    })()
  );
});
