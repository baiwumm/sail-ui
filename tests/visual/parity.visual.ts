import {expect, test, type Page} from "@playwright/test";

import {compareScreenshots} from "../../packages/testing/src/visual";

const PLAYGROUND = "http://127.0.0.1:4173";
const REFERENCE = "http://127.0.0.1:5174";
const MAX_DIFF_RATIO = 0.01;

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
  "calendar",
  "date-fields",
  "date-pickers",
  "combo-box",
  "colors",
  "collections-select",
  "collections-listbox",
  "collections-dropdown",
  "collections-accordion",
  "collections-tabs",
  "collections-tag-group",
  "collections-pagination",
  "meter",
  "scroll-shadow",
  "input-otp",
  "table",
] as const;

type Theme = "light" | "dark";

async function openApp(page: Page, baseUrl: string, theme: Theme) {
  await page.goto(`${baseUrl}/?theme=${theme}`);
  await page.evaluate(() => document.fonts.ready);

  if (theme === "dark") {
    await expect(page.locator("html")).toHaveClass(/dark/);
  }

  await page.waitForLoadState("networkidle");
}

async function expectParity(vuePage: Page, reactPage: Page, selector: string, label: string) {
  const vueLocator = vuePage.locator(selector).first();
  const reactLocator = reactPage.locator(selector).first();

  await expect(vueLocator).toBeVisible();
  await expect(reactLocator).toBeVisible();

  const [vueShot, reactShot] = await Promise.all([
    vueLocator.screenshot({animations: "disabled", caret: "hide", scale: "css"}),
    reactLocator.screenshot({animations: "disabled", caret: "hide", scale: "css"}),
  ]);
  const result = compareScreenshots(vueShot, reactShot, 0.1);

  test.info().annotations.push({
    type: label,
    description: `diff=${result.diffPixels} ratio=${result.ratio.toFixed(5)}`,
  });

  expect(
    result.ratio,
    `${label} differs from the React reference (${result.diffPixels} px)`,
  ).toBeLessThanOrEqual(MAX_DIFF_RATIO);
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`visual parity (${theme})`, () => {
    test("Button rows match the React reference", async ({browser}) => {
      const vuePage = await browser.newPage();
      const reactPage = await browser.newPage();

      await openApp(vuePage, PLAYGROUND, theme);
      await openApp(reactPage, REFERENCE, theme);

      for (const [index, state] of ["variants", "sizes", "states"].entries()) {
        const rowSelector = `#buttons > div:nth-of-type(${index + 1})`;

        await expectParity(vuePage, reactPage, rowSelector, `button-${state}-${theme}`);
      }

      for (const page of [vuePage, reactPage]) {
        await page.locator("#buttons").getByRole("button", {name: "Primary", exact: true}).hover();
      }

      await expectParity(
        vuePage,
        reactPage,
        "#buttons > div:nth-of-type(1)",
        `button-hover-${theme}`,
      );

      for (const page of [vuePage, reactPage]) {
        await page.locator("header h1").click();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
      }

      await expectParity(
        vuePage,
        reactPage,
        "#buttons > div:nth-of-type(1)",
        `button-focus-${theme}`,
      );

      await vuePage.close();
      await reactPage.close();
    });

    test("Input fields match the React reference", async ({browser}) => {
      const vuePage = await browser.newPage();
      const reactPage = await browser.newPage();

      await openApp(vuePage, PLAYGROUND, theme);
      await openApp(reactPage, REFERENCE, theme);

      for (const [index, state] of ["default", "invalid", "disabled"].entries()) {
        const selector = `#input [data-slot="textfield"]:nth-of-type(${index + 1})`;

        await expectParity(vuePage, reactPage, selector, `input-${state}-${theme}`);
      }

      for (const page of [vuePage, reactPage]) {
        await page.locator('#input [data-slot="input"]').first().focus();
      }

      await expectParity(
        vuePage,
        reactPage,
        '#input [data-slot="textfield"]:nth-of-type(1)',
        `input-focus-${theme}`,
      );

      await vuePage.close();
      await reactPage.close();
    });

    test("Select trigger and popover match the React reference", async ({browser}) => {
      const vuePage = await browser.newPage();
      const reactPage = await browser.newPage();

      await openApp(vuePage, PLAYGROUND, theme);
      await openApp(reactPage, REFERENCE, theme);

      const selectTrigger = '#select [data-slot="select-trigger"]';

      await expectParity(vuePage, reactPage, selectTrigger, `select-trigger-${theme}`);

      for (const page of [vuePage, reactPage]) {
        await page.locator(selectTrigger).hover();
      }

      await expectParity(vuePage, reactPage, selectTrigger, `select-trigger-hover-${theme}`);

      await vuePage.locator(selectTrigger).click();
      await reactPage.locator(selectTrigger).click();
      await expectParity(
        vuePage,
        reactPage,
        '[data-slot="select-popover"]',
        `select-popover-${theme}`,
      );

      await vuePage.close();
      await reactPage.close();
    });

    test("Collections Select popover matches the React reference", async ({browser}) => {
      const vuePage = await browser.newPage();
      const reactPage = await browser.newPage();

      await openApp(vuePage, PLAYGROUND, theme);
      await openApp(reactPage, REFERENCE, theme);

      const trigger = '#collections-select [data-slot="select-trigger"]';

      await expectParity(vuePage, reactPage, trigger, `collections-select-trigger-${theme}`);

      await vuePage.locator(trigger).first().click();
      await reactPage.locator(trigger).first().click();
      await expectParity(
        vuePage,
        reactPage,
        '[data-slot="select-popover"]',
        `collections-select-popover-${theme}`,
      );

      await vuePage.close();
      await reactPage.close();
    });

    test("Collections Dropdown popover matches the React reference", async ({browser}) => {
      const vuePage = await browser.newPage();
      const reactPage = await browser.newPage();

      await openApp(vuePage, PLAYGROUND, theme);
      await openApp(reactPage, REFERENCE, theme);

      const trigger = '#collections-dropdown [data-slot="dropdown-trigger"]';

      await expectParity(vuePage, reactPage, trigger, `collections-dropdown-trigger-${theme}`);

      await vuePage.locator(trigger).first().click();
      await reactPage.locator(trigger).first().click();
      await expectParity(
        vuePage,
        reactPage,
        '[data-slot="dropdown-popover"]',
        `collections-dropdown-popover-${theme}`,
      );

      await vuePage.close();
      await reactPage.close();
    });

    test("Modal dialog matches the React reference", async ({browser}) => {
      const vuePage = await browser.newPage();
      const reactPage = await browser.newPage();

      await openApp(vuePage, PLAYGROUND, theme);
      await openApp(reactPage, REFERENCE, theme);

      const selector = "#modal .button";

      await expectParity(vuePage, reactPage, selector, `modal-trigger-${theme}`);

      for (const page of [vuePage, reactPage]) {
        await page.locator(selector).hover();
      }

      await expectParity(vuePage, reactPage, selector, `modal-trigger-hover-${theme}`);

      await vuePage.locator(selector).click();
      await reactPage.locator(selector).click();
      await expectParity(vuePage, reactPage, '[data-slot="modal-dialog"]', `modal-dialog-${theme}`);

      await vuePage.close();
      await reactPage.close();
    });

    for (const section of GALLERY_SECTIONS) {
      test(`${section} gallery matches the React reference`, async ({browser}) => {
        const vuePage = await browser.newPage();
        const reactPage = await browser.newPage();

        await openApp(vuePage, PLAYGROUND, theme);
        await openApp(reactPage, REFERENCE, theme);

        await expectParity(vuePage, reactPage, `#${section}`, `${section}-${theme}`);

        await vuePage.close();
        await reactPage.close();
      });
    }
  });
}
