import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from "node:fs";
import {dirname, join, relative, resolve} from "node:path";

const packageRoot = resolve(import.meta.dirname, "..");
const upstreamRoot = join(packageRoot, "upstream");
const pinPath = join(packageRoot, "contracts", "upstream.json");
const dataSlotsPath = join(packageRoot, "contracts", "data-slots.json");
const manifestPath = join(packageRoot, "manifest.json");
const defaultSource = resolve(packageRoot, "../../..", "heroui");

const args = process.argv.slice(2);
const checkMode = args.includes("--check");
const allowUpstreamChange = args.includes("--allow-upstream-change");
const sourceArg = readOption("--source");
const commitArg = readOption("--commit");
const sourceRoot = resolve(sourceArg ?? defaultSource);

if (checkMode && (sourceArg || allowUpstreamChange || commitArg)) {
  die("--check does not read a source; run sync without --check to copy files.");
}

if (commitArg && !allowUpstreamChange) {
  die("--commit requires --allow-upstream-change.");
}

const normalizeNewlines = (value) => value.toString("utf8").replace(/\r\n/g, "\n");
const hash = (value) => createHash("sha256").update(normalizeNewlines(value)).digest("hex");
const toPosix = (value) => value.split("\\").join("/");

function readOption(name) {
  const index = args.indexOf(name);

  if (index === -1) {
    return undefined;
  }

  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    die(`${name} requires a value.`);
  }

  return value;
}

function die(message) {
  console.error(message);
  process.exit(1);
}

function readJson(path) {
  if (!existsSync(path)) {
    die(`${toPosix(relative(packageRoot, path))} is missing.`);
  }

  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    die(`${toPosix(relative(packageRoot, path))} is not valid JSON: ${error.message}`);
  }
}

