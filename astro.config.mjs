import minify from "./minify";
import sitemap from "@astrojs/sitemap";
// import cloudflare from "@astrojs/cloudflare";
// import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import { astroImageTools } from "astro-imagetools";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    minify(),
    compress({
      exclude: [
        (file) => file.includes("$server_build") || file.includes("/sw")
      ],
      logger: 0,
      js: false,
      css: false
    }),
    astroImageTools
  ],
  site: "https://noctura.tech",
  build: {
    inlineStylesheets: "auto"
  },
  // adapter: cloudflare({
  //   mode: "directory"
  // }),
  // adapter: node({
  //   mode: "standalone"
  // }),
  output: "static"
});
