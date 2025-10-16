/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "node",
    globals: true,
    // setupFiles: ["./vitest.setup.ts"],
    coverage: {
      enabled: true,
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html"],
      exclude: [
        "node_modules/**",
        "tests/**",
        "vitest.setup.ts",
        "**/*.js",
        "**/*.json",
        "**/*.config.ts",
        "src/consts/**",
        "src/assets/**",
        "dist/**",
        "public/**",
        "**/*.d.ts",
        "**/*.mjs"
      ],
    },
    include: ["tests/**/*.test.{ts,tsx,astro}"],
  },
});
