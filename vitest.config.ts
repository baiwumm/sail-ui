import {fileURLToPath, URL} from "node:url";

import vue from "@vitejs/plugin-vue";
import {defineConfig} from "vitest/config";

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const componentAliases = [
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
  "drawer",
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
  "textarea",
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
