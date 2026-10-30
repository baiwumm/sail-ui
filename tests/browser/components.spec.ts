import {expect, test} from "@playwright/test";

test.describe("Button", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
  });

  test("tracks pointer hover and press with the upstream attributes", async ({page}) => {
    const button = page.locator("#buttons").getByRole("button", {name: "Primary", exact: true});

    await button.hover();
    await expect(button).toHaveAttribute("data-hovered", "true");

    const box = await button.boundingBox();

    expect(box).not.toBeNull();

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await expect(button).toHaveAttribute("data-pressed", "true");

    await page.mouse.up();
    await expect(button).not.toHaveAttribute("data-pressed", "true");
  });

  test("activates with the keyboard and exposes focus-visible", async ({page}) => {
    const themeButton = page.getByRole("button", {name: "Dark", exact: true});

    await page.locator("header h1").click();
    await page.keyboard.press("Tab");

    await expect(themeButton).toBeFocused();
    await expect(themeButton).toHaveAttribute("data-focus-visible", "true");

    await page.keyboard.press("Enter");

    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("button", {name: "Light", exact: true})).toBeVisible();
  });

  test("renders disabled and pending states", async ({page}) => {
    const disabled = page.locator("#buttons").getByRole("button", {name: "Disabled", exact: true});
    const pending = page.locator('#buttons button[data-pending="true"]');

    await expect(disabled).toBeDisabled();
    const disabledBox = await disabled.boundingBox();

    expect(disabledBox).not.toBeNull();
    await page.mouse.move(
      disabledBox!.x + disabledBox!.width / 2,
      disabledBox!.y + disabledBox!.height / 2,
    );
    await expect(disabled).not.toHaveAttribute("data-hovered", "true");

    await expect(pending).toBeDisabled();
    await expect(pending).toHaveAttribute("aria-busy", "true");
    await expect(pending.locator('[data-slot="spinner"]')).toBeVisible();
  });
});

test.describe("Modal", () => {
  test("opens, traps focus, and closes on Escape", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#modal button[aria-haspopup="dialog"]');
    await trigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAttribute("data-placement", "auto");

    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press("Tab");
      const contained = await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      );

      expect(contained).toBe(true);
    }

    await page.keyboard.press("Escape");

    await expect(dialog).not.toBeAttached();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("dismisses when the backdrop is pressed", async ({page}) => {
    await page.goto("/");

    await page.locator('#modal button[aria-haspopup="dialog"]').click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const viewport = page.viewportSize();

    expect(viewport).not.toBeNull();
    await page.mouse.click(8, 8);

    await expect(dialog).not.toBeAttached();
  });
});

test.describe("Select", () => {
  test("opens from the keyboard, highlights, and commits a new value", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#select [role="combobox"]');

    await expect(trigger).toContainText("California");

    await trigger.focus();
    await page.keyboard.press("ArrowDown");

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();

    await page.keyboard.press("ArrowDown");
    await expect(listbox.locator("[data-highlighted]")).toHaveText("Texas");

    await page.keyboard.press("Enter");

    await expect(listbox).not.toBeAttached();
    await expect(trigger).toContainText("Texas");
    await expect(page.getByTestId("select-value")).toHaveText("texas");
  });

  test("aliases the floating side into data-placement", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#select [role="combobox"]');
    await trigger.click();

    const popover = page.locator('[data-slot="select-popover"]');
    await expect(popover).toBeVisible();

    const triggerBox = await trigger.boundingBox();
    const popoverBox = await popover.boundingBox();

    expect(triggerBox).not.toBeNull();
    expect(popoverBox).not.toBeNull();

    const expectedSide = popoverBox!.y >= triggerBox!.y ? "bottom" : "top";

    await expect(popover).toHaveAttribute("data-placement", expectedSide);
  });

  test("clears the selection without opening the popover", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#select [role="combobox"]');
    const clearButton = page.locator('[data-slot="select-clear-button"]');

    await expect(trigger).toContainText("California");
    await clearButton.click();

    await expect(trigger).toContainText("Select one");
    await expect(clearButton).toHaveAttribute("data-empty", "true");
    await expect(page.getByTestId("select-value")).toHaveText("none");
    await expect(page.getByRole("listbox")).not.toBeAttached();
  });

  test("compound object parts resolve through <component :is>", async ({page}) => {
    await page.goto("/?compound=1");

    const compound = page.getByTestId("compound-demo");
    const trigger = compound.getByRole("combobox");

    await expect(trigger).toContainText("Texas");
    await trigger.click();

    await expect(page.getByRole("listbox")).toBeVisible();
  });
});
