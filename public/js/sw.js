if ("serviceWorker" in navigator) {
  window.registerSW = () =>
    new Promise((e) =>
      navigator.serviceWorker
        .getRegistrations()
        .then(async function (registrations) {
          for await (let registration of registrations) {
            await registration.unregister();
          }

          if (!navigator.serviceWorker.controller)
            await navigator.serviceWorker
              .register("/sw.js", {
                scope: "/",
                module: true,
                updateViaCache: "none"
              })
              .then(function (registration) {
                console.log(
                  "Registration successful, scope is:",
                  registration.scope
                );
              })
              .catch(function (error) {
                console.log(
                  "Service worker registration failed, error:",
                  error
                );
              });

          if (!navigator.serviceWorker.controller)
            await navigator.serviceWorker
              .register("/aero.js", {
                scope: "/~/aero",
                module: true,
                updateViaCache: "none"
              })
              .then(function (registration) {
                console.log(
                  "Registration successful, scope is:",
                  registration.scope
                );
              })
              .catch(function (error) {
                console.log(
                  "Service worker registration failed, error:",
                  error
                );
              });

          e();
        })
    );

  if (!navigator.serviceWorker.controller) registerSW();
  else {
    navigator.serviceWorker.addEventListener("message", async function (e) {
      if (e.data == "updateCloak") {
        faviconLoad();
        titleLoad();
      }
    });
  }
}
