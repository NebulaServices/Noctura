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
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Service-Worker-Allowed": "/",
      "X-Content-Type-Options": "nosniff"
    }
  },
  output: "server"
});