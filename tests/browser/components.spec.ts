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

    const trigger = page.locator('#modal [role="button"][aria-haspopup="dialog"]');
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

    await page.locator('#modal [role="button"][aria-haspopup="dialog"]').click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const viewport = page.viewportSize();

    expect(viewport).not.toBeNull();
    await page.mouse.click(8, 8);

    await expect(dialog).not.toBeAttached();
  });
});

test.describe("Toast", () => {
  test("stacks newest first, hides overflow, and dismisses with an exit phase", async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.locator("#toast").getByRole("button", {name: "Long queue"}).click();

    const region = page.locator('[data-slot="toast-region"]');
    const toasts = region.locator('[data-slot="toast"]');
    const frontmost = toasts.filter({hasText: "Queued item 5"});

    await expect(region).toHaveAttribute("aria-label", "5 notifications.");
    await expect(toasts).toHaveCount(5);
    await expect(frontmost).toBeVisible();
    await expect(frontmost).toHaveAttribute("data-frontmost", "true");

    await frontmost.hover();

    await expect(toasts.nth(3)).toHaveAttribute("data-hidden", "true");
    await expect(toasts.nth(3)).toHaveAttribute("inert", "");

    // The toast exit window is a fixed 300ms; record the transient
    // `data-exiting` phase from a MutationObserver so WebKit load cannot
    // make the assertion poll miss it.
    await page.evaluate(() => {
      const toast = document.querySelector('[data-slot="toast-region"] [data-slot="toast"]');

      (window as unknown as {__toastExiting: boolean}).__toastExiting = false;

      const observer = new MutationObserver(() => {
        if (toast?.getAttribute("data-exiting") === "true") {
          (window as unknown as {__toastExiting: boolean}).__toastExiting = true;
        }
      });

      if (toast) {
        observer.observe(toast, {attributeFilter: ["data-exiting"], attributes: true});
      }
    });

    await frontmost.getByRole("button", {name: "Close"}).click();

    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as {__toastExiting: boolean}).__toastExiting),
      )
      .toBe(true);
    await expect(region).toHaveAttribute("aria-label", "4 notifications.");
    await expect(frontmost).not.toBeAttached();
  });

  test("focuses the region with Alt+T and collapses with Escape", async ({page}) => {
    await page.goto("/");

    await page.locator("#toast").getByRole("button", {name: "Long queue"}).click();

    const region = page.locator('[data-slot="toast-region"]');
    const toasts = region.locator('[data-slot="toast"]');

    await expect(toasts).toHaveCount(5);
    await expect(toasts.first()).toBeVisible();

    await page.keyboard.press("Alt+t");

    await expect(region).toBeFocused();
    await expect(region).toHaveAttribute("data-expanded", "true");
    await expect(toasts.first()).toHaveAttribute("tabindex", "0");

    await page.keyboard.press("Escape");

    await expect(region).not.toBeFocused();
    await expect(region).not.toHaveAttribute("data-expanded", "true");
  });
});

test.describe("AlertDialog", () => {
  test("requires an explicit action, traps focus, and restores it on close", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#alert-dialog [role="button"][aria-haspopup="dialog"]');
    await trigger.click();

    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAttribute("data-placement", "center");

    for (let index = 0; index < 6; index += 1) {
      await page.keyboard.press("Tab");

      const contained = await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      );

      expect(contained).toBe(true);
    }

    await page.keyboard.press("Escape");
    await page.mouse.click(8, 8);

    await expect(dialog).toBeVisible();
    await expect(page.getByTestId("alert-dialog-state")).toHaveText("open: true");

    await dialog.getByRole("button", {name: "Close"}).click();

    await expect(dialog).not.toBeAttached();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });
});

test.describe("Drawer", () => {
  test("opens from the bottom, locks scroll, and dismisses with a drag", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#drawer button[aria-haspopup="dialog"]').first();

    await trigger.click();

    const dialog = page.getByRole("dialog");
    const content = page.locator('[data-slot="drawer-content"]');
    const handle = page.locator('[data-slot="drawer-handle"]');

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-placement", "bottom");
    await expect(content).toHaveAttribute("data-placement", "bottom");
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await expect(content).not.toHaveAttribute("data-entering", "true");

    const box = await handle.boundingBox();

    expect(box).not.toBeNull();

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + 240, {steps: 12});
    await page.mouse.up();

    await expect(dialog).not.toBeAttached();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("snaps back when the drag stays under the dismiss threshold", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#drawer button[aria-haspopup="dialog"]').first();

    await trigger.click();

    const dialog = page.getByRole("dialog");
    const content = page.locator('[data-slot="drawer-content"]');
    const handle = page.locator('[data-slot="drawer-handle"]');

    await expect(dialog).toBeVisible();
    await expect(content).not.toHaveAttribute("data-entering", "true");
    await expect(dialog).not.toHaveAttribute("data-entering", "true");

    const box = await handle.boundingBox();

    expect(box).not.toBeNull();

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(120);
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 + 10);
    await page.waitForTimeout(120);
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 + 20);
    await page.waitForTimeout(120);
    await page.mouse.up();

    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => (element as HTMLElement).style.transform)).toBe("");
  });

  test("slides a side drawer from the right and closes from the close trigger", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#drawer button[aria-haspopup="dialog"]').nth(1);

    await trigger.click();

    const dialog = page.getByRole("dialog");

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-placement", "right");
    await expect(page.locator('[data-slot="drawer-content"]')).toHaveAttribute(
      "data-placement",
      "right",
    );

    await dialog.locator('[data-slot="drawer-close-trigger"]').click();

    await expect(dialog).not.toBeAttached();
    await expect(trigger).toBeFocused();
  });
});

