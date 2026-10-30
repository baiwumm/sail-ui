import {fileURLToPath} from "node:url";

import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: {
        "components/button/index": entry("src/components/button/index.ts"),
        "components/input/index": entry("src/components/input/index.ts"),
        "components/modal/index": entry("src/components/modal/index.ts"),
        "components/select/index": entry("src/components/select/index.ts"),
        index: entry("src/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^vue$/, /^vue\//, /^reka-ui($|\/)/, /^@sail-ui\//],
    },
  },
  plugins: [
    vue(),
    dts({
      entryRoot: "src",
      include: ["src/**/*.ts", "src/**/*.vue"],
      outDir: "dist",
      tsconfigPath: "./tsconfig.build.json",
    }),
  ],
});
