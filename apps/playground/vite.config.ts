import {fileURLToPath, URL} from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@sail-ui/styles/css": resolvePath("../../packages/styles/index.css"),
      "@sail-ui/styles": resolvePath("../../packages/styles/src/index.ts"),
      "@sail-ui/primitives": resolvePath("../../packages/primitives/src/index.ts"),
      "@sail-ui/vue/button": resolvePath("../../packages/vue/src/components/button/index.ts"),
      "@sail-ui/vue/input": resolvePath("../../packages/vue/src/components/input/index.ts"),
      "@sail-ui/vue/modal": resolvePath("../../packages/vue/src/components/modal/index.ts"),
      "@sail-ui/vue/select": resolvePath("../../packages/vue/src/components/select/index.ts"),
      "@sail-ui/vue": resolvePath("../../packages/vue/src/index.ts")
    }
  },
  server: {
    port: 5173
  },
  preview: {
    port: 4173
  }
});
