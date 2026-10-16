if ("serviceWorker" in navigator) {
  window.registerSW = (force = false) =>
    (force
      ? navigator.serviceWorker
          .getRegistrations()
          .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      : Promise.resolve()
    )
      .then(() =>
        navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none"
        })
      )
      .then(() => navigator.serviceWorker.ready)
      .catch(function (error) {
        console.log("Service worker registration failed, error:", error);
      });

  registerSW();

  navigator.serviceWorker.addEventListener("message", async function (e) {
    if (e.data == "updateCloak") {
      faviconLoad();
      titleLoad();
    }
  });
}
