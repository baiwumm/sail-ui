import {fileURLToPath, URL} from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const componentAliases = [
  "alert",
  "avatar",
  "avatar-group",
  "badge",
  "breadcrumbs",
  "button",
  "card",
  "chip",
  "close-button",
  "description",
  "empty-state",
  "error-message",
  "field-error",
  "fieldset",
  "header",
  "input",
  "kbd",
  "label",
  "link",
  "modal",
  "progress-bar",
  "progress-circle",
  "select",
  "separator",
  "skeleton",
  "spinner",
  "surface",
  "typography"
] as const;

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@sail-ui/styles/css": resolvePath("../../packages/styles/index.css"),
      "@sail-ui/styles": resolvePath("../../packages/styles/src/index.ts"),
      "@sail-ui/primitives": resolvePath("../../packages/primitives/src/index.ts"),
      ...Object.fromEntries(
        componentAliases.map((component) => [
          `@sail-ui/vue/${component}`,
          resolvePath(`../../packages/vue/src/components/${component}/index.ts`)
        ])
      ),
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
