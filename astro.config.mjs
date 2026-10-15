import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    sitemap()
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  site: "https://noctura.tech",
  output: "static",
  compressHTML: true
});