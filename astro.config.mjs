// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import solidJs from "@astrojs/solid-js";
import netlify from "@astrojs/netlify";


// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
  },

  integrations: [solidJs()],
  site: 'https://udlaia-stats.netlify.app',
  base: '/',
  trailingSlash: 'ignore',
  output: 'static',
  adapter: netlify()
});