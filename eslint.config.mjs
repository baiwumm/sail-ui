import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.nuxt/**",
      "**/.output/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/test-results/**",
      "**/playwright-report/**",
      "packages/styles/upstream/**",
      "packages/styles/generated/**",
      "**/*.css",
      "pnpm-lock.yaml",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-undef": "off",
      "vue/multi-word-component-names": "off",
      // Prettier owns the template formatting. These three stylistic rules
      // would fight every Prettier run, so they are aligned with it:
      // Prettier keeps the attributes of an element on one line when they
      // fit, prints void elements as `<input />` and keeps short element
      // content on one line.
      "vue/html-self-closing": [
        "warn",
        {
          html: {normal: "always", void: "always"},
          svg: "always",
        },
      ],
      "vue/max-attributes-per-line": [
        "warn",
        {
          multiline: {max: 1},
          singleline: {max: 100},
        },
      ],
      "vue/singleline-html-element-content-newline": "off",
      "vue/no-v-html": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["**/__tests__/**", "**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "vue/one-component-per-file": "off",
      "vue/no-reserved-component-names": "off",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
);
