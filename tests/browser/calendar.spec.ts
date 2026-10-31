import {expect, test, type Page} from "@playwright/test";

const calendar = (page: Page, testId: string) => page.getByTestId(testId);
const dayCell = (page: Page, testId: string, iso: string) =>
  page.locator(`[data-testid="${testId}"] [data-slot$="-cell"][data-value="${iso}"]`);
const navButton = (page: Page, testId: string, page_: "previous" | "next") =>
  page.locator(`[data-testid="${testId}"] [data-slot$="-nav-button"][slot="${page_}"]`);

test.describe("Calendar", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
  });

  test("moves focus with arrow keys and commits the focused date", async ({page}) => {
    const selected = dayCell(page, "calendar-basic", "2025-02-14");
    const next = dayCell(page, "calendar-basic", "2025-02-15");

    await selected.click();
    await expect(selected).toBeFocused();
    await expect(selected).toHaveAttribute("tabindex", "0");

    await page.keyboard.press("ArrowRight");

    await expect(next).toBeFocused();
    await expect(next).toHaveAttribute("data-focused", "true");
    await expect(next).toHaveAttribute("tabindex", "0");
    await expect(selected).toHaveAttribute("tabindex", "-1");

    await page.keyboard.press("Enter");

    await expect(selected).not.toHaveAttribute("data-selected", "true");
    await expect(next).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("calendar-basic-value")).toHaveText("2025-02-15");
  });

  test("supports Home, End and page navigation keys", async ({page}) => {
    const heading = calendar(page, "calendar-basic").locator('[data-slot="calendar-heading"]');

    await dayCell(page, "calendar-basic", "2025-02-14").click();
    await page.keyboard.press("Home");
    await expect(dayCell(page, "calendar-basic", "2025-02-09")).toBeFocused();

    await page.keyboard.press("End");
    await expect(dayCell(page, "calendar-basic", "2025-02-15")).toBeFocused();

    await page.keyboard.press("PageDown");
    await expect(heading).toHaveText("March 2025");
    await expect(dayCell(page, "calendar-basic", "2025-03-15")).toBeFocused();

    await page.keyboard.press("PageUp");
    await expect(heading).toHaveText("February 2025");
    await expect(dayCell(page, "calendar-basic", "2025-02-15")).toBeFocused();
  });

  test("renders two visible months and pages them together", async ({page}) => {
    const headings = calendar(page, "calendar-two-month").locator('[data-slot="calendar-heading"]');

    await expect(headings).toHaveCount(2);
    await expect(headings.nth(0)).toHaveText("February 2025");
    await expect(headings.nth(1)).toHaveText("March 2025");

    await expect(dayCell(page, "calendar-two-month", "2025-02-15")).toHaveAttribute(
      "data-unavailable",
      "true",
    );
    await expect(dayCell(page, "calendar-two-month", "2025-02-15")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(dayCell(page, "calendar-two-month", "2025-02-15")).not.toHaveAttribute(
      "data-disabled",
      "true",
    );

    await dayCell(page, "calendar-two-month", "2025-02-14").click();
    await expect(page.getByTestId("calendar-two-month-value")).toHaveText("2025-02-14");

    await navButton(page, "calendar-two-month", "next").click();

    await expect(headings.nth(0)).toHaveText("April 2025");
    await expect(headings.nth(1)).toHaveText("May 2025");
    await expect(page.getByTestId("calendar-two-month-value")).toHaveText("2025-02-14");

    await navButton(page, "calendar-two-month", "previous").click();

    await expect(headings.nth(0)).toHaveText("February 2025");
    await expect(headings.nth(1)).toHaveText("March 2025");
  });

  test("pages months with the header buttons", async ({page}) => {
    const heading = calendar(page, "calendar-basic").locator('[data-slot="calendar-heading"]');

    await expect(heading).toHaveText("February 2025");

    await navButton(page, "calendar-basic", "next").click();
    await expect(heading).toHaveText("March 2025");

    await navButton(page, "calendar-basic", "previous").click();
    await expect(heading).toHaveText("February 2025");
    await expect(page.getByTestId("calendar-basic-value")).toHaveText("2025-02-14");
  });

  test("opens the year picker over the day grid and selects a year", async ({page}) => {
    const trigger = calendar(page, "calendar-picker-trigger");
    const grid = calendar(page, "calendar-picker-grid");
    const dayGrid = calendar(page, "calendar-picker").locator('[data-slot="calendar-grid"]');

    await trigger.click();

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(grid).toHaveAttribute("data-open", "true");
    await expect(grid).toHaveAttribute("aria-hidden", "false");
    await expect(grid).toHaveCSS("opacity", "1");

    const dayBox = await dayGrid.boundingBox();
    const gridBox = await grid.boundingBox();

    expect(dayBox).not.toBeNull();
    expect(gridBox).not.toBeNull();
    expect(Math.abs(gridBox!.y - dayBox!.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(gridBox!.height - dayBox!.height)).toBeLessThanOrEqual(1);

    const current = grid.locator('[data-year="2025"]');

    await expect(current).toBeFocused();
    await expect(current).toHaveAttribute("tabindex", "0");
    await expect(grid.locator('[data-year="2024"]')).toHaveAttribute("tabindex", "-1");

    await page.keyboard.press("ArrowDown");

    const target = grid.locator('[data-year="2028"]');

    await expect(target).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(grid).toHaveAttribute("aria-hidden", "true");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger.locator('[data-slot="calendar-year-picker-trigger-heading"]')).toHaveText(
      "February 2028",
    );
    await expect(page.getByTestId("calendar-picker-value")).toHaveText("2025-02-14");
  });

  test("closes the year picker with Escape", async ({page}) => {
    const trigger = calendar(page, "calendar-picker-trigger");
    const grid = calendar(page, "calendar-picker-grid");

    await trigger.click();
    await expect(grid).toHaveAttribute("data-open", "true");

    await page.keyboard.press("Escape");

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(grid).toHaveAttribute("aria-hidden", "true");
    await expect(grid).not.toHaveAttribute("data-open");
  });

  test("selects a range across two clicks with a hover preview", async ({page}) => {
    const start = dayCell(page, "range-calendar", "2025-02-05");
    const end = dayCell(page, "range-calendar", "2025-02-09");

    await start.click();
    await expect(start).toHaveAttribute("data-selection-start", "true");

    await end.hover();
    await expect(end).toHaveAttribute("data-selection-end", "true");
    await expect(end).toHaveAttribute("data-selected", "true");

    await end.click();

    await expect(start).toHaveAttribute("data-selection-start", "true");
    await expect(start).toHaveAttribute("data-selected", "true");
    await expect(end).toHaveAttribute("data-selection-end", "true");
    await expect(end).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("range-calendar-value")).toHaveText("2025-02-05 → 2025-02-09");

    const middle = dayCell(page, "range-calendar", "2025-02-07");

    await expect(middle).toHaveAttribute("data-selected", "true");
    await expect(middle.locator('[data-slot="range-calendar-cell-button"]')).not.toHaveAttribute(
      "data-selected",
      "true",
    );
  });
});
