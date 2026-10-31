import {expect, test, type Page} from "@playwright/test";

async function centerInViewport(page: Page, testId: string) {
  await page.getByTestId(testId).evaluate((element) => element.scrollIntoView({block: "center"}));
}

test.describe("ScrollShadow", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("tracks vertical shadow states while scrolling", async ({page}) => {
    const shadow = page.getByTestId("scroll-shadow-vertical");

    await centerInViewport(page, "scroll-shadow-vertical");

    await expect(shadow).toHaveAttribute("data-scroll-shadow-mode", "auto");
    await expect(shadow).toHaveAttribute("data-top-scroll", "false");
    await expect(shadow).toHaveAttribute("data-bottom-scroll", "true");

    await shadow.evaluate((element) => {
      element.scrollTop = 60;
    });

    await expect(shadow).toHaveAttribute("data-top-bottom-scroll", "true");
    await expect(shadow).not.toHaveAttribute("data-top-scroll");

    await shadow.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });

    await expect(shadow).toHaveAttribute("data-top-scroll", "true");
    await expect(shadow).toHaveAttribute("data-bottom-scroll", "false");
    await expect(shadow).not.toHaveAttribute("data-top-bottom-scroll");
  });

  test("tracks logical left and right shadows while scrolling", async ({page}) => {
    const shadow = page.getByTestId("scroll-shadow-horizontal");

    await centerInViewport(page, "scroll-shadow-horizontal");

    await expect(shadow).toHaveAttribute("data-left-scroll", "false");
    await expect(shadow).toHaveAttribute("data-right-scroll", "true");

    await shadow.evaluate((element) => {
      element.scrollLeft = 60;
    });

    await expect(shadow).toHaveAttribute("data-left-right-scroll", "true");

    await shadow.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });

    await expect(shadow).toHaveAttribute("data-left-scroll", "true");
    await expect(shadow).toHaveAttribute("data-right-scroll", "false");
    await expect(shadow).not.toHaveAttribute("data-left-right-scroll");
  });

  test("uses logical start and end edges in RTL", async ({page}) => {
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });

    const shadow = page.getByTestId("scroll-shadow-horizontal");

    await centerInViewport(page, "scroll-shadow-horizontal");

    await expect(shadow).toHaveAttribute("data-left-scroll", "false");
    await expect(shadow).toHaveAttribute("data-right-scroll", "true");

    await shadow.evaluate((element) => {
      element.scrollLeft = -element.scrollWidth;
    });

    await expect(shadow).toHaveAttribute("data-left-scroll", "true");
    await expect(shadow).toHaveAttribute("data-right-scroll", "false");
  });

  test("applies a controlled visibility state", async ({page}) => {
    const shadow = page.getByTestId("scroll-shadow-controlled");

    await centerInViewport(page, "scroll-shadow-controlled");

    await expect(shadow).toHaveAttribute("data-scroll-shadow-mode", "manual");
    await expect(shadow).toHaveAttribute("data-top-bottom-scroll", "true");
    await expect(shadow).not.toHaveAttribute("data-top-scroll");
    await expect(shadow).not.toHaveAttribute("data-bottom-scroll");
  });

  test("clears shadow attributes when disabled and without overflow", async ({page}) => {
    const disabled = page.getByTestId("scroll-shadow-disabled");

    await centerInViewport(page, "scroll-shadow-disabled");

    await expect(disabled).toHaveAttribute("data-scroll-shadow-mode", "manual");
    await expect(disabled).not.toHaveAttribute("data-top-scroll");
    await expect(disabled).not.toHaveAttribute("data-bottom-scroll");
    await expect(disabled).not.toHaveAttribute("data-top-bottom-scroll");

    const noOverflow = page.getByTestId("scroll-shadow-no-overflow");

    await centerInViewport(page, "scroll-shadow-no-overflow");

    await expect(noOverflow).toHaveClass(/scroll-shadow--hide-scrollbar/);
    await expect(noOverflow).toHaveAttribute("data-top-scroll", "false");
    await expect(noOverflow).toHaveAttribute("data-bottom-scroll", "false");
    await expect(noOverflow).not.toHaveAttribute("data-top-bottom-scroll");
  });

  test("honours the offset and size props", async ({page}) => {
    const shadow = page.getByTestId("scroll-shadow-offset");

    await centerInViewport(page, "scroll-shadow-offset");

    await expect(shadow).toHaveAttribute("data-scroll-shadow-size", "80");
    await expect(shadow).toHaveCSS("--scroll-shadow-offset", "24px");
    await expect(shadow).toHaveCSS("--scroll-shadow-size", "80px");

    await shadow.evaluate((element) => {
      element.scrollTop = 12;
    });

    await expect(shadow).toHaveAttribute("data-top-scroll", "false");
    await expect(shadow).toHaveAttribute("data-bottom-scroll", "true");

    await shadow.evaluate((element) => {
      element.scrollTop = 40;
    });

    await expect(shadow).toHaveAttribute("data-top-bottom-scroll", "true");
  });

  test("recomputes when content grows", async ({page}) => {
    const shadow = page.getByTestId("scroll-shadow-vertical");

    await centerInViewport(page, "scroll-shadow-vertical");

    await shadow.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });

    await expect(shadow).toHaveAttribute("data-bottom-scroll", "false");

    await shadow.evaluate((element) => {
      const spacer = document.createElement("div");

      spacer.style.height = "240px";
      element.firstElementChild?.append(spacer);
    });

    await expect(shadow).toHaveAttribute("data-top-bottom-scroll", "true");
  });

  test("emits visibility changes while scrolling", async ({page}) => {
    const shadow = page.getByTestId("scroll-shadow-event");
    const state = page.getByTestId("scroll-shadow-event-value");

    await centerInViewport(page, "scroll-shadow-event");

    await expect(state).toHaveText("bottom");

    await shadow.evaluate((element) => {
      element.scrollTop = 60;
    });

    await expect(state).toHaveText("both");

    await shadow.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });

    await expect(state).toHaveText("top");
  });
});
