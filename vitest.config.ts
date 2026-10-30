import {fileURLToPath, URL} from "node:url";

import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vitest/config";

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const alias = {
  "@sail-ui/styles": resolvePath("./packages/styles/src/index.ts"),
  "@sail-ui/primitives": resolvePath("./packages/primitives/src/index.ts"),
  "@sail-ui/vue/button": resolvePath("./packages/vue/src/components/button/index.ts"),
  "@sail-ui/vue/input": resolvePath("./packages/vue/src/components/input/index.ts"),
  "@sail-ui/vue/modal": resolvePath("./packages/vue/src/components/modal/index.ts"),
  "@sail-ui/vue/select": resolvePath("./packages/vue/src/components/select/index.ts"),
  "@sail-ui/vue": resolvePath("./packages/vue/src/index.ts"),
  "@sail-ui/testing": resolvePath("./packages/testing/src/index.ts")
};

const shared = {
  globals: true,
  restoreMocks: true,
  clearMocks: true,
  mockReset: true
};

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          ...shared,
          name: "unit",
          environment: "jsdom",
          setupFiles: [resolvePath("./tests/setup.ts")],
          include: ["packages/**/__tests__/**/*.unit.test.ts"]
        }
      },
      {
        extends: true,
        test: {
          ...shared,
          name: "contract",
          environment: "jsdom",
          setupFiles: [resolvePath("./tests/setup.ts")],
          include: ["packages/**/__tests__/**/*.contract.test.ts"]
        }
      },
      {
        extends: true,
        test: {
          ...shared,
          name: "ssr",
          environment: "node",
          include: ["packages/**/__tests__/**/*.ssr.test.ts"]
        }
      }
    ]
  }
});
