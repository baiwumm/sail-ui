import {execSync} from "node:child_process";
import {mkdtempSync, readdirSync, rmSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const consumers = ["styles", "primitives", "vue", "nuxt"];

function run(command, options = {}) {
  execSync(command, {stdio: "inherit", ...options});
}

run("pnpm --filter @sail-ui/styles --filter @sail-ui/primitives --filter @sail-ui/vue build");

const tempDir = mkdtempSync(join(tmpdir(), "sail-ui-pack-check-"));

try {
  for (const name of consumers) {
    run(`pnpm pack --pack-destination ${JSON.stringify(tempDir)}`, {
      cwd: join(root, "packages", name),
    });
  }

  const tarballs = Object.fromEntries(
    readdirSync(tempDir)
      .filter((file) => file.endsWith(".tgz"))
      .map((file) => [file.replace(/-\d+\.\d+\.\d+\.tgz$/, ""), file]),
  );

  const dependencies = {
    "@nuxt/kit": "^4.6.3",
    "@sail-ui/nuxt": `file:./${tarballs["sail-ui-nuxt"]}`,
    "@sail-ui/primitives": `file:./${tarballs["sail-ui-primitives"]}`,
    "@sail-ui/styles": `file:./${tarballs["sail-ui-styles"]}`,
    "@sail-ui/vue": `file:./${tarballs["sail-ui-vue"]}`,
    "@vue/server-renderer": "3.5.44",
    typescript: "5.9.3",
    "reka-ui": "2.11.0",
    "tailwind-variants": "3.3.1",
    tailwindcss: "4.3.3",
    vue: "3.5.44",
  };

  writeFileSync(
    join(tempDir, "package.json"),
    JSON.stringify(
      {name: "sail-ui-pack-check", private: true, type: "module", dependencies},
      null,
      2,
    ),
  );

  writeFileSync(
    join(tempDir, "render.mjs"),
    `import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {renderToString} from "@vue/server-renderer";
import {buttonVariants} from "@sail-ui/styles";
import {Button} from "@sail-ui/vue/button";
import {createSSRApp, h} from "vue";

const html = await renderToString(
  createSSRApp({render: () => h(Button, {variant: "danger", size: "lg"}, {default: () => "Delete"})})
);

assert.match(html, /data-slot="button"/);
assert.match(html, /button--danger/);
assert.match(html, /button--lg/);
assert.ok(buttonVariants({variant: "danger"}).includes("button--danger"));
assert.ok(existsSync(new URL(import.meta.resolve("@sail-ui/styles/css"))));

const nuxtModule = await import("@sail-ui/nuxt");

assert.equal(typeof nuxtModule.default?.getMeta, "function");
const nuxtModuleMeta = await nuxtModule.default.getMeta();

assert.equal(nuxtModuleMeta.name, "@sail-ui/nuxt");
console.log("pack:check render ok");
`,
  );

  run("npm install --no-audit --no-fund --loglevel error", {cwd: tempDir});
  run("node render.mjs", {cwd: tempDir});
  run("node " + JSON.stringify(join(root, "scripts", "pack-check-types.mjs")), {
    env: {...process.env, SAIL_PACK_CHECK_DIR: tempDir},
  });
  console.log("pack:check passed");
} finally {
  if (process.env.SAIL_KEEP_PACK_CHECK) {
    console.log(`pack:check workspace kept at ${tempDir}`);
  } else {
    rmSync(tempDir, {recursive: true, force: true});
  }
}
