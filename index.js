import Fastify from 'fastify';
import fastifyMiddie from '@fastify/middie';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { join } from 'path';
import { hostname } from 'os';
import { createBareServer } from '@tomphttp/bare-server-node';
import express from 'express';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';

// if anyone can figure out how to unfuck fastify not working on some things that would be great, ideally we want to use it over express whenever we can.

const app = Fastify({ logger: true });

const bare = createBareServer('/bare/');
const proxyApp = express();

const publicPath = join(fileURLToPath(import.meta.url), '../dist');

proxyApp.get('/search=:query', async (request, reply) => {
  const { query } = request.params;

  try {
    const response = await fetch(`http://api.duckduckgo.com/ac?q=${query}&format=json`);
    const data = await response.json();
    reply.send(data);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});
// Load our publicPath first and prioritize it over UV.
proxyApp.use(express.static(publicPath));

// Load vendor files last.
// The vendor's uv.config.js won't conflict with our uv.config.js inside the publicPath directory.
proxyApp.use('/uv/', express.static(uvPath));

// Error for everything else
proxyApp.use((req, res) => {
  res.status(404);
  res.sendFile(join(publicPath, '404.html'));
});

// Register the Fastify middleware
app.register(fastifyMiddie);



// Create the HTTP server
const server = createServer();

server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    proxyApp(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || '');

if (isNaN(port)) port = 8080;

server.on('listening', () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log('Listening on:');
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === 'IPv6' ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({
  port,
});
