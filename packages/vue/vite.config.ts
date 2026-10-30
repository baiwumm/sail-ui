import {fileURLToPath} from "node:url";

import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: {
        "components/alert/index": entry("src/components/alert/index.ts"),
        "components/avatar/index": entry("src/components/avatar/index.ts"),
        "components/avatar-group/index": entry("src/components/avatar-group/index.ts"),
        "components/badge/index": entry("src/components/badge/index.ts"),
        "components/breadcrumbs/index": entry("src/components/breadcrumbs/index.ts"),
        "components/button/index": entry("src/components/button/index.ts"),
        "components/card/index": entry("src/components/card/index.ts"),
        "components/chip/index": entry("src/components/chip/index.ts"),
        "components/close-button/index": entry("src/components/close-button/index.ts"),
        "components/description/index": entry("src/components/description/index.ts"),
        "components/empty-state/index": entry("src/components/empty-state/index.ts"),
        "components/error-message/index": entry("src/components/error-message/index.ts"),
        "components/field-error/index": entry("src/components/field-error/index.ts"),
        "components/fieldset/index": entry("src/components/fieldset/index.ts"),
        "components/header/index": entry("src/components/header/index.ts"),
        "components/input/index": entry("src/components/input/index.ts"),
        "components/kbd/index": entry("src/components/kbd/index.ts"),
        "components/label/index": entry("src/components/label/index.ts"),
        "components/link/index": entry("src/components/link/index.ts"),
        "components/modal/index": entry("src/components/modal/index.ts"),
        "components/progress-bar/index": entry("src/components/progress-bar/index.ts"),
        "components/progress-circle/index": entry("src/components/progress-circle/index.ts"),
        "components/select/index": entry("src/components/select/index.ts"),
        "components/separator/index": entry("src/components/separator/index.ts"),
        "components/skeleton/index": entry("src/components/skeleton/index.ts"),
        "components/spinner/index": entry("src/components/spinner/index.ts"),
        "components/surface/index": entry("src/components/surface/index.ts"),
        "components/typography/index": entry("src/components/typography/index.ts"),
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
