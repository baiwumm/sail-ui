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
const upstreamRoot = join(packageRoot, "upstream");
const upstreamComponents = join(upstreamRoot, "components");
const generatedRoot = join(packageRoot, "generated");
const attributesPath = join(packageRoot, "contracts", "attributes.json");
const scopePath = join(packageRoot, "contracts", "scope.json");
const manifestPath = join(packageRoot, "manifest.json");

const UPSTREAM = {
  version: "3.2.7",
  commit: "89cd95ec17dfbbf952ef0d61af300f287aec223d"
};

const checkMode = process.argv.includes("--check");
const attributes = JSON.parse(readFileSync(attributesPath, "utf8"));
const scope = new Set(JSON.parse(readFileSync(scopePath, "utf8")).components);

const hash = (value) => createHash("sha256").update(value).digest("hex");
const toPosix = (value) => value.split("\\").join("/");

function listFiles(root, extension) {
  return readdirSync(root, {recursive: true, withFileTypes: true})
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function collectAttributeNames(css) {
  const names = new Set();
  const regex = /\[(data-[a-z0-9-]+)(?:\s*[~|^$*]?=\s*(?:"[^"]*"|'[^']*'|[^\]]+))?\]/g;
  let match;

  while ((match = regex.exec(css))) {
    names.add(match[1]);
  }

  return names;
}

function aliasNode(alias) {
  const root = selectorParser().astSync(alias);

  return root.nodes[0]?.nodes[0]?.clone();
}

function expandSelector(selector, siblings = []) {
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

    // Only expand positive state selectors. Aliases inside :not() would invert
    // the meaning and are handled by the component emitting the upstream value.
    if (attributeNode.parent?.type !== "selector") {
      continue;
    }

    for (const alias of config.map) {
      // Upstream may already scope the native pseudo-class, e.g.
      // `:focus-visible:not([data-focused])`. Appending a bare `:focus-visible`
      // would broaden that rule and re-enable rings React suppresses.
      if (alias.startsWith(":") && siblings.some((sibling) => sibling.includes(alias))) {
        continue;
      }

      const replacement = aliasNode(alias);

      if (!replacement) {
        continue;
      }

      const clone = selectorNode.clone();
      const target = clone.nodes.find(
        (node) => node.type === "attribute" && node.attribute === attributeNode.attribute
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

function transformComponentCss(css) {
  const root = postcss.parse(css);
  let aliasCount = 0;

  root.walkRules((rule) => {
    if (!rule.selectors?.length) {
      return;
    }

    const current = [...rule.selectors];
    const additions = [];

    for (const selector of current) {
      additions.push(...expandSelector(selector, current));
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

const componentFiles = listFiles(upstreamComponents, ".css");
const generatedFiles = new Map();
const fileEntries = [];
const scopedAttributes = new Set();

for (const sourceFile of componentFiles) {
  const name = relative(upstreamComponents, sourceFile);
  const component = name.replace(/\.css$/, "").split(/[/\\]/)[0];
  const sourceCss = readFileSync(sourceFile, "utf8");
  const sourceAttributes = collectAttributeNames(sourceCss);

  let generatedCss = sourceCss;
  let aliasCount = 0;

  if (scope.has(component)) {
    sourceAttributes.forEach((attribute) => scopedAttributes.add(attribute));

    const result = transformComponentCss(sourceCss);

    generatedCss = result.css;
    aliasCount = result.aliasCount;
  }

  generatedFiles.set(toPosix(join("generated", "components", name)), generatedCss);
  fileEntries.push({
    path: toPosix(join("components", name)),
    sourceHash: hash(sourceCss),
    generatedHash: hash(generatedCss),
    aliases: aliasCount,
    scoped: scope.has(component)
  });
}

// Generated component files keep the upstream file layout and import order.
generatedFiles.set(
  toPosix(join("generated", "components", "index.css")),
  readFileSync(join(upstreamComponents, "index.css"), "utf8")
);

for (const attribute of scopedAttributes) {
  if (!attributes[attribute]) {
    throw new Error(
      `Scoped CSS uses unowned attribute ${attribute}. Add it to contracts/attributes.json.`
    );
  }
}

// T01 only enforces owners for the four spike components. Files outside the
// scope are copied verbatim and their attributes are recorded for Ticket 02.
const upstreamCssFiles = listFiles(upstreamRoot, ".css");
const pendingAttributes = new Map();

for (const file of upstreamCssFiles) {
  const attributesInFile = collectAttributeNames(readFileSync(file, "utf8"));

  for (const attribute of attributesInFile) {
    if (!attributes[attribute]) {
      const owners = pendingAttributes.get(attribute) ?? new Set();
      owners.add(toPosix(relative(upstreamRoot, file)));
      pendingAttributes.set(attribute, owners);
    }
  }
}

const manifest = {
  upstream: UPSTREAM,
  files: fileEntries,
  aliases: fileEntries.reduce((total, file) => total + file.aliases, 0),
  scope: [...scope].sort(),
  pendingAttributes: Object.fromEntries(
    [...pendingAttributes.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([attribute, files]) => [attribute, [...files].sort()])
  )
};

function expectedManifest() {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

if (checkMode) {
  const errors = [];

  if (!existsSync(manifestPath)) {
    errors.push("manifest.json is missing");
  } else if (readFileSync(manifestPath, "utf8") !== expectedManifest()) {
    errors.push("manifest.json does not match the upstream snapshot");
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
    console.error("gen-compat check failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(
    `gen-compat check passed: ${fileEntries.length} component files, ${manifest.aliases} aliases, ${Object.keys(manifest.pendingAttributes).length} pending attributes`
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
  `gen-compat wrote ${fileEntries.length} component files, ${manifest.aliases} aliases, ${Object.keys(manifest.pendingAttributes).length} pending attributes`
);
