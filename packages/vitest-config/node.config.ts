import { defineConfig, mergeConfig } from "vitest/config";
import { baseConfig } from "./base.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "node",
      setupFiles: [],
      globals: true,
    },
  })
);
