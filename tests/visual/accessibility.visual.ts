import {createRequire} from "node:module";

import {expect, test, type Page} from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const PLAYGROUND = "http://127.0.0.1:4173";
const REFERENCE = "http://127.0.0.1:5174";

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
] as const;

async function collectContrastViolations(page: Page) {
  await page.addScriptTag({path: axePath});

  return page.evaluate(
    async (sections) => {
      const axe = (
        window as unknown as {
          axe: {
            run: (
              context: Element,
              options: unknown,
            ) => Promise<{
              violations: Array<{
                id: string;
                impact: string | null;
                nodes: unknown[];
              }>;
            }>;
          };
        }
      ).axe;
      const counts: Record<string, number> = {};

      for (const section of sections) {
        const target = document.querySelector(`#${section}`);

        if (!target) {
          throw new Error(`Missing gallery section #${section}`);
        }

        const results = await axe.run(target, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        });

        counts[section] = results.violations
          .filter(
            (violation) =>
              violation.id === "color-contrast" &&
              (violation.impact === "critical" || violation.impact === "serious"),
          )
          .reduce((total, violation) => total + violation.nodes.length, 0);
      }

      return counts;
    },
    [...GALLERY_SECTIONS],
  );
}

for (const theme of ["light", "dark"] as const) {
  test(`axe color-contrast parity (${theme})`, async ({browser}) => {
    const vuePage = await browser.newPage();
    const reactPage = await browser.newPage();

    await vuePage.goto(`${PLAYGROUND}/?theme=${theme}`);
    await reactPage.goto(`${REFERENCE}/?theme=${theme}`);
    await vuePage.waitForLoadState("networkidle");
    await reactPage.waitForLoadState("networkidle");

    const [vueCounts, reactCounts] = await Promise.all([
      collectContrastViolations(vuePage),
      collectContrastViolations(reactPage),
    ]);

    test.info().annotations.push({
      type: `contrast-${theme}`,
      description: JSON.stringify(vueCounts),
    });

    expect(vueCounts).toEqual(reactCounts);

    await vuePage.close();
    await reactPage.close();
  });
}
