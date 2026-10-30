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
  "button-group",
  "card",
  "checkbox",
  "checkbox-group",
  "chip",
  "close-button",
  "description",
  "empty-state",
  "error-message",
  "field-error",
  "fieldset",
  "form",
  "header",
  "input",
  "input-group",
  "kbd",
  "label",
  "link",
  "modal",
  "number-field",
  "progress-bar",
  "progress-circle",
  "radio",
  "radio-group",
  "search-field",
  "select",
  "separator",
  "skeleton",
  "slider",
  "spinner",
  "surface",
  "switch",
  "switch-group",
  "textarea",
  "toggle-button",
  "toggle-button-group",
  "toolbar",
  "typography",
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
          resolvePath(`../../packages/vue/src/components/${component}/index.ts`),
        ]),
      ),
      "@sail-ui/vue": resolvePath("../../packages/vue/src/index.ts"),
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
