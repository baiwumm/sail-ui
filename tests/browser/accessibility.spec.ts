import {createRequire} from "node:module";

import {expect, test} from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const GALLERY_SECTIONS = [
  "alert",
  "avatar",
  "badge",
  "breadcrumbs",
  "card",
  "chip",
  "close-button",
  "fieldset",
  "header",
  "kbd",
  "link",
  "progress",
  "separator",
  "skeleton",
  "spinner",
  "surface",
  "text",
  "typography",
  "empty-state",
  "forms",
] as const;

interface AxeViolation {
  id: string;
  impact: string | null;
  help: string;
  nodes: Array<{target: unknown[]}>;
}

declare global {
  interface Window {
    axe: {
      run: (context: Element, options: unknown) => Promise<{violations: AxeViolation[]}>;
    };
  }
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`axe (${theme})`, () => {
    for (const section of GALLERY_SECTIONS) {
      test(`${section} has no critical or serious violations (upstream contrast excluded)`, async ({
        page,
      }) => {
        await page.goto(`/?theme=${theme}`);
        await page.waitForLoadState("networkidle");
        await page.addScriptTag({path: axePath});

        const violations = await page.evaluate(async (selector) => {
          const target = document.querySelector(selector);

          if (!target) {
            throw new Error(`Missing gallery section ${selector}`);
          }

          const results = await window.axe.run(target, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
            },
          });

          return results.violations
            .filter(
              (violation) => violation.impact === "critical" || violation.impact === "serious",
            )
            .map((violation) => ({
              id: violation.id,
              impact: violation.impact,
              help: violation.help,
              nodes: violation.nodes.map((node) => ({target: node.target})),
            }));
        }, `#${section}`);

        // HeroUI 3.2.7's own tokens fail color-contrast identically in the React
        // reference; tests/visual/accessibility.visual.ts guards parity for it.
        const unexpected = violations.filter((violation) => violation.id !== "color-contrast");
        const upstreamContrast = violations.length - unexpected.length;

        if (upstreamContrast > 0) {
          test.info().annotations.push({
            type: "upstream-color-contrast",
            description: `${upstreamContrast} known HeroUI token violation(s)`,
          });
        }

        expect(unexpected, JSON.stringify(unexpected, null, 2)).toEqual([]);
      });
    }
  });
}
