import {expect, test} from "@playwright/test";

async function setDirection(page: import("@playwright/test").Page, dir: "ltr" | "rtl") {
  await page.evaluate((value) => {
    document.documentElement.dir = value;
  }, dir);
}

async function itemPositions(locator: import("@playwright/test").Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().x),
  );
}

test.describe("RTL", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("breadcrumbs mirror separators and item order", async ({page}) => {
    const nav = page.locator('#breadcrumbs [data-slot="breadcrumbs"]').first();
    const items = nav.locator('[data-slot="breadcrumbs-item"]');
    const separator = nav.locator('[data-slot="breadcrumbs-separator"]').first();

    const ltrPositions = await itemPositions(items);
    expect(ltrPositions[0]).toBeLessThan(ltrPositions.at(-1)!);
    await expect(separator).toHaveCSS("rotate", "none");

    await setDirection(page, "rtl");

    const rtlPositions = await itemPositions(items);
    expect(rtlPositions[0]).toBeGreaterThan(rtlPositions.at(-1)!);
    await expect(separator).toHaveCSS("rotate", "180deg");
  });

  test("avatar group overlaps on the logical inline-end edge", async ({page}) => {
    const group = page.locator("#avatar .avatar-group--ring").first();
    const avatars = group.locator(":scope > .avatar");
    const first = avatars.nth(0);
    const second = avatars.nth(1);

    const ltr = await Promise.all([first.boundingBox(), second.boundingBox()]);
    expect(ltr[0]).not.toBeNull();
    expect(ltr[1]).not.toBeNull();
    expect(ltr[1]!.x).toBeLessThan(ltr[0]!.x + ltr[0]!.width);
    await expect(second).toHaveCSS("margin-inline-start", "-8px");

    await setDirection(page, "rtl");

    const rtl = await Promise.all([first.boundingBox(), second.boundingBox()]);
    expect(rtl[0]).not.toBeNull();
    expect(rtl[1]).not.toBeNull();
    expect(rtl[1]!.x).toBeLessThan(rtl[0]!.x);
    expect(rtl[1]!.x + rtl[1]!.width).toBeGreaterThan(rtl[0]!.x);
    await expect(second).toHaveCSS("margin-inline-start", "-8px");
  });

  test("progress circle keeps its geometry unmirrored", async ({page}) => {
    const circle = page.locator('#progress [data-slot="progress-circle"]').first();
    const track = circle.locator('[data-slot="progress-circle-track"]');
    const fill = circle.locator('[data-slot="progress-circle-fill-circle"]');

    const readGeometry = async () =>
      fill.evaluate((element) => {
        const styles = getComputedStyle(element);

        return {
          dashArray: styles.strokeDasharray,
          dashOffset: styles.strokeDashoffset,
          rotate: styles.rotate,
          transform: styles.transform,
        };
      });

    const ltr = await readGeometry();

    await setDirection(page, "rtl");

    const rtl = await readGeometry();

    expect(rtl).toEqual(ltr);
    await expect(track).toHaveCSS("transform", "none");
    await expect(track).toHaveCSS("rotate", "none");
  });
});
