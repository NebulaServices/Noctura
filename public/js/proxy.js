(async function () {
  function status(state) {
    window.proxyStatus = state;
    dispatchEvent(new CustomEvent("proxy:status", { detail: { state } }));
  }

  try {
    status("connecting");

    const { ScramjetController } = $scramjetLoadController();

    const scramjet = new ScramjetController({
      prefix: "/~/scramjet/",
      files: {
        wasm: "/scram/scramjet.wasm.wasm",
        all: "/scram/scramjet.all.js",
        sync: "/scram/scramjet.sync.js"
      }
    });

    window.scramjet = scramjet;

    await scramjet.init();

    if (window.registerSW) {
      await window.registerSW();
    } else if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    }

    const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
    const wispUrl =
      localStorage.getItem("wisp-url") ||
      (location.protocol === "https:" ? "wss" : "ws") +
        "://" +
        location.host +
        "/wisp/";
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);

    status("connected");
  } catch (err) {
    console.error("[proxy] init failed:", err);
    status("error");
  }
})();
