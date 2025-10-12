/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig(
  {
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./vitest.setup.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        exclude: ["node_modules/", "tests/", "vitest.setup.ts"],
      },
      include: ["tests/**/*.test.{ts,tsx}"],
    },
  }
);