test.describe("Sheet", () => {
  test("opens from the bottom, animates in, and dismisses with a drag", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#sheet button[aria-haspopup="dialog"]').nth(1);

    await trigger.click();

    const dialog = page.getByRole("dialog");
    const content = page.locator('[data-slot="sheet-content"]');
    const handle = page.locator('[data-slot="sheet-handle"]');

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-placement", "bottom");
    await expect(content).toHaveAttribute("data-placement", "bottom");
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await expect(content).not.toHaveAttribute("data-entering", "true");
    await expect
      .poll(() => dialog.evaluate((element) => (element as HTMLElement).style.transform))
      .toBe("");

    const box = await handle.boundingBox();

    expect(box).not.toBeNull();

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + 240, {steps: 12});
    await page.mouse.up();

    await expect(dialog).not.toBeAttached();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("slides a side sheet from the left and closes from the close trigger", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#sheet button[aria-haspopup="dialog"]').first();

    await trigger.click();

    const dialog = page.getByRole("dialog");

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-placement", "left");
    await expect(page.locator('[data-slot="sheet-content"]')).toHaveAttribute(
      "data-placement",
      "left",
    );

    await dialog.locator('[data-slot="sheet-close-trigger"]').click();

    await expect(dialog).not.toBeAttached();
    await expect(trigger).toBeFocused();
  });
});

test.describe("Popover", () => {
  test("opens anchored with an arrow, closes on Escape, and restores focus", async ({page}) => {
    await page.goto("/?animations=slow");
    await page.waitForLoadState("networkidle");

    const trigger = page.locator('#popover [data-slot="popover-trigger"]').first();

    await trigger.click();

    const content = page.locator(".popover").first();

    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute("role", "dialog");
    await expect(content).toHaveAttribute("data-entering", "true");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator('[data-slot="popover-overlay-arrow"]')).toBeVisible();

    const triggerBox = await trigger.boundingBox();
    const contentBox = await content.boundingBox();

    expect(triggerBox).not.toBeNull();
    expect(contentBox).not.toBeNull();

    const expectedSide = contentBox!.y >= triggerBox!.y ? "bottom" : "top";

    await expect(content).toHaveAttribute("data-placement", expectedSide);

    await page.keyboard.press("Escape");

    await expect(content).not.toBeAttached();
    await expect(trigger).toBeFocused();
  });

  test("closes when the pointer presses outside", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('[data-slot="popover-trigger"]');
    const content = page.locator(".popover");

    await trigger.click();
    await expect(content).toBeVisible();

    await page.locator("#popover h2").click();

    await expect(content).not.toBeAttached();
  });

  test("keeps the outer popover open while a nested popover opens and closes", async ({page}) => {
    await page.goto("/");

    await page.locator('#popover [data-slot="popover-trigger"]').first().click();

    const popovers = page.locator(".popover");

    await expect(popovers).toHaveCount(1);

    await page.getByRole("button", {name: "Open nested popover"}).click();
    await expect(popovers).toHaveCount(2);

    await page.keyboard.press("Escape");
    await expect(popovers).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(popovers).toHaveCount(0);
  });
});

test.describe("Tooltip", () => {
  test("opens on hover with placement and describes the trigger", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#tooltip [data-slot="tooltip-trigger"]').first();

    await trigger.hover();

    const content = page.locator(".tooltip");

    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute("data-placement", "top");
    await expect(page.locator('[data-slot="overlay-arrow"]')).toBeAttached();

    const describedBy = await trigger.getAttribute("aria-describedby");

    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveAttribute("role", "tooltip");

    await page.mouse.move(0, 0);

    await expect(content).not.toBeAttached();
  });

  test("focus-only triggers ignore hover and open on focus", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#tooltip [data-slot="tooltip-trigger"]').nth(1);

    await trigger.hover();
    await expect(page.locator(".tooltip")).toHaveCount(0);

    await trigger.focus();

    const content = page.locator(".tooltip");

    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute("data-placement", "bottom");
  });
});

test.describe("Select", () => {
  test("opens from the keyboard, highlights, and commits a new value", async ({page}) => {
    await page.goto("/");

    const trigger = page.locator('#select [role="combobox"]');

    await expect(trigger).toContainText("California");

    await trigger.focus();
    await page.keyboard.press("ArrowDown");

    const popover = page.locator('[data-slot="select-popover"]');
    await expect(popover).toBeVisible();

    await page.keyboard.press("ArrowDown");
    await expect(popover.locator("[data-focused]")).toHaveText("Texas");

    await page.keyboard.press("Enter");

    await expect(popover).not.toBeAttached();
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
    const clearButton = page.locator('#select [data-slot="select-clear-button"]');

    await expect(trigger).toContainText("California");
    await clearButton.click();

    await expect(trigger).toContainText("Select one");
    await expect(clearButton).toHaveAttribute("data-empty", "true");
    await expect(page.getByTestId("select-value")).toHaveText("none");
    await expect(page.locator('[data-slot="select-popover"]')).not.toBeAttached();
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
