import {createRequire} from "node:module";

import {expect, test, type Page} from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

interface AxeViolation {
  id: string;
  impact: string | null;
  help: string;
  nodes: Array<{target: unknown[]}>;
}

interface AxeWindow {
  axe: {
    run: (context: Document | Element, options: unknown) => Promise<{violations: AxeViolation[]}>;
  };
}

interface OverlayCase {
  name: string;
  open: (page: Page) => Promise<void>;
  target: string;
}

const OVERLAYS: OverlayCase[] = [
  {
    name: "modal",
    open: async (page) => {
      await page.locator('#modal [role="button"][aria-haspopup="dialog"]').click();
    },
    target: '[data-slot="modal-dialog"]',
  },
  {
    name: "alert-dialog",
    open: async (page) => {
      await page.locator('#alert-dialog [role="button"][aria-haspopup="dialog"]').click();
    },
    target: '[data-slot="alert-dialog-dialog"]',
  },
  {
    name: "drawer",
    open: async (page) => {
      await page.locator('#drawer button[aria-haspopup="dialog"]').first().click();
    },
    target: '[data-slot="drawer-dialog"]',
  },
  {
    name: "sheet",
    open: async (page) => {
      await page.locator('#sheet button[aria-haspopup="dialog"]').first().click();
    },
    target: '[data-slot="sheet-dialog"]',
  },
  {
    name: "popover",
    open: async (page) => {
      await page.locator('#popover [data-slot="popover-trigger"]').first().click();
    },
    target: '[data-slot="popover-dialog"]',
  },
  {
    name: "tooltip",
    open: async (page) => {
      await page.locator('#tooltip [data-slot="tooltip-trigger"]').first().hover();
    },
    target: ".tooltip",
  },
  {
    name: "toast",
    open: async (page) => {
      await page.locator("#toast").getByRole("button", {name: "Long queue"}).click();
    },
    target: '[data-slot="toast"]',
  },
];

for (const theme of ["light", "dark"] as const) {
  test.describe(`overlay axe (${theme})`, () => {
    for (const overlay of OVERLAYS) {
      test(`${overlay.name} has no critical or serious violations`, async ({page}) => {
        await page.goto(`/?theme=${theme}`);
        await page.waitForLoadState("networkidle");

        await overlay.open(page);
        await expect(page.locator(overlay.target).first()).toBeVisible();

        await page.addScriptTag({path: axePath});

        const violations = await page.evaluate(async () => {
          const axe = (window as unknown as AxeWindow).axe;
          const results = await axe.run(document, {
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
        });

        // HeroUI 3.2.7's own tokens fail color-contrast; contrast parity is
        // covered by tests/visual/accessibility.visual.ts.
        const unexpected = violations.filter((violation) => violation.id !== "color-contrast");

        expect(unexpected, JSON.stringify(unexpected, null, 2)).toEqual([]);
      });
    }
  });
}
