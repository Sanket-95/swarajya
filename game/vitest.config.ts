import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/*/src/**/*.test.ts", "missions/*/src/**/*.test.ts", "tools/**/*.test.ts"],
    environment: "node",
  },
});
