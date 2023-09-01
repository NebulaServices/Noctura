// import minify from "./minify";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    // minify()
  ],
  site: "https://noctura.tech",
  output: "static",
  // will be changed to false when i get jampack setup or my minify plugin to work again
  compressHTML: true
});