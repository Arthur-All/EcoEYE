import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**", ".worktrees/**"],
    environmentMatchGlobs: [
      ["dashboard/src/**/*.test.tsx", "jsdom"],
      ["dashboard/src/**/*.test.ts", "jsdom"],
      ["spider/**/*.test.js", "node"]
    ],
    setupFiles: ["dashboard/src/test/setup.ts"]
  }
});
