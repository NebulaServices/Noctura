import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import { astroImageTools } from "astro-imagetools";
import links from 'astro-link-preview';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), partytown(), sitemap(), compress({
    exclude: [file => file.includes("$server_build")],
    logger: 0
  }), astroImageTools],
  site: 'https://noctura.tech',
  build: {  
    inlineStylesheets: 'auto'
  },
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