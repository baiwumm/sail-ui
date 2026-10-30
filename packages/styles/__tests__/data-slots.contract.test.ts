import {execFileSync} from "node:child_process";
import {readFileSync, writeFileSync} from "node:fs";
import {join} from "node:path";

import {describe, expect, it} from "vitest";

import {createStylesFixture, packageRoot} from "./helpers";

interface Snapshot {
  upstream: {version: string; commit: string};
  source: string;
  total: number;
  components: Record<string, string[]>;
}

const snapshotPath = join(packageRoot, "contracts", "data-slots.json");
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8")) as Snapshot;
const pin = JSON.parse(readFileSync(join(packageRoot, "contracts", "upstream.json"), "utf8")) as {
  version: string;
  commit: string;
};

describe("data-slot snapshot contract", () => {
  it("validates the committed snapshot without a source checkout", () => {
    const output = execFileSync(
      process.execPath,
      [join(packageRoot, "scripts", "gen-data-slots.mjs"), "--check"],
      {cwd: packageRoot, encoding: "utf8", stdio: "pipe"},
    );

    expect(output).toContain(
      "data-slots snapshot is valid: 334 unique values across 81 components",
    );
  });

  it("pins the snapshot to the upstream commit", () => {
    expect(snapshot.upstream).toEqual({
      version: pin.version,
      commit: pin.commit,
    });
    expect(snapshot.source).toBe("packages/react/src/components");
  });

  it("contains 334 unique, sorted, well-formed values across 81 components", () => {
    const values: string[] = [];

    expect(snapshot.total).toBe(334);
    expect(Object.keys(snapshot.components)).toHaveLength(81);

    for (const [component, slots] of Object.entries(snapshot.components)) {
      expect(slots.length, component).toBeGreaterThan(0);
      expect(slots, component).toEqual([...slots].sort((a, b) => a.localeCompare(b)));

      for (const slot of slots) {
        expect(slot, component).toMatch(/^[a-z0-9][a-z0-9-]*$/);
        values.push(slot);
      }
    }

    expect(new Set(values).size).toBe(values.length);
    expect(values).toHaveLength(334);
  });

  it("includes the two object-key slots missed by the JSX-only T01 count", () => {
    // T01 reported 332 because it only matched JSX props. The complete
    // extraction also reads object keys such as {"data-slot": "select-indicator"}.
    expect(snapshot.components.select).toContain("select-indicator");
    expect(snapshot.components.autocomplete).toContain("autocomplete-indicator");
  });

  it("fails when a slot is removed from the snapshot", () => {
    const fixture = createStylesFixture({generated: false});

    try {
      const tampered = JSON.parse(
        readFileSync(join(fixture.root, "contracts", "data-slots.json"), "utf8"),
      ) as Snapshot;

      tampered.components.select = tampered.components.select.filter(
        (slot) => slot !== "select-indicator",
      );
      writeFileSync(
        join(fixture.root, "contracts", "data-slots.json"),
        `${JSON.stringify(tampered, null, 2)}\n`,
      );

      const result = fixture.run("gen-data-slots.mjs", ["--check"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain("total is 334, but the grouped values add up to 333");
    } finally {
      fixture.dispose();
    }
  });

  it("fails when a slot appears in two components", () => {
    const fixture = createStylesFixture({generated: false});

    try {
      const tampered = JSON.parse(
        readFileSync(join(fixture.root, "contracts", "data-slots.json"), "utf8"),
      ) as Snapshot;

      tampered.components.input.push("button");
      tampered.components.input.sort((a, b) => a.localeCompare(b));
      tampered.total += 1;
      writeFileSync(
        join(fixture.root, "contracts", "data-slots.json"),
        `${JSON.stringify(tampered, null, 2)}\n`,
      );

      const result = fixture.run("gen-data-slots.mjs", ["--check"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain("duplicate data-slot values: button");
    } finally {
      fixture.dispose();
    }
  });

  it("fails when the snapshot pin drifts", () => {
    const fixture = createStylesFixture({generated: false});

    try {
      const tampered = JSON.parse(
        readFileSync(join(fixture.root, "contracts", "data-slots.json"), "utf8"),
      ) as Snapshot;

      tampered.upstream.commit = "0".repeat(40);
      writeFileSync(
        join(fixture.root, "contracts", "data-slots.json"),
        `${JSON.stringify(tampered, null, 2)}\n`,
      );

      const result = fixture.run("gen-data-slots.mjs", ["--check"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "upstream version/commit does not match contracts/upstream.json",
      );
    } finally {
      fixture.dispose();
    }
  });

  it("refuses to regenerate without a source checkout", () => {
    const fixture = createStylesFixture({generated: false});

    try {
      const result = fixture.run("gen-data-slots.mjs");

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "gen-data-slots needs --source <heroui repo or components dir>",
      );
    } finally {
      fixture.dispose();
    }
  });
});
