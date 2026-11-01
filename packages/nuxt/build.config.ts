import {defineBuildConfig} from "unbuild";

export default defineBuildConfig({
  // Declarations are emitted with tsc (see tsconfig.build.json) instead of
  // rollup-plugin-dts, which chases @nuxt/schema's deep Vite/postcss graphs.
  declaration: false,
  // tsc emits the declarations first and must survive the clean step.
  clean: false,
  entries: [
    // The module itself is bundled; it must stay a single resolvable entry.
    "src/module",
    // Runtime components keep their file layout so generated code can import
    // stable paths (`@sail-ui/nuxt/runtime/provider`).
    {
      builder: "mkdist",
      input: "./src/runtime",
      outDir: "dist/runtime",
      format: "esm",
      pattern: ["**/*.ts"],
    },
  ],
  externals: [
    "@nuxt/kit",
    "@sail-ui/styles",
    "@sail-ui/vue",
    "@tailwindcss/vite",
    "nuxt",
    "reka-ui",
    // The module types reference @nuxt/schema, which re-exports Vite types;
    // keeping them external avoids bundling those declaration graphs.
    "vite",
    "vue",
  ],
});
