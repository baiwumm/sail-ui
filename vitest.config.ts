import {fileURLToPath, URL} from "node:url";

import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vitest/config";

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
  "calendar",
  "calendar-year-picker",
  "card",
  "checkbox",
  "checkbox-group",
  "chip",
  "close-button",
  "color-area",
  "color-field",
  "color-picker",
  "color-slider",
  "color-swatch",
  "color-swatch-picker",
  "date-field",
  "date-picker",
  "date-range-picker",
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
  "range-calendar",
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
  "time-field",
  "toast",
  "toggle-button",
  "toggle-button-group",
  "toolbar",
  "tooltip",
  "typography",
] as const;

const alias = {
  "@sail-ui/styles": resolvePath("./packages/styles/src/index.ts"),
  "@sail-ui/primitives": resolvePath("./packages/primitives/src/index.ts"),
  ...Object.fromEntries(
    componentAliases.map((component) => [
      `@sail-ui/vue/${component}`,
      resolvePath(`./packages/vue/src/components/${component}/index.ts`),
    ]),
  ),
  "@sail-ui/vue": resolvePath("./packages/vue/src/index.ts"),
  "@sail-ui/testing": resolvePath("./packages/testing/src/index.ts"),
};

const shared = {
  globals: true,
  restoreMocks: true,
  clearMocks: true,
  mockReset: true,
};

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias,
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
          include: ["packages/**/__tests__/**/*.unit.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          ...shared,
          name: "contract",
          environment: "jsdom",
          setupFiles: [resolvePath("./tests/setup.ts")],
          include: ["packages/**/__tests__/**/*.contract.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          ...shared,
          name: "ssr",
          environment: "node",
          include: ["packages/**/__tests__/**/*.ssr.test.ts"],
        },
      },
    ],
  },
});
