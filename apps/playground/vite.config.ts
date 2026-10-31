import {fileURLToPath, URL} from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vite";

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const componentAliases = [
  "accordion",
  "alert",
  "alert-dialog",
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
  "disclosure",
  "disclosure-group",
  "drawer",
  "dropdown",
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
  "list-box",
  "list-box-item",
  "list-box-section",
  "menu",
  "menu-item",
  "menu-section",
  "modal",
  "number-field",
  "pagination",
  "popover",
  "progress-bar",
  "progress-circle",
  "radio",
  "radio-group",
  "search-field",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "spinner",
  "surface",
  "switch",
  "switch-group",
  "tabs",
  "tag",
  "tag-group",
  "textarea",
  "toast",
  "toggle-button",
  "toggle-button-group",
  "toolbar",
  "tooltip",
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
