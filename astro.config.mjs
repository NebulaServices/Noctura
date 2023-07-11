import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import node from "@astrojs/node"
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react(), compress({
    exclude: [
      (file) => file.includes("$server_build")
    ],

    logger: 0
  })],
  // adapter: cloudflare({
  //   mode: "directory"
  // }),
  // adapter: node({
  //   mode: "standalone"
  // }), 
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Service-Worker-Allowed": "/",
      "X-Content-Type-Options": "nosniff"
    }
  },
  output: "static"
});