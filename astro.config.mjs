// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import solidJs from "@astrojs/solid-js";


import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ssr: {
    },
  },
  integrations: [solidJs()],
  site: "http://localhost:4321", 
  base: "/",
  trailingSlash: "ignore",
  output: "server",
  adapter: cloudflare(),
  outDir: "./dist",
  security: {
    checkOrigin: true,
  }
});