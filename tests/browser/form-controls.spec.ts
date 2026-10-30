import {expect, test, type Page} from "@playwright/test";

async function setDirection(page: Page, dir: "ltr" | "rtl") {
  await page.evaluate((value) => {
    document.documentElement.dir = value;
  }, dir);
}

function forms(page: Page) {
  return page.locator("#forms");
}

test.describe("Form controls", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("checkbox toggles with the keyboard and reports the state", async ({page}) => {
    const content = forms(page)
      .locator('#forms-states [data-slot="checkbox-content"]')
      .first();
    const input = content.locator('input[type="checkbox"]');

    await expect(content).toHaveAttribute("data-selected", "true");

    await page.locator("header h1").click();
    await page.keyboard.press("Tab");
    await input.focus();
    await page.keyboard.press("Space");

    await expect(content).not.toHaveAttribute("data-selected", "true");
    await expect(content).toHaveAttribute("data-focus-visible", "true");
  });

  test("checkbox does not leave a sticky hover state after a tap", async ({page}) => {
    const content = forms(page)
      .locator('#forms-states [data-slot="checkbox-content"]')
      .first();

    await content.dispatchEvent("pointerenter", {pointerType: "touch"});
    await expect(content).not.toHaveAttribute("data-hovered", "true");

    await content.dispatchEvent("pointerenter", {pointerType: "mouse"});
    await expect(content).toHaveAttribute("data-hovered", "true");
  });

  test("radio group moves the selection with the arrow keys", async ({page}) => {
    const group = forms(page).locator('#forms-settings [data-slot="radio-group"]');
    const radios = group.locator('[data-slot="radio"]');

    await group.locator('input[type="radio"]').first().focus();
    await page.keyboard.press("ArrowDown");

    await expect(radios.nth(1)).toHaveAttribute("data-selected", "true");
    await expect(radios.nth(0)).not.toHaveAttribute("data-selected", "true");
  });

  test("toolbar moves the focus with the arrow keys", async ({page}) => {
    const toolbar = forms(page).locator('#forms-toolbar [data-slot="toolbar"]');
    const buttons = toolbar.locator('[data-slot="toggle-button"]');

    await buttons.first().focus();
    await page.keyboard.press("ArrowRight");

    await expect(buttons.nth(1)).toBeFocused();
  });

  test("toolbar reverses the arrow keys in RTL", async ({page}) => {
    const toolbar = forms(page).locator('#forms-toolbar [data-slot="toolbar"]');
    const buttons = toolbar.locator('[data-slot="toggle-button"]');

    await setDirection(page, "rtl");

    await buttons.nth(1).focus();
    await page.keyboard.press("ArrowRight");

    await expect(buttons.nth(0)).toBeFocused();
  });

  test("toggle button group keeps the pressed state", async ({page}) => {
    const group = forms(page).locator('#forms-toolbar [data-slot="toggle-button-group"]');
    const buttons = group.locator('[data-slot="toggle-button"]');

    await expect(buttons.first()).toHaveAttribute("data-selected", "true");

    await buttons.nth(1).click();
    await expect(buttons.nth(1)).toHaveAttribute("data-selected", "true");
    await expect(buttons.first()).toHaveAttribute("data-selected", "true");
  });

  test("number field steps with the keyboard", async ({page}) => {
    const input = forms(page).locator('#forms-settings input[role="spinbutton"]');

    await input.focus();
    await expect(input).toHaveAttribute("aria-valuenow", "3");

    await page.keyboard.press("ArrowUp");
    await expect(input).toHaveAttribute("aria-valuenow", "4");

    await page.keyboard.press("ArrowDown");
    await expect(input).toHaveAttribute("aria-valuenow", "3");
  });

  test("slider drags the thumb", async ({page}) => {
    const slider = forms(page).locator('#forms-settings [data-slot="slider"]');
    const thumb = slider.locator('[data-slot="slider-thumb"]');
    const track = slider.locator('[data-slot="slider-track"]');

    await track.scrollIntoViewIfNeeded();

    const box = await track.boundingBox();

    expect(box).not.toBeNull();

    await page.mouse.move(box!.x + box!.width * 0.4, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width * 0.8, box!.y + box!.height / 2, {steps: 8});
    await page.mouse.up();

    const value = Number(await thumb.getAttribute("aria-valuenow"));

    expect(value).toBeGreaterThan(60);
    await expect(thumb).not.toHaveAttribute("data-dragging", "true");
  });

  test("slider steps with the arrow keys", async ({page}) => {
    const thumb = forms(page).locator('#forms-settings [data-slot="slider-thumb"]');

    await thumb.focus();
    await expect(thumb).toHaveAttribute("aria-valuenow", "40");

    await page.keyboard.press("ArrowRight");
    await expect(thumb).toHaveAttribute("aria-valuenow", "41");
  });

  test("search field clears the value", async ({page}) => {
    const search = forms(page).locator('#forms-search [data-slot="search-field"]');
    const input = search.locator('[data-slot="search-field-input"]');
    const clear = search.locator('[data-slot="search-field-clear-button"]');

    await expect(input).toHaveValue("sail ui");

    await clear.click();
    await expect(input).toHaveValue("");
  });

  test("form does not submit while an IME composition is active", async ({page}) => {
    await page.evaluate(() => {
      const form = document.querySelector("#forms-login form")!;

      (window as unknown as {submitted: boolean}).submitted = false;
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        (window as unknown as {submitted: boolean}).submitted = true;
      });
    });

    const email = forms(page).locator('input[name="email"]');

    await email.focus();

    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>('input[name="email"]')!;

      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          cancelable: true,
          isComposing: true
        })
      );
    });

    expect(
      await page.evaluate(() => (window as unknown as {submitted: boolean}).submitted)
    ).toBe(false);
  });

  test("press and click stay separate events", async ({page}) => {
    const button = forms(page).locator("#forms-login button[type=submit]");

    await expect(button).toHaveAttribute("type", "submit");
    await expect(button).toHaveAttribute("data-press-count", "0");
    await expect(button).toHaveAttribute("data-click-count", "0");

    await button.click();
    await expect(button).toHaveAttribute("data-press-count", "1");
    await expect(button).toHaveAttribute("data-click-count", "1");

    await button.focus();
    await page.keyboard.press("Space");

    await expect(button).toHaveAttribute("data-press-count", "2");
    await expect(button).toHaveAttribute("data-click-count", "2");
  });
});
