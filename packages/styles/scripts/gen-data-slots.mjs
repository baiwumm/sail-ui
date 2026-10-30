import {execFileSync} from "node:child_process";
import {existsSync, readFileSync, readdirSync, writeFileSync} from "node:fs";
import {basename, dirname, join, resolve} from "node:path";

const packageRoot = resolve(import.meta.dirname, "..");
const pinPath = join(packageRoot, "contracts", "upstream.json");
const snapshotPath = join(packageRoot, "contracts", "data-slots.json");

const args = process.argv.slice(2);
const checkMode = args.includes("--check");
const sourceArgIndex = args.indexOf("--source");
const sourceArg =
  sourceArgIndex >= 0 ? args[sourceArgIndex + 1] : process.env.HEROUI_COMPONENTS_DIR;
const pin = JSON.parse(readFileSync(pinPath, "utf8"));

const SLOT_PATTERN =
  /["']?data-slot["']?\s*[=:]\s*(["'`])([^"'`$]+)\1/g;
const EXCLUDED_DIRECTORIES = new Set(["rac"]);
const EXCLUDED_FILES = /(?:^icons\.tsx$|\.(?:stories|test|spec)\.tsx?$|\.d\.ts$)/;

function resolveComponentsDir(input) {
  const candidates = [
    resolve(input, "packages", "react", "src", "components"),
    resolve(input, "src", "components"),
    resolve(input)
  ];
  const found = candidates.find(
    (candidate) => existsSync(candidate) && readdirSync(candidate).length > 0
  );

  if (!found) {
    throw new Error(
      `Cannot find HeroUI components at ${input}. Pass --source <path-to-heroui-repo-or-components-dir>.`
    );
  }

  return found;
}

function findGitRoot(input) {
  let current = resolve(input);

  while (true) {
    if (existsSync(join(current, ".git"))) {
      return current;
    }

    const parent = dirname(current);

    if (parent === current) {
      return null;
    }

    current = parent;
  }
}

function verifySourceCommit(componentsDir) {
  const gitRoot = findGitRoot(componentsDir);

  if (!gitRoot) {
    return;
  }

  let head = "";

  try {
    head = execFileSync("git", ["-C", gitRoot, "rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return;
  }

  if (head && head !== pin.commit) {
    throw new Error(
      `Source commit ${head} does not match the pinned ${pin.commit}. ` +
        "Use the pinned HeroUI checkout before regenerating the data-slot snapshot."
    );
  }
}

function listSourceFiles(root) {
  return readdirSync(root, {recursive: true, withFileTypes: true})
    .filter((entry) => entry.isFile())
    .filter((entry) => /\.tsx?$/.test(entry.name))
    .filter((entry) => !EXCLUDED_FILES.test(entry.name))
    .filter((entry) => {
      const segments = entry.parentPath.split(/[\\/]/);
      const relative = segments.slice(segments.indexOf(basename(root)) + 1);

      return !relative.some((segment) => EXCLUDED_DIRECTORIES.has(segment));
    })
    .map((entry) => entry.parentPath + "/" + entry.name);
}

function extractSlots(componentsDir) {
  const byComponent = new Map();
  const owners = new Map();

  for (const file of listSourceFiles(componentsDir)) {
    const relative = file.slice(componentsDir.length + 1).split("\\").join("/");
    const component = relative.split("/")[0];
    const source = readFileSync(file, "utf8");

    for (const match of source.matchAll(SLOT_PATTERN)) {
      const slot = match[2].trim();

      if (!slot || slot.includes("$")) {
        continue;
      }

      if (owners.has(slot) && owners.get(slot) !== component) {
        throw new Error(
          `data-slot "${slot}" is defined in both ${owners.get(slot)} and ${component}; ` +
            "the snapshot groups slots by a single component."
        );
      }

      owners.set(slot, component);

      if (!byComponent.has(component)) {
        byComponent.set(component, new Set());
      }

      byComponent.get(component).add(slot);
    }
  }

  const components = {};

  for (const [component, slots] of [...byComponent].sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    components[component] = [...slots].sort((a, b) => a.localeCompare(b));
  }

  return {
    upstream: {
      version: pin.version,
      commit: pin.commit
    },
    source: "packages/react/src/components",
    total: Object.values(components).reduce((total, slots) => total + slots.length, 0),
    components
  };
}

function validateSnapshot(snapshot) {
  const errors = [];

  if (snapshot.upstream?.version !== pin.version || snapshot.upstream?.commit !== pin.commit) {
    errors.push("upstream version/commit does not match contracts/upstream.json");
  }

  const slots = [];
  const components = snapshot.components ?? {};

  for (const [component, values] of Object.entries(components)) {
    if (!Array.isArray(values) || values.length === 0) {
      errors.push(`${component} has no data-slot values`);
      continue;
    }

    const sorted = [...values].sort((a, b) => a.localeCompare(b));

    if (JSON.stringify(values) !== JSON.stringify(sorted)) {
      errors.push(`${component} data-slot values are not sorted`);
    }

    for (const value of values) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) {
        errors.push(`${component} has an invalid data-slot value: ${value}`);
      }

      slots.push(value);
    }
  }

  const unique = new Set(slots);

  if (unique.size !== slots.length) {
    const duplicates = slots.filter((value, index) => slots.indexOf(value) !== index);
    errors.push(`duplicate data-slot values: ${[...new Set(duplicates)].join(", ")}`);
  }

  if (snapshot.total !== slots.length) {
    errors.push(`total is ${snapshot.total}, but the grouped values add up to ${slots.length}`);
  }

  if (errors.length) {
    throw new Error(`Invalid data-slot snapshot:\n- ${errors.join("\n- ")}`);
  }

  return slots.length;
}

if (!sourceArg) {
  if (!checkMode) {
    throw new Error("gen-data-slots needs --source <heroui repo or components dir>.");
  }

  if (!existsSync(snapshotPath)) {
    throw new Error(`${snapshotPath} is missing.`);
  }

  const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
  const total = validateSnapshot(snapshot);

  console.log(
    `data-slots snapshot is valid: ${total} unique values across ${Object.keys(snapshot.components).length} components`
  );
  process.exit(0);
}

const componentsDir = resolveComponentsDir(sourceArg);

verifySourceCommit(componentsDir);

const extracted = extractSlots(componentsDir);
const expected = `${JSON.stringify(extracted, null, 2)}\n`;
const total = validateSnapshot(extracted);

if (checkMode) {
  if (!existsSync(snapshotPath)) {
    throw new Error(`${snapshotPath} is missing.`);
  }

  if (readFileSync(snapshotPath, "utf8") !== expected) {
    throw new Error(
      `data-slots.json is stale. Run pnpm --filter @sail-ui/styles gen:slots -- --source ${sourceArg}.`
    );
  }

  console.log(
    `data-slots snapshot matches the source: ${total} unique values across ${Object.keys(extracted.components).length} components`
  );
  process.exit(0);
}

writeFileSync(snapshotPath, expected);
console.log(
  `data-slots wrote ${total} unique values across ${Object.keys(extracted.components).length} components`
);
