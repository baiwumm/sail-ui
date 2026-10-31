import {expect, test, type Locator, type Page} from "@playwright/test";

const comboBox = (page: Page, testId: string) => page.getByTestId(testId);
const inputOf = (scope: Locator) => scope.locator('[data-slot="input"]');
const itemsOf = (scope: Locator) => scope.locator('[data-slot="list-box-item"]');
const optionOf = (scope: Locator, label: string) => itemsOf(scope).filter({hasText: label});

test.describe("Combo box and autocomplete", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("opens below the input, filters and selects with the keyboard", async ({page}) => {
    const field = comboBox(page, "combo-box-basic");
    const input = inputOf(field);

    await input.click();

    const popover = page.locator('[data-slot="combo-box-popover"]');

    await expect(popover).toBeVisible();
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(input).toHaveAttribute("aria-controls", /.+/);
    await expect(itemsOf(popover)).toHaveCount(5);

    const inputBox = await input.boundingBox();
    const popoverBox = await popover.boundingBox();

    expect(inputBox).not.toBeNull();
    expect(popoverBox).not.toBeNull();
    expect(popoverBox!.y).toBeGreaterThanOrEqual(inputBox!.y + inputBox!.height - 1);

    await input.fill("ban");

    await expect(itemsOf(popover)).toHaveCount(1);
    await expect(optionOf(popover, "Banana")).toBeVisible();

    await page.keyboard.press("Enter");

    await expect(popover).toHaveCount(0);
    await expect(input).toHaveValue("Banana");
    await expect(page.getByTestId("combo-box-value")).toHaveText("banana");
  });

  test("shows the empty state and commits a typed value when allowed", async ({page}) => {
    const field = comboBox(page, "combo-box-custom");
    const input = inputOf(field);
    const popover = page.locator('[data-slot="combo-box-popover"]');

    await field.locator('[data-slot="combo-box-trigger"]').click();
    await expect(popover).toBeVisible();

    await input.fill("grape");

    await expect(itemsOf(popover)).toHaveCount(0);
    await expect(popover.locator('[data-slot="empty-state"]')).toContainText(
      "Press Enter to use the typed value",
    );

    await page.keyboard.press("Enter");

    await expect(popover).toHaveCount(0);
    await expect(input).toHaveValue("grape");
    await expect(page.getByTestId("combo-box-custom-value")).toHaveText("grape");
  });

  test("filters the autocomplete and selects with Enter", async ({page}) => {
    const field = comboBox(page, "autocomplete-basic");
    const trigger = field.locator('[data-slot="autocomplete-trigger"]');

    await trigger.click();

    const popover = page.locator('[data-slot="autocomplete-popover"]');
    const search = popover.locator('[data-slot="search-field-input"]');

    await expect(popover).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(search).toBeFocused();

    const triggerBox = await trigger.boundingBox();
    const popoverBox = await popover.boundingBox();

    expect(triggerBox).not.toBeNull();
    expect(popoverBox).not.toBeNull();
    expect(popoverBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 1);

    await search.fill("flor");

    await expect(itemsOf(popover)).toHaveCount(1);
    await expect(optionOf(popover, "Florida")).toBeVisible();

    await page.keyboard.press("Enter");

    await expect(popover).toHaveCount(0);
    await expect(field.locator('[data-slot="autocomplete-value"]')).toHaveText("Florida");
    await expect(page.getByTestId("autocomplete-value")).toHaveText("florida");
  });

  test("closes the autocomplete with Escape and clears the value", async ({page}) => {
    const field = comboBox(page, "autocomplete-basic");
    const trigger = field.locator('[data-slot="autocomplete-trigger"]');

    await trigger.click();
    await expect(page.locator('[data-slot="autocomplete-popover"]')).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator('[data-slot="autocomplete-popover"]')).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await field.locator('[data-slot="autocomplete-clear-button"]').click();

    await expect(page.getByTestId("autocomplete-value")).toHaveText("none");
    await expect(field.locator('[data-slot="autocomplete-value"]')).toHaveText("Select a state");
    await expect(field.locator('[data-slot="autocomplete-value"]')).toHaveAttribute(
      "data-placeholder",
      "true",
    );
  });
});
