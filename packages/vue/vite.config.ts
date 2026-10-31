import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";

import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// Every public subpath export must have a matching lib entry, otherwise the
// published package points at files Vite never emitted.
const pkg = JSON.parse(readFileSync(entry("package.json"), "utf8")) as {
  exports: Record<string, unknown>;
};
const componentEntries = Object.fromEntries(
  Object.keys(pkg.exports)
    .filter((key) => key !== "." && key !== "./package.json")
    .map((key) => [
      `components/${key.slice(2)}/index`,
      entry(`src/components/${key.slice(2)}/index.ts`),
    ]),
);

export default defineConfig({
  build: {
    lib: {
      entry: {
        ...componentEntries,
        index: entry("src/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^vue$/, /^vue\//, /^reka-ui($|\/)/, /^@tanstack\//, /^@sail-ui\//],
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
