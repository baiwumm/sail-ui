import {createHash} from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import {dirname, join, relative, resolve} from "node:path";

import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

const packageRoot = resolve(import.meta.dirname, "..");
const defaultUpstreamRoot = join(packageRoot, "upstream");
const generatedRoot = join(packageRoot, "generated");
const contractsRoot = join(packageRoot, "contracts");
const attributesPath = join(contractsRoot, "attributes.json");
const scopePath = join(contractsRoot, "scope.json");
const pinPath = join(contractsRoot, "upstream.json");
const dataSlotsPath = join(contractsRoot, "data-slots.json");
const manifestPath = join(packageRoot, "manifest.json");

const OWNERS = ["compat", "component", "native", "reka"];

const args = process.argv.slice(2);
const checkMode = args.includes("--check");
const customUpstreamRoot = readOption("--upstream-root");
const upstreamRoot = customUpstreamRoot
  ? resolve(customUpstreamRoot)
  : defaultUpstreamRoot;
const upstreamComponents = join(upstreamRoot, "components");

if (customUpstreamRoot && !checkMode) {
  die("--upstream-root is only supported with --check.");
}

const hash = (value) => createHash("sha256").update(value).digest("hex");
const toPosix = (value) => value.split("\\").join("/");

function readOption(name) {
  const index = args.indexOf(name);

  if (index === -1) {
    return undefined;
  }

  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    die(`${name} requires a path.`);
  }

  return value;
}

function die(message) {
  console.error(message);
  process.exit(1);
}

function readText(path) {
  if (!existsSync(path)) {
    die(`${toPosix(relative(packageRoot, path))} is missing.`);
  }

  return readFileSync(path, "utf8");
}

function readJson(path) {
  try {
    return JSON.parse(readText(path));
  } catch (error) {
    die(
      `${toPosix(relative(packageRoot, path))} is not valid JSON: ${error.message}`
    );
  }
}

