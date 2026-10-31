import {expect, test} from "@playwright/test";

test.describe("Table", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("exposes the grid contract and moves focus with the keyboard", async ({page}) => {
    const basic = page.getByTestId("table-basic").locator('[data-slot="table-content"]');
    const cell = (row: number, column: number) =>
      basic.locator(`tbody [data-row-index="${row}"][data-col-index="${column}"]`);

    await expect(basic).toHaveAttribute("role", "grid");
    await expect(basic).toHaveAttribute("aria-label", "Team members");
    await expect(basic).toHaveAttribute("aria-rowcount", "5");
    await expect(basic).toHaveAttribute("aria-colcount", "4");
    await expect(cell(0, 0)).toHaveAttribute("role", "rowheader");
    await expect(cell(0, 0)).toHaveText("Kate Moore");
    await expect(cell(0, 2)).toHaveAttribute("role", "gridcell");

    await basic.focus();
    await page.keyboard.press("ArrowDown");
    await expect(cell(0, 0)).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(cell(0, 1)).toBeFocused();

    await page.keyboard.press("End");
    await expect(cell(0, 3)).toBeFocused();

    await page.keyboard.press("Home");
    await expect(cell(0, 0)).toBeFocused();

    await page.keyboard.press("ArrowUp");
    await expect(basic.locator('thead [data-row-index="-1"][data-col-index="0"]')).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(cell(2, 0)).toBeFocused();

    await page.keyboard.press("ControlOrMeta+End");
    await expect(cell(3, 3)).toBeFocused();

    await page.keyboard.press("ControlOrMeta+Home");
    await expect(basic.locator('thead [data-row-index="-1"][data-col-index="0"]')).toBeFocused();
  });

  test("renders custom cells and the empty state", async ({page}) => {
    const custom = page.getByTestId("table-custom-cells").locator('[data-slot="table-content"]');

    await expect(custom.getByText("On Leave", {exact: true})).toBeVisible();
    await expect(custom.locator('[data-slot="chip"]').filter({hasText: "On Leave"})).toHaveClass(
      /chip--warning/,
    );

    const empty = page.getByTestId("table-empty").locator('[data-slot="table-content"]');
    const emptyRow = empty.locator("tbody tr");

    await expect(empty.locator('[data-slot="table-body"]')).toHaveAttribute("data-empty", "true");
    await expect(emptyRow.locator("td")).toHaveAttribute("colspan", "4");
    await expect(emptyRow).toContainText("No results found");
  });

  test("sorts columns and toggles multiple selection", async ({page}) => {
    const sortable = page.getByTestId("table-sortable").locator('[data-slot="table-content"]');
    const nameHeader = sortable.locator('thead [data-slot="table-column"]').first();
    const firstCell = sortable.locator('tbody [data-row-index="0"][data-col-index="0"]').first();

    await expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    await expect(firstCell).toHaveText("John Smith");

    await nameHeader.click();

    await expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    await expect(firstCell).toHaveText("Sara Johnson");

    const selection = page.getByTestId("table-selection").locator('[data-slot="table-content"]');
    const rows = selection.locator("tbody [data-slot='table-row']");

    await expect(selection).toHaveAttribute("aria-multiselectable", "true");
    await expect(rows.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(rows.nth(3)).toHaveAttribute("aria-disabled", "true");

    await rows.nth(0).locator('[data-slot="table-cell"]').first().click();

    await expect(rows.nth(0)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ControlOrMeta+a");

    await expect(rows.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(rows.nth(3)).toHaveAttribute("aria-selected", "false");
  });

  test("resizes columns with pointer drag and the range input", async ({page}) => {
    const resizable = page.getByTestId("table-resizable").locator('[data-slot="table-content"]');
    const nameHeader = resizable.locator('thead [data-slot="table-column"]').first();
    const resizer = resizable.locator('thead [data-slot="table-column-resizer"]').first();
    const input = resizer.locator('input[type="range"]');

    await expect(resizable).toHaveAttribute("style", /table-layout:\s*fixed/);
    await expect(resizer).toHaveAttribute("role", "presentation");
    await expect(resizer).toHaveAttribute("data-resizable-direction", "both");
    await expect(input).toHaveAttribute("aria-label", "Resizer");
    await expect(input).toHaveAttribute("aria-orientation", "horizontal");
    await expect(input).toHaveAttribute("aria-valuetext", "200 pixels");

    await resizer.scrollIntoViewIfNeeded();

    const before = await nameHeader.boundingBox();
    const handle = await resizer.boundingBox();

    expect(before).not.toBeNull();
    expect(handle).not.toBeNull();

    const x = handle!.x + 2;
    const y = handle!.y + handle!.height / 2;

    await page.mouse.move(x, y);
    await expect(resizer).toHaveAttribute("data-hovered", "true");

    await page.mouse.down();
    await expect(resizer).toHaveAttribute("data-resizing", "true");

    await page.mouse.move(x + 60, y, {steps: 4});
    await expect(input).toHaveValue("260");

    await page.mouse.up();
    await expect(resizer).not.toHaveAttribute("data-resizing");

    const after = await nameHeader.boundingBox();

    expect(after).not.toBeNull();
    expect(after!.width).toBeGreaterThan(before!.width + 40);

    await input.focus();
    await input.press("ArrowRight");

    await expect(input).toHaveValue("270");
    await expect(input).toHaveAttribute("aria-valuetext", "270 pixels");
  });

  test("virtualizes 1000 rows and reaches the last row", async ({page}) => {
    const wrapper = page.getByTestId("table-virtualized");
    const scroll = wrapper.locator('[data-slot="table-scroll-container"]');
    const content = wrapper.locator('[data-slot="table-content"]');
    const rows = content.locator('[data-slot="table-row"]');
    const cell = (row: number, column: number) =>
      content.locator(`[data-row-index="${row}"][data-col-index="${column}"]`);

    await expect(content).toHaveAttribute("role", "grid");
    await expect(content).toHaveAttribute("aria-rowcount", "1001");
    await expect(content).toHaveAttribute("aria-label", "Virtualized table with 1000 rows");
    await expect(scroll).toHaveClass(/h-\[320px\]/);

    const rendered = await rows.count();

    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(1000);
    await expect(cell(0, 0)).toHaveText("Emma Smith");

    await scroll.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });

    await expect(cell(999, 0)).toHaveText("Lucas Johnson");
    await expect(cell(999, 0)).toBeVisible();

    await content.focus();
    await page.keyboard.press("ControlOrMeta+End");

    await expect(cell(999, 2)).toBeFocused();
  });

  test("loads more rows on scroll and keeps the header sticky", async ({page}) => {
    const wrapper = page.getByTestId("table-load-more");
    const scroll = wrapper.locator('[data-slot="table-scroll-container"]');
    const content = wrapper.locator('[data-slot="table-content"]');
    const header = content.locator('[data-slot="table-header"]');
    const rows = content.locator('tbody [data-slot="table-row"]');
    const loadMore = wrapper.locator('[data-slot="table-load-more"]');

    await expect(rows).toHaveCount(6);
    await expect(loadMore).toContainText("Scroll to load more");

    await scroll.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });

    await expect(rows).toHaveCount(12);

    await scroll.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });

    await expect(rows).toHaveCount(18);
    await expect(wrapper.locator('[data-slot="table-load-more"]')).toHaveCount(0);

    const scrollBox = await scroll.boundingBox();
    const headerBox = await header.boundingBox();

    expect(scrollBox).not.toBeNull();
    expect(headerBox).not.toBeNull();
    expect(Math.abs(headerBox!.y - scrollBox!.y)).toBeLessThanOrEqual(2);
    await expect(content.getByText("Emma Smith")).not.toBeInViewport();
  });
});
