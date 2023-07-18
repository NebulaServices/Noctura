import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import { astroImageTools } from "astro-imagetools";
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import compression from './compress';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), partytown({ config: { debug: false } }), sitemap(), compression(), compress({
    exclude: [file => file.includes("$server_build")],
    logger: 0,
    js: false,
    css: false
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
  output: "static"
});