function listFiles(root, extension) {
  return readdirSync(root, {recursive: true, withFileTypes: true})
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function collectAttributeNames(css) {
  const names = new Set();
  const regex =
    /\[(data-[a-z0-9-]+)(?:\s*[~|^$*]?=\s*(?:"[^"]*"|'[^']*'|[^\]]+))?\]/g;
  let match;

  while ((match = regex.exec(css))) {
    names.add(match[1]);
  }

  return names;
}

function componentNameFromPath(path) {
  const match = /^components\/([^/]+)\.css$/.exec(path);

  return match && match[1] !== "index" ? match[1] : undefined;
}

function assertNoDuplicateKeys(text) {
  const seen = new Set();
  const regex = /^ {2}"([^"]+)":\s*\{/gm;
  let match;

  while ((match = regex.exec(text))) {
    if (seen.has(match[1])) {
      die(
        `Duplicate attribute in contracts/attributes.json: ${match[1]}\n` +
          "Keep exactly one owner per data attribute."
      );
    }

    seen.add(match[1]);
  }
}

const pin = readJson(pinPath);

if (!pin.version || !pin.commit) {
  die("contracts/upstream.json must record version and commit.");
}

const attributesText = readText(attributesPath);
assertNoDuplicateKeys(attributesText);

const attributes = readJson(attributesPath);
const scope = readJson(scopePath);

if (!Array.isArray(scope.components) || scope.components.length === 0) {
  die("contracts/scope.json must list components.");
}

if (new Set(scope.components).size !== scope.components.length) {
  die("contracts/scope.json contains duplicate components.");
}

const scopeSet = new Set(scope.components);

const dataSlotsText = readText(dataSlotsPath);
const dataSlots = readJson(dataSlotsPath);

if (
  dataSlots.upstream?.version !== pin.version ||
  dataSlots.upstream?.commit !== pin.commit
) {
  die(
    "contracts/data-slots.json is pinned to a different upstream.\n" +
      "Run node scripts/gen-data-slots.mjs against the pinned source."
  );
}

const slotTotal = Object.values(dataSlots.components ?? {}).reduce(
  (total, slots) => total + slots.length,
  0
);

if (slotTotal !== dataSlots.total) {
  die(
    `contracts/data-slots.json total is ${dataSlots.total}, but the groups sum to ${slotTotal}.`
  );
}

const componentFiles = listFiles(upstreamComponents, ".css");
const componentNames = componentFiles
  .map((file) => toPosix(relative(upstreamComponents, file)))
  .map((name) => name.replace(/\.css$/, "").split("/")[0])
  .filter((name) => name !== "index");

for (const name of componentNames) {
  if (!scopeSet.has(name)) {
    die(
      `components/${name}.css is not listed in contracts/scope.json.\n` +
        "Every upstream component CSS file must be scoped before generating compat output."
    );
  }
}

for (const name of scopeSet) {
  if (!componentNames.includes(name)) {
    die(
      `contracts/scope.json lists ${name}, but components/${name}.css does not exist upstream.`
    );
  }
}

for (const [name, config] of Object.entries(attributes)) {
  if (!/^data-[a-z0-9-]+$/.test(name)) {
    die(`Invalid data attribute name: ${name}`);
  }

  if (!OWNERS.includes(config.owner)) {
    die(
      `Unknown owner "${config.owner}" for ${name}.\n` +
        `Choose one of: ${OWNERS.join(", ")}.`
    );
  }

  for (const key of Object.keys(config)) {
    if (!["owner", "map", "except", "notes"].includes(key)) {
      die(`Unknown key "${key}" in ${name}.`);
    }
  }

  if (config.map !== undefined) {
    if (config.owner !== "compat") {
      die(
        `${name} declares map but its owner is ${config.owner}; only compat aliases expand.`
      );
    }

    if (!Array.isArray(config.map) || config.map.length === 0) {
      die(`${name} must declare a non-empty map array.`);
    }

    if (new Set(config.map).size !== config.map.length) {
      die(`${name} declares duplicate aliases.`);
    }

    for (const alias of config.map) {
      try {
        selectorParser().astSync(alias);
      } catch {
        die(`${name} declares an invalid alias selector: ${alias}`);
      }
    }
  } else if (config.owner === "compat") {
    die(`${name} is owned by compat but declares no map.`);
  }

  if (config.except !== undefined) {
    if (config.owner !== "compat") {
      die(`${name} declares except but its owner is ${config.owner}.`);
    }

    if (
      !Array.isArray(config.except) ||
      config.except.length === 0 ||
      new Set(config.except).size !== config.except.length
    ) {
      die(`${name} must declare a unique, non-empty except list.`);
    }

    for (const component of config.except) {
      if (!scopeSet.has(component)) {
        die(`${name} except references unknown component: ${component}`);
      }
    }
  }
}

const upstreamCssFiles = listFiles(upstreamRoot, ".css");
const usage = new Map();
const upstreamFiles = [];

for (const file of upstreamCssFiles) {
  const path = toPosix(relative(upstreamRoot, file));
  const css = readFileSync(file, "utf8");

  upstreamFiles.push({path, hash: hash(css)});

  for (const attribute of collectAttributeNames(css)) {
    if (!attributes[attribute]) {
      die(
        `Unknown data attribute: ${attribute} (${path})\n` +
          "Choose an owner in packages/styles/contracts/attributes.json"
      );
    }

    if (!usage.has(attribute)) {
      usage.set(attribute, {files: new Set(), components: new Set()});
    }

    const entry = usage.get(attribute);
    entry.files.add(path);

    const component = componentNameFromPath(path);

    if (component) {
      entry.components.add(component);
    }
  }
}

for (const attribute of Object.keys(attributes)) {
  if (!usage.has(attribute)) {
    die(
      `Declared data attribute is not used by upstream CSS: ${attribute}\n` +
        "Remove it from contracts/attributes.json or fix its spelling."
    );
  }
}

function aliasNode(alias) {
  const root = selectorParser().astSync(alias);

  return root.nodes[0]?.nodes[0]?.clone();
}

function expandSelector(selector, siblings, component) {
  if (!selector.includes("[data-")) {
    return [];
  }

  const root = selectorParser().astSync(selector);
  const selectorNode = root.nodes[0];

  if (!selectorNode) {
    return [];
  }

  const additions = [];
  const attributesInSelector = selectorNode.nodes.filter(
    (node) => node.type === "attribute" && node.attribute.startsWith("data-")
  );

  for (const attributeNode of attributesInSelector) {
    const config = attributes[attributeNode.attribute];

    if (!config || config.owner !== "compat" || !Array.isArray(config.map)) {
      continue;
    }

    if (config.except?.includes(component)) {
      continue;
    }

    // Only expand positive state selectors. Aliases inside :not() would invert
    // the meaning and are handled by the component emitting the upstream value.
    if (attributeNode.parent?.type !== "selector") {
      continue;
    }

    for (const alias of config.map) {
      // Upstream may already scope the native pseudo-class, e.g.
      // `:focus-visible:not([data-focused])`. Appending a bare `:focus-visible`
      // would broaden that rule and re-enable rings React suppresses.
      if (
        alias.startsWith(":") &&
        siblings.some((sibling) => sibling.includes(alias))
      ) {
        continue;
      }

      const replacement = aliasNode(alias);

      if (!replacement) {
        continue;
      }

      const clone = selectorNode.clone();
      const target = clone.nodes.find(
        (node) =>
          node.type === "attribute" && node.attribute === attributeNode.attribute
      );

      if (!target) {
        continue;
      }

      target.replaceWith(replacement);
      additions.push(clone.toString());
    }
  }

  return additions;
}

function transformComponentCss(css, component) {
  const root = postcss.parse(css);
  let aliasCount = 0;

  root.walkRules((rule) => {
    if (!rule.selectors?.length) {
      return;
    }

    const current = [...rule.selectors];
    const additions = [];

    for (const selector of current) {
      additions.push(...expandSelector(selector, current, component));
    }

    const merged = [...new Set([...current, ...additions])];

    if (merged.length !== current.length) {
      rule.selectors = merged;
      aliasCount += merged.length - current.length;
    }
  });

  return {
    css: root.toString(),
    aliasCount
  };
}

const generatedFiles = new Map();
const fileEntries = [];
let aliasTotal = 0;

for (const sourceFile of componentFiles) {
  const name = toPosix(relative(upstreamComponents, sourceFile));
  const component = name.replace(/\.css$/, "").split("/")[0];
  const sourceCss = readFileSync(sourceFile, "utf8");
  const scoped = component !== "index" && scopeSet.has(component);

  let generatedCss = sourceCss;
  let aliasCount = 0;

  if (scoped) {
    const result = transformComponentCss(sourceCss, component);

    generatedCss = result.css;
    aliasCount = result.aliasCount;
  }

  aliasTotal += aliasCount;

  generatedFiles.set(`generated/components/${name}`, generatedCss);
  fileEntries.push({
    path: `components/${name}`,
    component,
    sourceHash: hash(sourceCss),
    generatedHash: hash(generatedCss),
    aliases: aliasCount,
    scoped
  });
}

const manifest = {
  upstream: {
    version: pin.version,
    commit: pin.commit
  },
  dataSlots: {
    total: dataSlots.total,
    components: Object.keys(dataSlots.components).length,
    hash: hash(dataSlotsText)
  },
  counts: {
    upstreamCssFiles: upstreamCssFiles.length,
    componentCssFiles: componentFiles.length,
    scopedComponents: scopeSet.size,
    attributes: Object.keys(attributes).length,
    aliases: aliasTotal
  },
  owners: Object.fromEntries(
    OWNERS.map((owner) => [
      owner,
      Object.values(attributes).filter((config) => config.owner === owner).length
    ])
  ),
  attributes: Object.fromEntries(
    Object.keys(attributes)
      .sort()
      .map((name) => {
        const config = attributes[name];
        const entry = {owner: config.owner};

        if (config.map) {
          entry.map = config.map;
        }

        if (config.except) {
          entry.except = [...config.except].sort();
        }

        entry.files = [...usage.get(name).files].sort();
        entry.components = [...usage.get(name).components].sort();

        return [name, entry];
      })
  ),
  files: fileEntries,
  upstreamFiles
};

function expectedManifest() {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function reportErrors(errors) {
  console.error("gen-compat check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

if (checkMode) {
  const errors = [];

  if (!existsSync(manifestPath)) {
    errors.push("manifest.json is missing");
  } else {
    const committedText = readFileSync(manifestPath, "utf8");
    let committed;

    try {
      committed = JSON.parse(committedText);
    } catch (error) {
      die(`manifest.json is not valid JSON: ${error.message}`);
    }

    if (committedText !== expectedManifest()) {
      errors.push("manifest.json does not match the upstream snapshot");
    }

    if (Array.isArray(committed.upstreamFiles)) {
      const recorded = new Map(
        committed.upstreamFiles.map((file) => [file.path, file.hash])
      );
      const current = new Map(
        manifest.upstreamFiles.map((file) => [file.path, file.hash])
      );

      for (const [path, currentHash] of current) {
        if (!recorded.has(path)) {
          errors.push(`${path} is a new upstream file; run pnpm sync:styles`);
        } else if (recorded.get(path) !== currentHash) {
          errors.push(`${path} changed upstream; run pnpm sync:styles`);
        }
      }

      for (const path of recorded.keys()) {
        if (!current.has(path)) {
          errors.push(`${path} was removed upstream; run pnpm sync:styles`);
        }
      }
    }
  }

  for (const [path, content] of generatedFiles) {
    const absolute = join(packageRoot, path);

    if (!existsSync(absolute)) {
      errors.push(`${path} is missing`);
      continue;
    }

    if (readFileSync(absolute, "utf8") !== content) {
      errors.push(`${path} is stale`);
    }
  }

  const expectedPaths = new Set(generatedFiles.keys());
  const actualPaths = existsSync(generatedRoot)
    ? listFiles(generatedRoot, ".css").map((file) =>
        toPosix(relative(packageRoot, file))
      )
    : [];

  for (const path of actualPaths) {
    if (!expectedPaths.has(path)) {
      errors.push(`${path} is not generated by the current snapshot`);
    }
  }

  if (errors.length) {
    reportErrors(errors);
  }

  console.log(
    `gen-compat check passed: ${manifest.counts.upstreamCssFiles} upstream CSS files, ` +
      `${manifest.counts.scopedComponents} scoped components, ` +
      `${manifest.counts.attributes} attributes (${manifest.owners.compat} compat), ` +
      `${manifest.counts.aliases} aliases, ${manifest.dataSlots.total} data slots`
  );
  process.exit(0);
}

rmSync(generatedRoot, {recursive: true, force: true});

for (const [path, content] of generatedFiles) {
  const absolute = join(packageRoot, path);

  mkdirSync(dirname(absolute), {recursive: true});
  writeFileSync(absolute, content);
}

writeFileSync(manifestPath, expectedManifest());

console.log(
  `gen-compat wrote ${manifest.counts.componentCssFiles} component files, ` +
    `${manifest.counts.scopedComponents} scoped components, ` +
    `${manifest.counts.attributes} attributes (${manifest.owners.compat} compat), ` +
    `${manifest.counts.aliases} aliases, ${manifest.dataSlots.total} data slots`
);
