import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import cloudflare from '@astrojs/cloudflare';
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), compress({
    exclude: [
      (file) => file.includes("$server_build")
    ],

    logger: 0
  })],
  adapter: cloudflare({
    mode: "directory"
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