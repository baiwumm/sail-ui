import {expect, test, type Page} from "@playwright/test";

const basicSelectTrigger = (page: Page) =>
  page.locator('#collections-select [data-testid="select-basic-trigger"]');

async function centerInViewport(page: Page, selector: string) {
  await page.locator(selector).evaluate((element) => element.scrollIntoView({block: "center"}));
}

test.describe("Select", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
  });

  test("positions the popover below the trigger", async ({page}) => {
    await centerInViewport(page, '#collections-select [data-testid="select-basic-trigger"]');

    const trigger = basicSelectTrigger(page);
    const triggerBox = await trigger.boundingBox();

    expect(triggerBox).not.toBeNull();

    await trigger.click();

    const popover = page.locator('[data-slot="select-popover"]');

    await expect(popover).toBeVisible();
    await expect(popover).toHaveAttribute("data-placement", "bottom");

    const popoverBox = await popover.boundingBox();

    expect(popoverBox).not.toBeNull();
    expect(popoverBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 4);

    await page.keyboard.press("Escape");
    await expect(popover).not.toBeAttached();
    await expect(trigger).not.toHaveAttribute("data-open");
  });

  test("supports arrow keys, Home/End, typeahead, Enter and Escape", async ({page}) => {
    await centerInViewport(page, '#collections-select [data-testid="select-basic-trigger"]');

    const trigger = basicSelectTrigger(page);
    const popover = page.locator('[data-slot="select-popover"]');
    const options = popover.locator('[data-slot="list-box-item"]');

    await trigger.focus();
    await page.keyboard.press("Enter");

    await expect(popover).toBeVisible();
    await expect(trigger).toHaveAttribute("data-open", "true");

    await page.keyboard.press("End");
    await expect(options.last()).toBeFocused();
    await expect(options.last()).toContainText("Washington");

    await page.keyboard.press("Home");
    await expect(options.first()).toBeFocused();
    await expect(options.first()).toContainText("Florida");

    await page.keyboard.press("ArrowDown");
    await expect(options.nth(1)).toBeFocused();

    await page.keyboard.type("tex");
    const texas = options.filter({hasText: "Texas"});

    await expect(texas).toBeFocused();

    await page.keyboard.press("Enter");

    await expect(popover).not.toBeAttached();
    await expect(page.getByTestId("select-basic-value")).toHaveText("texas");
    await expect(trigger).not.toHaveAttribute("data-open");

    await trigger.click();
    await expect(popover).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(popover).not.toBeAttached();
    await expect(page.getByTestId("select-basic-value")).toHaveText("texas");
  });
});

test.describe("Dropdown", () => {
  test("flips above the trigger when there is no room below", async ({page}) => {
    await page.goto("/");

    const trigger = page.getByRole("button", {name: "Edge actions", exact: true});

    await trigger.evaluate((element) => {
      element.scrollIntoView({block: "end"});
      window.scrollBy(0, 48);
    });

    const viewport = page.viewportSize();
    const triggerBox = await trigger.boundingBox();

    expect(viewport).not.toBeNull();
    expect(triggerBox).not.toBeNull();
    expect(triggerBox!.y + triggerBox!.height).toBeGreaterThan(viewport!.height - 80);

    await trigger.click();

    const popover = page.locator('[data-slot="dropdown-popover"]');

    await expect(popover).toBeVisible();
    await expect(popover).toHaveAttribute("data-placement", "top");
    await expect(popover).not.toHaveAttribute("data-entering");

    const popoverBox = await popover.boundingBox();

    expect(popoverBox).not.toBeNull();
    expect(popoverBox!.y + popoverBox!.height).toBeLessThanOrEqual(triggerBox!.y + 1);

    await page.keyboard.press("Escape");
    await expect(popover).not.toBeAttached();
  });
});

test.describe("Tabs", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
  });

  test("activates horizontal tabs with arrow keys", async ({page}) => {
    const overview = page.getByRole("tab", {name: "Overview", exact: true});
    const activity = page.getByRole("tab", {name: "Activity", exact: true});

    await expect(overview).toHaveAttribute("data-selected", "true");
    await overview.focus();
    await page.keyboard.press("ArrowRight");

    await expect(activity).toBeFocused();
    await expect(activity).toHaveAttribute("data-selected", "true");
    await expect(overview).not.toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("tabs-value")).toHaveText("activity");
    await expect(page.getByRole("tabpanel", {name: "Activity"})).toHaveText("Activity content");
  });

  test("moves focus without selecting in manual vertical tabs", async ({page}) => {
    const account = page.getByRole("tab", {name: "Account", exact: true});
    const security = page.getByRole("tab", {name: "Security", exact: true});

    await expect(account).toHaveAttribute("data-selected", "true");
    await account.focus();
    await page.keyboard.press("ArrowDown");

    await expect(security).toBeFocused();
    await expect(security).not.toHaveAttribute("data-selected", "true");
    await expect(account).toHaveAttribute("data-selected", "true");

    await page.keyboard.press("Enter");

    await expect(security).toHaveAttribute("data-selected", "true");
    await expect(account).not.toHaveAttribute("data-selected", "true");
    await expect(page.getByRole("tabpanel", {name: "Security"})).toHaveText("Security content");
  });
});

test.describe("Pagination", () => {
  test("marks the current page and moves with previous/next", async ({page}) => {
    await page.goto("/");

    const pagination = page.getByRole("navigation", {name: "Docs pages"});
    const summary = pagination.locator('[data-slot="pagination-summary"]');

    await expect(summary).toHaveText("Page 3 of 10");

    const active = pagination.locator('[data-slot="pagination-link"][aria-current="page"]');

    await expect(active).toHaveText("3");
    await expect(active).toHaveAttribute("data-active", "true");
    await expect(page.getByTestId("pagination-page")).toHaveText("3");

    await pagination.getByRole("button", {name: "Next"}).click();

    await expect(summary).toHaveText("Page 4 of 10");
    await expect(active).toHaveText("4");
    await expect(page.getByTestId("pagination-page")).toHaveText("4");

    await pagination.getByRole("button", {name: "Previous"}).click();

    await expect(summary).toHaveText("Page 3 of 10");
    await expect(active).toHaveText("3");
  });
});
