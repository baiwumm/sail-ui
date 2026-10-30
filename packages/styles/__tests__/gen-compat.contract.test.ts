import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {appendFileSync, readFileSync, readdirSync} from "node:fs";
import {join} from "node:path";

import postcss, {type AtRule, type Rule} from "postcss";
import {describe, expect, it} from "vitest";

import {createStylesFixture, packageRoot} from "./helpers";

const upstreamRoot = join(packageRoot, "upstream");
const generatedRoot = join(packageRoot, "generated");
const contractsRoot = join(packageRoot, "contracts");

interface ManifestFile {
  path: string;
  component: string;
  sourceHash: string;
  generatedHash: string;
  aliases: number;
  scoped: boolean;
}

interface ManifestAttribute {
  owner: "compat" | "component" | "native" | "reka";
  map?: string[];
  except?: string[];
  files: string[];
  components: string[];
}

interface Manifest {
  upstream: {version: string; commit: string};
  dataSlots: {total: number; components: number; hash: string};
  counts: {
    upstreamCssFiles: number;
    componentCssFiles: number;
    scopedComponents: number;
    attributes: number;
    aliases: number;
  };
  owners: Record<string, number>;
  attributes: Record<string, ManifestAttribute>;
  files: ManifestFile[];
  upstreamFiles: {path: string; hash: string}[];
}

const manifest = JSON.parse(
  readFileSync(join(packageRoot, "manifest.json"), "utf8")
) as Manifest;
const attributes = JSON.parse(
  readFileSync(join(contractsRoot, "attributes.json"), "utf8")
) as Record<string, ManifestAttribute>;
const scope = JSON.parse(
  readFileSync(join(contractsRoot, "scope.json"), "utf8")
) as {components: string[]};
const pin = JSON.parse(
  readFileSync(join(contractsRoot, "upstream.json"), "utf8")
) as {version: string; commit: string};

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

