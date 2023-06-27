import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import nodejs from '@astrojs/node';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  adapter: nodejs({
    mode: "standalone",
  }),
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 3ac06c9f436e0fc6235640e8d634ae04e80af26f
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Service-Worker-Allowed": "/",
      "X-Content-Type-Options": "nosniff"
    }
  },
<<<<<<< HEAD
>>>>>>> 3ed04a5d1242389e78f1850286d0af5740bf3da7
=======
>>>>>>> 3ac06c9f436e0fc6235640e8d634ae04e80af26f
  output: "server",
});