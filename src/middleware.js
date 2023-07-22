import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (_, next) => {
  if (_.url.pathname) {
    var path = _.url.pathname.split("?")[0];
    if (
      !path.includes(".") &&
      ![
        "/",
        "/ai",
        "/console",
        "/games",
        "/music",
        "/settings",
        "/docs",
        "/feedback",
        "/404"
      ].includes(path)
    )
      return next();
  }

  const response = await next();

  if (response.text) {
    var text = await response.text();

    var cloned = new Response(text, response);
  }

  if (response.headers) cloned.headers.set("Content-Length", text.length);
  else {
    return new Response(response.body, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, immutable"
      }
    });
  }

  return cloned;
});