const ATTRIBUTE_PATTERN =
  /\[(data-[a-z0-9-]+)(?:\s*[~|^$*]?=\s*(?:"[^"]*"|'[^']*'|[^\]]+))?\]/g;

function atRuleChain(rule: Rule) {
  const chain: string[] = [];
  let parent = rule.parent;

  while (parent && parent.type !== "root") {
    if (parent.type === "atrule") {
      chain.unshift(`@${(parent as AtRule).name} ${(parent as AtRule).params}`);
    }
    parent = parent.parent;
  }

  return chain.join(" > ");
}

function declarationText(rule: Rule) {
  return rule.nodes
    .filter((node) => node.type === "decl")
    .map((node) => {
      const decl = node as {prop: string; value: string; important?: boolean};

      return `${decl.prop}:${decl.value}${decl.important ? "!important" : ""}`;
    })
    .join(";");
}

function upstreamCssFiles() {
  return readdirSync(upstreamRoot, {recursive: true, withFileTypes: true})
    .filter((entry) => entry.isFile() && entry.name.endsWith(".css"))
    .map((entry) => join(entry.parentPath, entry.name));
}

describe("compat generation contract", () => {
  it("is deterministic against the generated snapshot", () => {
    const output = execFileSync(
      process.execPath,
      [join(packageRoot, "scripts", "gen-compat.mjs"), "--check"],
      {cwd: packageRoot, encoding: "utf8", stdio: "pipe"}
    );

    expect(output).toContain("gen-compat check passed");
  });

  it("pins the upstream version and commit", () => {
    expect(pin).toEqual({
      package: "@heroui/styles",
      version: "3.2.7",
      commit: "89cd95ec17dfbbf952ef0d61af300f287aec223d",
      repository: "https://github.com/heroui-inc/heroui"
    });
    expect(manifest.upstream).toEqual({
      version: pin.version,
      commit: pin.commit
    });
  });

  it("records all 96 upstream CSS files with their source hashes", () => {
    const files = upstreamCssFiles();
    const recorded = new Map(manifest.upstreamFiles.map((file) => [file.path, file.hash]));

    expect(files).toHaveLength(96);
    expect(manifest.upstreamFiles).toHaveLength(96);

    for (const file of files) {
      const path = file.slice(upstreamRoot.length + 1).split("\\").join("/");

      expect(sha256(readFileSync(file, "utf8")), path).toBe(recorded.get(path));
    }
  });

  it("only copies components/index.css verbatim", () => {
    const verbatim = manifest.files.filter((file) => !file.scoped);

    expect(verbatim.map((file) => file.path)).toEqual(["components/index.css"]);

    for (const file of verbatim) {
      const source = readFileSync(join(upstreamRoot, file.path), "utf8");
      const generated = readFileSync(join(generatedRoot, file.path), "utf8");

      expect(generated, file.path).toBe(source);
    }
  });

  it("appends aliases in place without reordering rules or declarations", () => {
    for (const file of manifest.files.filter((entry) => entry.scoped)) {
      const source = postcss.parse(readFileSync(join(upstreamRoot, file.path), "utf8"));
      const generated = postcss.parse(readFileSync(join(generatedRoot, file.path), "utf8"));
      const sourceRules: Rule[] = [];
      const generatedRules: Rule[] = [];

      source.walkRules((rule) => sourceRules.push(rule));
      generated.walkRules((rule) => generatedRules.push(rule));

      expect(generatedRules.length, file.path).toBe(sourceRules.length);

      sourceRules.forEach((sourceRule, index) => {
        const generatedRule = generatedRules[index];

        expect(generatedRule, `${file.path} rule ${index}`).toBeDefined();
        expect(atRuleChain(generatedRule!), `${file.path} rule ${index} at-rules`).toBe(
          atRuleChain(sourceRule)
        );
        expect(declarationText(generatedRule!), `${file.path} rule ${index} declarations`).toBe(
          declarationText(sourceRule)
        );

        const sourceSelectors = sourceRule.selectors;
        const generatedSelectors = generatedRule!.selectors;

        expect(
          generatedSelectors.slice(0, sourceSelectors.length),
          `${file.path} rule ${index} selector order`
        ).toEqual(sourceSelectors);
      });
    }
  });

  it("reports alias and owner totals that match the manifest", () => {
    const perFile = manifest.files.reduce((total, file) => total + file.aliases, 0);
    const ownerTotal = Object.values(manifest.owners).reduce(
      (total, count) => total + count,
      0
    );

    expect(perFile).toBe(manifest.counts.aliases);
    expect(perFile).toBeGreaterThan(0);
    expect(manifest.counts).toMatchObject({
      upstreamCssFiles: 96,
      componentCssFiles: 86,
      scopedComponents: 85,
      attributes: 65
    });
    expect(manifest.owners).toEqual({
      compat: 12,
      component: 52,
      native: 0,
      reka: 1
    });
    expect(ownerTotal).toBe(manifest.counts.attributes);
  });

  it("gives every upstream CSS attribute exactly one declared owner", () => {
    const used = new Set<string>();

    for (const file of upstreamCssFiles()) {
      for (const match of readFileSync(file, "utf8").matchAll(ATTRIBUTE_PATTERN)) {
        used.add(match[1]!);
      }
    }

    expect([...used].sort()).toEqual(Object.keys(attributes).sort());
    expect(Object.keys(manifest.attributes).sort()).toEqual(Object.keys(attributes).sort());

    for (const [name, config] of Object.entries(attributes)) {
      const manifestEntry = manifest.attributes[name];

      expect(manifestEntry, name).toBeDefined();
      expect(manifestEntry!.owner, name).toBe(config.owner);
      expect(manifestEntry!.files.length, name).toBeGreaterThan(0);

      if (config.owner === "compat") {
        expect(config.map?.length, name).toBeGreaterThan(0);
        expect(manifestEntry!.map, name).toEqual(config.map);
      } else {
        expect(config.map, name).toBeUndefined();
        expect(config.except, name).toBeUndefined();
      }

      if (config.except) {
        expect(manifestEntry!.except, name).toEqual([...config.except].sort());
      }
    }

    expect(attributes["data-expanded"]?.except).toEqual(["sheet", "toast"]);
  });

  it("scopes every upstream component CSS file", () => {
    const components = manifest.files
      .map((file) => file.component)
      .filter((component) => component !== "index")
      .sort();

    expect(scope.components).toEqual(components);
    expect(components).toHaveLength(85);
  });

  it("records the data-slot snapshot in the manifest", () => {
    const text = readFileSync(join(contractsRoot, "data-slots.json"), "utf8");

    expect(manifest.dataSlots).toEqual({
      total: 334,
      components: 81,
      hash: sha256(text)
    });
  });
});

describe("compat generation fault injection", () => {
  it("fails with owner guidance for an unknown upstream attribute", () => {
    const fixture = createStylesFixture();

    try {
      appendFileSync(
        join(fixture.root, "upstream", "components", "button.css"),
        "\n.button[data-foo] { color: red; }\n"
      );

      const result = fixture.run("gen-compat.mjs", ["--check"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "Unknown data attribute: data-foo (components/button.css)"
      );
      expect(result.stderr).toContain(
        "Choose an owner in packages/styles/contracts/attributes.json"
      );
    } finally {
      fixture.dispose();
    }
  });

  it("fails when a generated file is hand-edited", () => {
    const fixture = createStylesFixture();

    try {
      appendFileSync(
        join(fixture.root, "generated", "components", "button.css"),
        "\n/* hand edit */\n"
      );

      const result = fixture.run("gen-compat.mjs", ["--check"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain("generated/components/button.css is stale");
    } finally {
      fixture.dispose();
    }
  });

  it("fails when the manifest no longer matches the snapshot", () => {
    const fixture = createStylesFixture();

    try {
      appendFileSync(join(fixture.root, "manifest.json"), "\n");

      const result = fixture.run("gen-compat.mjs", ["--check"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "manifest.json does not match the upstream snapshot"
      );
    } finally {
      fixture.dispose();
    }
  });

  it("reports an extra generated file", () => {
    const fixture = createStylesFixture();
    const extra = join(fixture.root, "generated", "components", "orphan.css");

    try {
      appendFileSync(extra, ".orphan { color: red; }\n");

      const result = fixture.run("gen-compat.mjs", ["--check"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "generated/components/orphan.css is not generated by the current snapshot"
      );
    } finally {
      fixture.dispose();
    }
  });
});
