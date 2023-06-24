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
  output: "server",
});