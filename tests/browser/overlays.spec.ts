import {expect, test, type Locator, type Page} from "@playwright/test";

const SLOW_MOTION = "/?animations=slow";

async function expectHeldExit(page: Page, target: Locator) {
  await expect(target).toHaveAttribute("data-exiting", "true");

  await page.waitForTimeout(300);
  await expect(target).toBeAttached();

  await expect(target).not.toBeAttached({timeout: 5_000});
}

test.describe("Overlay exit hold", () => {
  test("Modal keeps the container mounted until the exit animation ends", async ({page}) => {
    await page.goto(SLOW_MOTION);
    await page.locator('#modal [role="button"][aria-haspopup="dialog"]').click();

    const container = page.locator('[data-slot="modal-container"]');

    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");

    await expectHeldExit(page, container);
  });

  test("AlertDialog keeps the container mounted until the exit animation ends", async ({page}) => {
    await page.goto(SLOW_MOTION);
    await page.locator('#alert-dialog [role="button"][aria-haspopup="dialog"]').click();

    const dialog = page.getByRole("alertdialog");
    const container = page.locator('[data-slot="alert-dialog-container"]');

    await expect(dialog).toBeVisible();
    await dialog.locator('[data-slot="alert-dialog-close-trigger"]').click();

    await expectHeldExit(page, container);
  });

  test("Drawer keeps the content mounted until the exit animation ends", async ({page}) => {
    await page.goto(SLOW_MOTION);
    await page.locator('#drawer button[aria-haspopup="dialog"]').nth(1).click();

    const dialog = page.getByRole("dialog");
    const content = page.locator('[data-slot="drawer-content"]');

    await expect(dialog).toBeVisible();
    await dialog.locator('[data-slot="drawer-close-trigger"]').click();

    await expectHeldExit(page, content);
  });

  test("Sheet keeps the content mounted until the exit animation ends", async ({page}) => {
    await page.goto(SLOW_MOTION);
    await page.locator('#sheet button[aria-haspopup="dialog"]').first().click();

    const dialog = page.getByRole("dialog");
    const content = page.locator('[data-slot="sheet-content"]');

    await expect(dialog).toBeVisible();
    await dialog.locator('[data-slot="sheet-close-trigger"]').click();

    await expectHeldExit(page, content);
  });

  test("Popover keeps the content mounted until the exit animation ends", async ({page}) => {
    await page.goto(SLOW_MOTION);
    await page.locator('#popover [data-slot="popover-trigger"]').first().click();

    const content = page.locator(".popover");

    await expect(content).toBeVisible();
    await page.keyboard.press("Escape");

    await expectHeldExit(page, content);
  });

  test("Tooltip keeps the content mounted until the exit animation ends", async ({page}) => {
    await page.goto(SLOW_MOTION);

    const trigger = page.locator('#tooltip [data-slot="tooltip-trigger"]').first();
    const content = page.locator(".tooltip");

    await trigger.hover();
    await expect(content).toBeVisible();
    await expect(content).not.toHaveAttribute("data-entering", "true", {timeout: 4_000});

    await page.mouse.move(0, 0);
    await expect(content).toHaveAttribute("data-exiting", "true");

    await page.waitForTimeout(300);
    await expect(content).toBeAttached();
    await expect(content).not.toBeAttached({timeout: 5_000});
  });

  test("Toast keeps the frontmost toast mounted until the exit animation ends", async ({page}) => {
    // Toast holds its fixed 300ms exit window from the queue, not the
    // `?animations=slow` CSS override.
    await page.goto("/");
    await page.locator("#toast").getByRole("button", {name: "Long queue"}).click();

    const frontmost = page
      .locator('[data-slot="toast-region"] [data-slot="toast"]')
      .filter({hasText: "Queued item 5"});

    await expect(frontmost).toBeVisible();
    await expect(frontmost).not.toHaveAttribute("data-entering", "true", {timeout: 4_000});
    await frontmost.hover();
    await frontmost.getByRole("button", {name: "Close"}).click();

    await expect(frontmost).toHaveAttribute("data-exiting", "true");

    await page.waitForTimeout(100);
    await expect(frontmost).toBeAttached();

    await expect(frontmost).not.toBeAttached({timeout: 5_000});
  });
});
