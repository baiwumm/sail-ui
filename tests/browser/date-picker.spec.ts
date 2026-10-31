import {expect, test, type Page} from "@playwright/test";

const picker = (page: Page, testId: string) => page.getByTestId(testId);
const trigger = (page: Page, testId: string, slot: "date-picker" | "date-range-picker") =>
  picker(page, testId).locator(`[data-slot="${slot}-trigger"]`);
const popover = (page: Page, slot: "date-picker" | "date-range-picker") =>
  page.locator(`[data-slot="${slot}-popover"]`);
const dayCell = (page: Page, slot: "calendar" | "range-calendar", iso: string) =>
  popover(page, slot === "calendar" ? "date-picker" : "date-range-picker").locator(
    `[data-slot="${slot}-cell"][data-value="${iso}"]`,
  );

test.describe("Date pickers", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("opens below the field and commits the selected day", async ({page}) => {
    const field = picker(page, "date-picker-basic");
    const dateTrigger = trigger(page, "date-picker-basic", "date-picker");

    await dateTrigger.click();

    const content = popover(page, "date-picker");

    await expect(content).toBeVisible();
    await expect(dateTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(field).toHaveAttribute("data-open", "true");

    const triggerBox = await dateTrigger.boundingBox();
    const contentBox = await content.boundingBox();

    expect(triggerBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    expect(contentBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 1);

    await dayCell(page, "calendar", "2025-02-20").click();

    await expect(content).toHaveCount(0);
    await expect(page.getByTestId("date-picker-value")).toHaveText("2025-02-20");
    await expect(dateTrigger).toBeFocused();
  });

  test("closes with Escape and restores focus to the trigger", async ({page}) => {
    const dateTrigger = trigger(page, "date-picker-basic", "date-picker");

    await dateTrigger.click();
    await expect(popover(page, "date-picker")).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(popover(page, "date-picker")).toHaveCount(0);
    await expect(dateTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(dateTrigger).toBeFocused();
  });

  test("selects a stay range across two clicks", async ({page}) => {
    const rangeTrigger = trigger(page, "date-range-picker-basic", "date-range-picker");

    await rangeTrigger.click();
    await expect(popover(page, "date-range-picker")).toBeVisible();

    await dayCell(page, "range-calendar", "2025-02-15").click();
    await expect(popover(page, "date-range-picker")).toBeVisible();

    await dayCell(page, "range-calendar", "2025-02-20").click();

    await expect(popover(page, "date-range-picker")).toHaveCount(0);
    await expect(page.getByTestId("date-range-picker-value")).toHaveText("2025-02-15 → 2025-02-20");
    await expect(rangeTrigger).toBeFocused();
  });

  test("does not open a disabled picker", async ({page}) => {
    const disabledTrigger = trigger(page, "date-range-picker-disabled", "date-range-picker");

    await expect(disabledTrigger).toBeDisabled();
    await expect(disabledTrigger).toHaveAttribute("data-disabled", "true");

    await disabledTrigger.dispatchEvent("click");

    await expect(popover(page, "date-range-picker")).toHaveCount(0);
    await expect(page.getByTestId("date-range-picker-disabled")).not.toHaveAttribute(
      "data-open",
      "true",
    );
  });
});
