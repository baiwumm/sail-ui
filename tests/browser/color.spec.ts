import {expect, test, type Page} from "@playwright/test";

const pickerTrigger = (page: Page) => page.getByTestId("color-picker-trigger");
const pickerPopover = (page: Page) => page.locator('[data-slot="color-picker-popover"]');
const pickerSwatch = (page: Page) => pickerTrigger(page).locator('[data-slot="color-swatch"]');

async function drag(page: Page, x: number, y: number, toX: number, toY: number) {
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(toX, toY, {steps: 6});
  await page.mouse.up();
}

test.describe("Colors", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("opens the picker popover next to the trigger and closes with Escape", async ({page}) => {
    const trigger = pickerTrigger(page);

    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    const content = pickerPopover(page);

    await expect(content).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const placement = await content.getAttribute("data-placement");
    const triggerBox = await trigger.boundingBox();
    const contentBox = await content.boundingBox();

    expect(["top", "bottom"]).toContain(placement);
    expect(triggerBox).not.toBeNull();
    expect(contentBox).not.toBeNull();

    if (placement === "bottom") {
      expect(contentBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 1);
    } else {
      expect(contentBox!.y + contentBox!.height).toBeLessThanOrEqual(triggerBox!.y + 1);
    }

    await page.keyboard.press("Escape");

    await expect(content).toHaveCount(0);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("drags inside the color area", async ({page}) => {
    const area = page.getByTestId("color-area");

    await area.scrollIntoViewIfNeeded();

    const thumb = area.locator('[data-slot="color-area-thumb"]');
    const before = await thumb.getAttribute("aria-valuenow");
    const box = await area.boundingBox();

    expect(box).not.toBeNull();

    await drag(
      page,
      box!.x + box!.width * 0.2,
      box!.y + box!.height * 0.2,
      box!.x + box!.width * 0.8,
      box!.y + box!.height * 0.7,
    );

    await expect(thumb).not.toHaveAttribute("aria-valuenow", before ?? "0");
    await expect(page.getByTestId("color-area-value")).not.toHaveText("#ff0000");
  });

  test("drags the standalone hue slider", async ({page}) => {
    const slider = page.getByTestId("color-slider");

    await slider.scrollIntoViewIfNeeded();

    const track = slider.locator('[data-slot="color-slider-track"]');
    const thumb = slider.locator('[data-slot="color-slider-thumb"]');
    const box = await track.boundingBox();

    expect(box).not.toBeNull();

    await drag(
      page,
      box!.x + box!.width * 0.25,
      box!.y + box!.height / 2,
      box!.x + box!.width * 0.7,
      box!.y + box!.height / 2,
    );

    await expect(thumb).not.toHaveAttribute("aria-valuenow", "120");
    await expect(page.getByTestId("color-slider-value")).not.toHaveText("#00ff00");
  });

  test("selects a preset swatch inside the picker", async ({page}) => {
    const trigger = pickerTrigger(page);

    await trigger.evaluate((element) => element.scrollIntoView({block: "start"}));
    await trigger.click();

    const preset = pickerPopover(page).locator(
      '[data-slot="color-swatch-picker-item"][data-color="#0000ff"]',
    );

    await preset.click();

    await expect(preset).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("color-value")).toHaveText("#0000ff");
    await expect(pickerSwatch(page)).toHaveAttribute("aria-label", "vibrant blue-violet");
  });

  test("selects a color from the standalone swatch picker", async ({page}) => {
    const swatchPicker = page.getByTestId("color-swatch-picker");

    await swatchPicker.scrollIntoViewIfNeeded();

    const option = swatchPicker.locator(
      '[data-slot="color-swatch-picker-item"][data-color="#ffcc00"]',
    );

    await option.click();

    await expect(option).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("color-swatch-picker-value")).toHaveText("#ffcc00");
  });

  test("marks disabled swatch picker items", async ({page}) => {
    const disabledPicker = page.getByTestId("color-swatch-picker-disabled");

    await disabledPicker.scrollIntoViewIfNeeded();

    await expect(disabledPicker).toHaveAttribute("data-disabled", "true");
    await expect(disabledPicker.locator('[data-slot="color-swatch-picker-item"]')).toHaveCount(3);
    await expect(
      disabledPicker.locator('[data-slot="color-swatch-picker-item"][data-disabled="true"]'),
    ).toHaveCount(3);
  });
});
