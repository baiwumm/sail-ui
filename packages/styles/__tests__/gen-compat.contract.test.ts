import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {join, resolve} from "node:path";

import postcss, {type AtRule, type Rule} from "postcss";
import {describe, expect, it} from "vitest";

const packageRoot = resolve(process.cwd(), "packages", "styles");
const upstreamRoot = join(packageRoot, "upstream");
const generatedRoot = join(packageRoot, "generated");

interface ManifestFile {
  path: string;
  sourceHash: string;
  generatedHash: string;
  aliases: number;
  scoped: boolean;
}

interface Manifest {
  upstream: {version: string; commit: string};
  files: ManifestFile[];
  aliases: number;
  scope: string[];
  pendingAttributes: Record<string, string[]>;
}

const manifest = JSON.parse(
  readFileSync(join(packageRoot, "manifest.json"), "utf8")
) as Manifest;

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

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
    expect(manifest.upstream).toEqual({
      version: "3.2.7",
      commit: "89cd95ec17dfbbf952ef0d61af300f287aec223d"
    });
  });

  it("keeps every upstream CSS file byte-identical to the manifest", () => {
    for (const file of manifest.files) {
      const source = readFileSync(join(upstreamRoot, file.path), "utf8");

      expect(sha256(source), file.path).toBe(file.sourceHash);
    }
  });

  it("copies files outside the T01 scope verbatim", () => {
    for (const file of manifest.files.filter((entry) => !entry.scoped)) {
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

  it("reports alias totals that match the per-file manifest", () => {
    const perFile = manifest.files.reduce((total, file) => total + file.aliases, 0);

    expect(perFile).toBe(manifest.aliases);
    expect(manifest.aliases).toBeGreaterThan(0);
  });

  it("declares an owner for every attribute used by scoped components", () => {
    const attributes = JSON.parse(
      readFileSync(join(packageRoot, "contracts", "attributes.json"), "utf8")
    ) as Record<string, unknown>;

    for (const file of manifest.files.filter((entry) => entry.scoped)) {
      const source = readFileSync(join(upstreamRoot, file.path), "utf8");
      const used = new Set(
        [...source.matchAll(/\[(data-[a-z0-9-]+)(?:\s*[~|^$*]?=|\])/g)].map(
          (match) => match[1]!
        )
      );

      for (const attribute of used) {
        expect(attributes[attribute], `${file.path} uses ${attribute}`).toBeDefined();
      }
    }

    for (const attribute of Object.keys(manifest.pendingAttributes)) {
      expect(attributes[attribute], `${attribute} is pending in T01`).toBeUndefined();
    }
  });
});
