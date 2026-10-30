import {execFileSync} from "node:child_process";
import {
  appendFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import {join} from "node:path";

import {describe, expect, it} from "vitest";

import {createStylesFixture, packageRoot} from "./helpers";

const upstreamRoot = join(packageRoot, "upstream");
const fixturesRoot = join(packageRoot, ".fixtures");

interface SourceFixture {
  root: string;
  stylesDir: string;
  head: string;
}

function createSource(
  options: {version?: string; mutate?: (stylesDir: string) => void} = {}
): SourceFixture {
  mkdirSync(fixturesRoot, {recursive: true});

  const root = mkdtempSync(join(fixturesRoot, "source-"));
  const stylesDir = join(root, "packages", "styles");

  cpSync(upstreamRoot, stylesDir, {recursive: true});
  writeFileSync(
    join(stylesDir, "package.json"),
    `${JSON.stringify({name: "@heroui/styles", version: options.version ?? "3.2.7"}, null, 2)}\n`
  );

  options.mutate?.(stylesDir);

  execFileSync("git", ["init", "-q"], {cwd: root, stdio: "pipe"});
  execFileSync("git", ["add", "."], {cwd: root, stdio: "pipe"});
  execFileSync(
    "git",
    [
      "-c",
      "user.name=Sail UI Tests",
      "-c",
      "user.email=tests@sail-ui.local",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-q",
      "-m",
      "fixture"
    ],
    {cwd: root, stdio: "pipe"}
  );

  const head = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe"
  }).trim();

  return {root, stylesDir, head};
}

function disposeSource(source: SourceFixture) {
  rmSync(source.root, {recursive: true, force: true});
}

describe("sync:styles contract", () => {
  it("validates the committed snapshot", () => {
    const output = execFileSync(
      process.execPath,
      [join(packageRoot, "scripts", "sync-styles.mjs"), "--check"],
      {cwd: packageRoot, encoding: "utf8", stdio: "pipe"}
    );

    expect(output).toContain("sync:styles check passed: 96 CSS files");
  });

  it("fails when an upstream file no longer matches the pinned hash", () => {
    const fixture = createStylesFixture({generated: false});

    try {
      appendFileSync(
        join(fixture.root, "upstream", "components", "button.css"),
        "\n/* tampered */\n"
      );

      const result = fixture.run("sync-styles.mjs", ["--check"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "upstream/components/button.css does not match the pinned hash"
      );
    } finally {
      fixture.dispose();
    }
  });

  it("fails when the snapshot contains an unexpected file", () => {
    const fixture = createStylesFixture({generated: false});

    try {
      writeFileSync(
        join(fixture.root, "upstream", "components", "orphan.css"),
        ".orphan { color: red; }\n"
      );

      const result = fixture.run("sync-styles.mjs", ["--check"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "upstream/components/orphan.css is not part of the pinned snapshot"
      );
    } finally {
      fixture.dispose();
    }
  });

  it("refuses to overwrite when the source version differs", () => {
    const fixture = createStylesFixture({generated: false});
    const source = createSource({version: "9.9.9"});

    try {
      const before = readFileSync(
        join(fixture.root, "contracts", "upstream.json"),
        "utf8"
      );
      const result = fixture.run("sync-styles.mjs", ["--source", source.root]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain("Refusing to overwrite the snapshot.");
      expect(result.stderr).toContain("Source: @heroui/styles 9.9.9");
      expect(result.stderr).toContain("Pinned: @heroui/styles 3.2.7");
      expect(
        readFileSync(join(fixture.root, "contracts", "upstream.json"), "utf8")
      ).toBe(before);
    } finally {
      fixture.dispose();
      disposeSource(source);
    }
  });

  it("refuses to overwrite when a source file hash differs", () => {
    const fixture = createStylesFixture({generated: false});
    const source = createSource({
      mutate: (stylesDir) => {
        appendFileSync(
          join(stylesDir, "components", "button.css"),
          "\n/* dirty */\n"
        );
      }
    });

    try {
      const result = fixture.run("sync-styles.mjs", ["--source", source.root]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "Refusing to overwrite the snapshot: source CSS differs from the pin."
      );
      expect(result.stderr).toContain(
        "- components/button.css does not match the pinned hash"
      );
    } finally {
      fixture.dispose();
      disposeSource(source);
    }
  });

  it("requires an explicit commit when accepting an upstream change", () => {
    const fixture = createStylesFixture({generated: false});
    const source = createSource({version: "9.9.9"});

    try {
      const result = fixture.run("sync-styles.mjs", [
        "--source",
        source.root,
        "--allow-upstream-change"
      ]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "--allow-upstream-change requires --commit <sha>"
      );
    } finally {
      fixture.dispose();
      disposeSource(source);
    }
  });

  it("rejects a recorded commit that does not match the source HEAD", () => {
    const fixture = createStylesFixture({generated: false});
    const source = createSource({version: "9.9.9"});

    try {
      const result = fixture.run("sync-styles.mjs", [
        "--source",
        source.root,
        "--allow-upstream-change",
        "--commit",
        "0".repeat(40)
      ]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        `does not match the source HEAD ${source.head}`
      );
    } finally {
      fixture.dispose();
      disposeSource(source);
    }
  });

  it("copies the source and records the new pin when explicitly allowed", () => {
    const fixture = createStylesFixture({generated: false});
    const source = createSource({version: "9.9.9"});

    try {
      const result = fixture.run("sync-styles.mjs", [
        "--source",
        source.root,
        "--allow-upstream-change",
        "--commit",
        source.head
      ]);

      expect(result.status).toBe(0);
      expect(result.stdout).toContain("sync:styles wrote 98 files (96 CSS)");

      const pin = JSON.parse(
        readFileSync(join(fixture.root, "contracts", "upstream.json"), "utf8")
      ) as {version: string; commit: string};

      expect(pin.version).toBe("9.9.9");
      expect(pin.commit).toBe(source.head);
    } finally {
      fixture.dispose();
      disposeSource(source);
    }
  });

  it("rejects --check with a source argument", () => {
    const fixture = createStylesFixture({generated: false});

    try {
      const result = fixture.run("sync-styles.mjs", ["--check", "--source", "."]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain("--check does not read a source");
    } finally {
      fixture.dispose();
    }
  });
});
