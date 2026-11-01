import {readdirSync, readFileSync, statSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

/**
 * vite-plugin-dts emits `import … from './accordion-root.vue'` specifiers that
 * plain TypeScript cannot resolve (only Volar can). Publishing needs resolvable
 * types, so each `.vue` specifier is rewritten to `.vue.js`, which TypeScript
 * maps to the emitted `accordion-root.vue.d.ts`.
 *
 * The plugin also resolves workspace aliases into relative paths into the
 * styles sources; published consumers must resolve them through the package
 * exports instead, so those specifiers are rewritten to package names.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "packages", "vue", "dist");

const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);

    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }

    if (!path.endsWith(".d.ts")) {
      continue;
    }

    const source = readFileSync(path, "utf8");

    let output = source.replaceAll(".vue'", ".vue.js'");
    output = output.replace(/'(?:\.\.\/)+styles\/src\/index(?:\.ts)?'/g, "'@sail-ui/styles'");
    output = output.replace(
      /'(?:\.\.\/)+primitives\/src\/index(?:\.ts)?'/g,
      "'@sail-ui/primitives'",
    );

    if (output !== source) {
      writeFileSync(path, output);
    }
  }
};

walk(root);
console.log("fix-vue-dts: rewrote .vue specifiers and workspace aliases");
