import {expect, test, type Page} from "@playwright/test";

const field = (page: Page, testId: string) => page.getByTestId(testId);
const segment = (page: Page, testId: string, part: string) =>
  field(page, testId).locator(`[data-slot="date-input-group-segment"][data-type="${part}"]`);

test.describe("Date and time fields", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("types a month and updates the controlled value", async ({page}) => {
    const month = segment(page, "date-field-basic", "month");

    await month.click();
    await page.keyboard.press("3");

    await expect(page.getByTestId("date-field-value")).toHaveText("2025-03-14");
    await expect(month).toHaveText("3");
    await expect(month).toHaveAttribute("aria-valuetext", "3 - March");
  });

  test("steps the day segment with the arrow keys", async ({page}) => {
    const day = segment(page, "date-field-basic", "day");

    await day.click();
    await expect(day).toHaveAttribute("data-focused", "true");

    await page.keyboard.press("ArrowUp");
    await expect(day).toHaveAttribute("aria-valuenow", "15");
    await expect(page.getByTestId("date-field-value")).toHaveText("2025-02-15");

    await page.keyboard.press("ArrowDown");
    await expect(day).toHaveAttribute("aria-valuenow", "14");
    await expect(page.getByTestId("date-field-value")).toHaveText("2025-02-14");
  });

  test("moves focus between segments with the arrow keys", async ({page}) => {
    const month = segment(page, "date-field-basic", "month");
    const day = segment(page, "date-field-basic", "day");

    await month.click();
    await page.keyboard.press("ArrowRight");

    await expect(day).toBeFocused();
    await expect(day).toHaveAttribute("data-focused", "true");
    await expect(month).not.toHaveAttribute("data-focused", "true");
  });

  test("only reports focus-visible after a keyboard interaction", async ({page}) => {
    const month = segment(page, "date-field-basic", "month");

    await month.click();
    await expect(month).toHaveAttribute("data-focused", "true");
    await expect(month).not.toHaveAttribute("data-focus-visible", "true");

    await page.locator("header h1").click();
    await page.keyboard.press("Tab");
    await month.focus();

    await expect(month).toHaveAttribute("data-focus-visible", "true");
  });

  test("reports hover on segments with a mouse pointer", async ({page}) => {
    const month = segment(page, "date-field-basic", "month");
    const day = segment(page, "date-field-basic", "day");

    await month.hover();
    await expect(month).toHaveAttribute("data-hovered", "true");

    await day.hover();
    await expect(day).toHaveAttribute("data-hovered", "true");
    await expect(month).not.toHaveAttribute("data-hovered", "true");
  });

  test("renders prefix and suffix inside the secondary variant", async ({page}) => {
    const range = field(page, "date-field-range");

    await expect(range.locator('[data-slot="date-input-group-prefix"]')).toHaveText("On");
    await expect(range.locator('[data-slot="date-input-group-suffix"]')).toHaveText("UTC");
  });

  test("marks values below the minimum and the required state", async ({page}) => {
    const invalid = field(page, "date-field-invalid");
    const range = field(page, "date-field-range");

    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAttribute("data-required", "true");
    await expect(invalid.locator('[data-slot="field-error"]')).toHaveText("Choose a start date.");

    await expect(range).toHaveAttribute("aria-invalid", "true");
    await expect(segment(page, "date-field-range", "day")).toHaveAttribute("data-invalid", "true");
  });

  test("keeps the disabled field read-only", async ({page}) => {
    const month = segment(page, "date-field-disabled", "month");

    await expect(month).toHaveAttribute("contenteditable", "false");
    await expect(month).toHaveAttribute("data-disabled", "true");
  });

  test("renders the time field segments by hour cycle", async ({page}) => {
    const basic = field(page, "time-field-basic");
    const alarm = field(page, "time-field-24h");

    await expect(
      basic
        .locator('[role="spinbutton"]')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-type"))),
    ).resolves.toEqual(["hour", "minute", "dayPeriod"]);
    await expect(segment(page, "time-field-basic", "dayPeriod")).toHaveText("PM");

    await expect(
      alarm
        .locator('[role="spinbutton"]')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-type"))),
    ).resolves.toEqual(["hour", "minute", "second"]);
    await expect(segment(page, "time-field-24h", "second")).toHaveAttribute("aria-valuenow", "30");
  });

  test("edits the controlled time with the keyboard", async ({page}) => {
    const hour = segment(page, "time-field-basic", "hour");

    await hour.click();
    await page.keyboard.press("ArrowUp");

    await expect(hour).toHaveAttribute("aria-valuenow", "14");
    await expect(page.getByTestId("time-field-value")).toHaveText("14:45");
  });
});
