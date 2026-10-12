import { defineMiddleware } from "astro/middleware";

const fullPages = [
  "/",
  "/ai",
  "/console",
  "/emulators",
  "/settings",
  "/docs",
  "/feedback",
  "/404"
];

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname.split("?")[0] ?? "";
  if (path && !path.includes(".") && !fullPages.includes(path)) return next();

  const response = await next();
  const text = await response.text();
  const cloned = new Response(text, response);
  cloned.headers.set(
    "Content-Length",
    String(new TextEncoder().encode(text).length)
  );
  return cloned;
});
