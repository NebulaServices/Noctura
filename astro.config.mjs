import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import nodejs from '@astrojs/node';
import tailwind from "@astrojs/tailwind";

// import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), /* compress() */],
  adapter: nodejs({
    mode: "standalone"
  }),
<<<<<<< HEAD
=======
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Service-Worker-Allowed": "/",
      "X-Content-Type-Options": "nosniff"
    }
  },
<<<<<<< HEAD
>>>>>>> 3ed04a5d1242389e78f1850286d0af5740bf3da7
  output: "server",
=======
  output: "server"
>>>>>>> 2a73ad3 (Port (mostly) everything to astro)
});