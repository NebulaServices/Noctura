import Fastify from 'fastify';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { join } from 'path';
import { createBareServer } from '@tomphttp/bare-server-node';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import fastifyStatic from "@fastify/static";

// if anyone can figure out how to unfuck fastify not working on some things that would be great, ideally we want to use it over express whenever we can.
const bare = createBareServer("/bare/");
const serverFactory = (handler, opts) => {
  return createServer()
    .on("request", (req, res) => {
      if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res)
      } else {
        handler(req, res)
      }
    })
    .on("upgrade", (req, socket, head) => {
      if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
      }
    });
}

const fastify = Fastify({ logger: true, serverFactory });

fastify.register(import("@fastify/compress"));

fastify.register(fastifyStatic, {
  root: join(fileURLToPath(import.meta.url), "../dist"),
  decorateReply: false,
  setHeaders(res, path, stat) {
    res.setHeader("Service-Worker-Allowed", "/");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Content-Type-Options", "nosniff");
  }
});

fastify.register(fastifyStatic, {
  root: uvPath,
  prefix: "/uv/",
  decorateReply: false
});

fastify.get("/search=:query", async (req, res) => {
  const { query } = req.params;

  try {
    const response = await fetch(`http://api.duckduckgo.com/ac?q=${query}&format=json`)
      .then((res) => res.json());
    res.send(response);
  } catch {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

fastify.listen({
  port: 8080,
});