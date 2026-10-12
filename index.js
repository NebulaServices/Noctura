import fastifyStatic from "@fastify/static";
import { createBareServer } from "@tomphttp/bare-server-node";
import Fastify from "fastify";
import { createServer } from "http";
import { join, dirname } from "path";
import createRammerhead from "rammerhead/src/server/index.js";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "dist");

if (!existsSync(dist)) {
  console.error("No dist/ directory found. Run `pnpm build` first.");
  process.exit(1);
}

const port = Number(process.env.PORT) || 8080;
const host = process.env.HOST || "0.0.0.0";

const bare = createBareServer("/bare/");

const rh = createRammerhead();

const rammerheadScopes = [
  "/rammerhead.js",
  "/hammerhead.js",
  "/transport-worker.js",
  "/task.js",
  "/iframe-task.js",
  "/worker-hammerhead.js",
  "/messaging",
  "/sessionexists",
  "/deletesession",
  "/newsession",
  "/editsession",
  "/needpassword",
  "/syncLocalStorage",
  "/api/shuffleDict",
  "/mainport"
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

function shouldRouteRh(req) {
  const url = new URL(req.url, "http://0.0.0.0");
  return (
    rammerheadScopes.includes(url.pathname) ||
    rammerheadSession.test(url.pathname)
  );
}

function routeRhRequest(req, res) {
  rh.emit("request", req, res);
}

function routeRhUpgrade(req, socket, head) {
  rh.emit("upgrade", req, socket, head);
}

const serverFactory = (handler) => {
  return createServer()
    .on("request", (req, res) => {
      if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
      } else if (shouldRouteRh(req)) {
        routeRhRequest(req, res);
      } else {
        handler(req, res);
      }
    })
    .on("upgrade", (req, socket, head) => {
      if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
      } else if (shouldRouteRh(req)) {
        routeRhUpgrade(req, socket, head);
      }
    });
};

const fastify = Fastify({ logger: true, serverFactory });

fastify.register(import("@fastify/compress"), {
  encodings: ["br"]
});

fastify.register(fastifyStatic, {
  root: dist,
  decorateReply: false
});

fastify.get("/api/search", async (req, reply) => {
  const query = String(req.query.q ?? "");

  if (!query) return reply.code(400).send({ error: "Missing query" });

  try {
    const response = await fetch(
      "https://duckduckgo.com/ac/?q=" + encodeURIComponent(query)
    ).then((res) => res.json());
    return response;
  } catch {
    return reply.code(500).send({ error: "Internal Server Error" });
  }
});

fastify.listen({ port, host });
