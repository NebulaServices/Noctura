import fastifyStatic from "@fastify/static";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import Fastify from "fastify";
import { createServer } from "http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "dist");
const epoxyPath = dirname(
  fileURLToPath(import.meta.resolve("@mercuryworkshop/epoxy-transport"))
);

if (!existsSync(dist)) {
  console.error("No dist/ directory found. Run `pnpm build` first.");
  process.exit(1);
}

const port = Number(process.env.PORT) || 8080;
const host = process.env.HOST || "0.0.0.0";

const serverFactory = (handler) => {
  return createServer()
    .on("request", (req, res) => {
      handler(req, res);
    })
    .on("upgrade", (req, socket, head) => {
      if (req.url.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
      } else {
        socket.end();
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

fastify.register(fastifyStatic, {
  root: scramjetPath,
  prefix: "/scram/",
  decorateReply: false
});

fastify.register(fastifyStatic, {
  root: baremuxPath,
  prefix: "/baremux/",
  decorateReply: false
});

fastify.register(fastifyStatic, {
  root: epoxyPath,
  prefix: "/epoxy/",
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
