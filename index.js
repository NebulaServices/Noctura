import Fastify from 'fastify';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
// import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = Fastify({ logger: true });

await app
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('./dist/', import.meta.url)),
  })
  .register(fastifyMiddie);

// app.use(ssrHandler);
app.get('/search=:query', async (request, reply) => {
  const { query } = request.params;

  try {
    const response = await fetch(`http://api.duckduckgo.com/ac?q=${query}&format=json`);
    console.log(query);
    const data = await response.json();
    reply.send(data);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

app.listen({ port: 80 });