function listFiles(root) {
  return readdirSync(root, {recursive: true, withFileTypes: true})
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .filter(
      (file) =>
        !toPosix(relative(root, file))
          .split("/")
          .some((segment) => ["node_modules", "dist", ".turbo"].includes(segment)),
    )
    .sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function collectSnapshot(root) {
  const files = new Map();

  for (const file of listFiles(root)) {
    const path = toPosix(relative(root, file));

    files.set(path, readFileSync(file));
  }

  return files;
}

function git(repository, ...gitArgs) {
  try {
    return execFileSync("git", ["-C", repository, ...gitArgs], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    die(`git ${gitArgs.join(" ")} failed in ${repository}: ${error.message}`);
  }
}

function resolveStylesDir(source) {
  const candidates = [source, join(source, "packages", "styles")];

  for (const candidate of candidates) {
    const packageJson = join(candidate, "package.json");

    if (existsSync(packageJson)) {
      const manifest = readJson(packageJson);

      if (manifest.name === "@heroui/styles") {
        return candidate;
      }
    }
  }

  die(
    `Cannot find @heroui/styles at ${source}.\n` +
      "Pass --source <path-to-heroui-checkout> or --source <path-to-packages/styles>.",
  );
}

function collectSourceFiles(stylesDir, repository) {
  const files = new Map();

  for (const file of listFiles(stylesDir)) {
    const path = toPosix(relative(stylesDir, file));

    if (path.endsWith(".css") || path === "README.md") {
      files.set(path, readFileSync(file));
    }
  }

  const license = join(stylesDir, "LICENSE");
  const repositoryLicense = join(repository, "LICENSE");
  const licensePath = existsSync(license) ? license : repositoryLicense;

  if (!existsSync(licensePath)) {
    die("Cannot find LICENSE in the upstream checkout.");
  }

  files.set("LICENSE", readFileSync(licensePath));

  return files;
}

function assertCleanSource(repository, stylesDir) {
  const relativeStyles = toPosix(relative(repository, stylesDir));
  const status = git(repository, "status", "--porcelain", "--", relativeStyles);

  if (status) {
    die(
      "Refusing to overwrite the snapshot: the upstream checkout has uncommitted changes.\n" +
        status
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n"),
    );
  }
}

function checkSnapshot() {
  const pin = readJson(pinPath);
  const manifest = readJson(manifestPath);
  const dataSlots = readJson(dataSlotsPath);
  const errors = [];

  if (manifest.upstream?.version !== pin.version || manifest.upstream?.commit !== pin.commit) {
    errors.push("manifest.json is pinned to a different upstream than contracts/upstream.json.");
  }

  if (dataSlots.upstream?.version !== pin.version || dataSlots.upstream?.commit !== pin.commit) {
    errors.push("contracts/data-slots.json is pinned to a different upstream.");
  }

  if (!Array.isArray(manifest.upstreamFiles)) {
    errors.push("manifest.json does not record upstreamFiles.");
  } else {
    const recorded = new Map(manifest.upstreamFiles.map((file) => [file.path, file.hash]));
    const actual = collectSnapshot(upstreamRoot);

    for (const path of ["LICENSE", "README.md"]) {
      if (!actual.has(path)) {
        errors.push(`upstream/${path} is missing`);
      }
    }

    for (const path of actual.keys()) {
      if (!recorded.has(path) && path !== "LICENSE" && path !== "README.md") {
        errors.push(`upstream/${path} is not part of the pinned snapshot`);
      }
    }

    for (const [path, expectedHash] of recorded) {
      if (!actual.has(path)) {
        errors.push(`upstream/${path} is missing`);
      } else if (hash(actual.get(path)) !== expectedHash) {
        errors.push(`upstream/${path} does not match the pinned hash`);
      }
    }
  }

  if (errors.length) {
    console.error("sync:styles check failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(
    `sync:styles check passed: ${manifest.upstreamFiles.length} CSS files, ` +
      "LICENSE and README match the pin, " +
      `${pin.package} ${pin.version} @ ${pin.commit.slice(0, 9)}`,
  );
}

function syncSnapshot() {
  const stylesDir = resolveStylesDir(sourceRoot);
  const sourcePackage = readJson(join(stylesDir, "package.json"));
  const repository = git(sourceRoot, "rev-parse", "--show-toplevel");
  const head = git(repository, "rev-parse", "HEAD");
  const pin = readJson(pinPath);
  const versionMismatch = sourcePackage.version !== pin.version;
  const commitMismatch = head !== pin.commit;

  assertCleanSource(repository, stylesDir);

  const files = collectSourceFiles(stylesDir, repository);
  const manifest = readJson(manifestPath);
  const cssFiles = [...files.keys()].filter((path) => path.endsWith(".css"));

  if (!allowUpstreamChange) {
    const recorded = new Map((manifest.upstreamFiles ?? []).map((file) => [file.path, file.hash]));
    const mismatches = [];

    for (const [path, content] of files) {
      if (!path.endsWith(".css")) {
        continue;
      }

      if (!recorded.has(path)) {
        mismatches.push(`${path} is not in the pinned snapshot`);
      } else if (hash(content) !== recorded.get(path)) {
        mismatches.push(`${path} does not match the pinned hash`);
      }
    }

    for (const path of recorded.keys()) {
      if (!files.has(path)) {
        mismatches.push(`${path} is missing from the source`);
      }
    }

    if (mismatches.length) {
      console.error("Refusing to overwrite the snapshot: source CSS differs from the pin.");
      mismatches.forEach((mismatch) => console.error(`- ${mismatch}`));
      console.error(
        "Restore the pinned checkout, or update the pin explicitly with " +
          "--allow-upstream-change --commit <sha>.",
      );
      process.exit(1);
    }

    if (versionMismatch || commitMismatch) {
      die(
        "Refusing to overwrite the snapshot.\n" +
          `Source: ${sourcePackage.name} ${sourcePackage.version} @ ${head}\n` +
          `Pinned: ${pin.package} ${pin.version} @ ${pin.commit}\n` +
          "Check out the pinned commit, or update the pin explicitly with " +
          "--allow-upstream-change --commit <sha>.",
      );
    }
  } else {
    if (!commitArg) {
      die("--allow-upstream-change requires --commit <sha> to record the new pin.");
    }

    if (commitArg !== head) {
      die(
        `Recorded commit ${commitArg} does not match the source HEAD ${head}.\n` +
          "Check out the intended commit before pinning it.",
      );
    }
  }

  rmSync(upstreamRoot, {recursive: true, force: true});

  for (const [path, content] of files) {
    const target = join(upstreamRoot, path);

    mkdirSync(dirname(target), {recursive: true});
    writeFileSync(target, content);
  }

  if (allowUpstreamChange) {
    writeFileSync(
      pinPath,
      `${JSON.stringify(
        {
          package: pin.package,
          version: sourcePackage.version,
          commit: head,
          repository: pin.repository,
        },
        null,
        2,
      )}\n`,
    );
  }

  console.log(
    `sync:styles wrote ${files.size} files (${cssFiles.length} CSS) from ` +
      `${sourcePackage.name} ${sourcePackage.version} @ ${head.slice(0, 9)}`,
  );

  if (allowUpstreamChange) {
    console.log(
      "Upstream pin updated. Next: refresh contracts/data-slots.json against the new source, " +
        "run pnpm gen:compat, then pnpm test:contract.",
    );
  }
}

if (checkMode) {
  checkSnapshot();
} else {
  syncSnapshot();
}
