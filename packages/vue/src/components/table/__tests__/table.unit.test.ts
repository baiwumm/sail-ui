import {flushPromises, mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {h, nextTick} from "vue";

import {Table} from "../index";

const columns = [
  {header: "Name", isRowHeader: true, key: "name"},
  {header: "Role", key: "role"},
  {header: "Email", key: "email"},
];

const data = [
  {email: "kate@acme.com", id: 1, name: "Kate Moore", role: "CEO"},
  {email: "john@acme.com", id: 2, name: "John Smith", role: "CTO"},
  {email: "sara@acme.com", id: 3, name: "Sara Johnson", role: "CMO"},
];

const sortableColumns = [
  {allowsSorting: true, header: "Name", isRowHeader: true, key: "name"},
  {allowsSorting: true, header: "Role", key: "role"},
  {header: "Email", key: "email"},
];

const resizableColumns = [
  {
    allowsResizing: true,
    header: "Name",
    isRowHeader: true,
    key: "name",
    minWidth: 120,
    width: 200,
  },
  {allowsResizing: true, header: "Role", key: "role", maxWidth: 250, width: 240},
  {header: "Email", key: "email", width: 180},
];

function dispatchPointer(
  target: Element,
  type: string,
  init: {button?: number; clientX?: number; pointerId?: number} = {},
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    button: init.button ?? 0,
    cancelable: true,
    clientX: init.clientX ?? 0,
  });

  Object.assign(event, {pointerId: init.pointerId ?? 1});
  target.dispatchEvent(event);

  return event;
}

function mountTable(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  return mount(Table as never, {
    attachTo: document.body,
    props: {ariaLabel: "Team members", columns, data, ...props} as never,
    ...options,
  });
}

function activeCell() {
  return document.activeElement as HTMLElement;
}

async function press(key: string, init: KeyboardEventInit = {}) {
  activeCell().dispatchEvent(
    new KeyboardEvent("keydown", {bubbles: true, cancelable: true, key, ...init}),
  );
  await nextTick();
}

function columnValues(wrapper: ReturnType<typeof mountTable>, columnIndex = 0): string[] {
  return wrapper
    .findAll("[data-slot='table-row']")
    .map((row) => row.findAll("[data-slot='table-cell']")[columnIndex]?.text() ?? "");
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("Table", () => {
  it("renders the upstream grid contract", () => {
    const wrapper = mountTable();
    const root = wrapper.get("[data-slot='table']");
    const table = wrapper.get("table");

    expect(root.classes()).toContain("table-root");
    expect(root.classes()).toContain("table-root--primary");
    expect(root.attributes("role")).toBeUndefined();
    expect(table.attributes("role")).toBe("grid");
    expect(table.classes()).toContain("table__content");
    expect(table.attributes("aria-label")).toBe("Team members");
    expect(table.attributes("aria-rowcount")).toBe("4");
    expect(table.attributes("aria-colcount")).toBe("3");
    expect(table.attributes("tabindex")).toBe("0");
    expect(wrapper.get("[data-slot='table-scroll-container']").classes()).toContain(
      "table__scroll-container",
    );
    expect(wrapper.get("thead").attributes("role")).toBe("rowgroup");
    expect(wrapper.get("thead tr").attributes("role")).toBe("row");
    expect(wrapper.get("[data-slot='table-body']").attributes("role")).toBe("rowgroup");
    expect(wrapper.get("[data-slot='table-body']").attributes("data-empty")).toBeUndefined();

    const headers = wrapper.findAll("[data-slot='table-column']");

    expect(headers).toHaveLength(3);
    expect(headers[0]?.classes()).toContain("table__column");
    expect(headers[0]?.attributes("role")).toBe("columnheader");
    expect(headers[0]?.attributes("aria-colindex")).toBe("1");
    expect(headers[2]?.attributes("aria-colindex")).toBe("3");
    expect(wrapper.findAll("[data-slot='table-row']")).toHaveLength(3);
    expect(wrapper.findAll("[data-slot='table-cell']")).toHaveLength(9);

    const firstRow = wrapper.get("[data-slot='table-row']");
    const cells = firstRow.findAll("[data-slot='table-cell']");

    expect(firstRow.attributes("role")).toBe("row");
    expect(firstRow.classes()).toContain("table__row");
    expect(firstRow.attributes("aria-rowindex")).toBe("2");
    expect(cells[0]?.classes()).toContain("table__cell");
    expect(cells[0]?.attributes("role")).toBe("rowheader");
    expect(cells[0]?.attributes("data-column-index")).toBe("0");
    expect(cells[0]?.attributes("id")).toBe(firstRow.attributes("aria-labelledby"));
    expect(cells[1]?.attributes("role")).toBe("gridcell");
    expect(cells[0]?.text()).toBe("Kate Moore");
    expect(wrapper.find("[data-slot='table-footer']").exists()).toBe(false);

    wrapper.unmount();
  });

  it("routes aria attributes to the grid and consumer attributes to the root", () => {
    const wrapper = mount(Table as never, {
      attachTo: document.body,
      attrs: {class: "custom-table", "data-testid": "table-basic"},
      props: {ariaLabel: "Team members", columns, data} as never,
    });
    const root = wrapper.get("[data-slot='table']");

    expect(root.classes()).toContain("custom-table");
    expect(root.classes()).toContain("table-root");
    expect(root.attributes("data-testid")).toBe("table-basic");
    expect(root.attributes("aria-label")).toBeUndefined();
    expect(wrapper.get("table").attributes("aria-label")).toBe("Team members");

    wrapper.unmount();
  });

  it("renders header, cell, empty, and footer slots", () => {
    const wrapper = mount(Table as never, {
      attachTo: document.body,
      props: {ariaLabel: "Team members", columns, data} as never,
      slots: {
        cell: ({value}: {value: unknown}) => h("span", {class: "generic-cell"}, String(value)),
        "cell-name": ({row, value}: {row: {id: number}; value: unknown}) =>
          h("em", {class: "name-cell"}, `${row.id}:${String(value)}`),
        "header-name": ({column}: {column: {header: string}}) =>
          h("strong", {class: "custom-header"}, `*${column.header}`),
        footer: () => h("span", {class: "footer-content"}, "3 results"),
      },
    });

    const headers = wrapper.findAll("[data-slot='table-column']");

    expect(headers[0]?.text()).toBe("*Name");
    expect(headers[0]?.find(".custom-header").exists()).toBe(true);
    expect(headers[1]?.text()).toBe("Role");

    const firstRowCells = wrapper
      .get("[data-slot='table-row']")
      .findAll("[data-slot='table-cell']");

    expect(firstRowCells[0]?.find(".name-cell").text()).toBe("1:Kate Moore");
    expect(firstRowCells[1]?.find(".generic-cell").text()).toBe("CEO");
    expect(wrapper.get("[data-slot='table-footer']").classes()).toContain("table__footer");
    expect(wrapper.get("[data-slot='table-footer']").text()).toBe("3 results");

    wrapper.unmount();
  });

  it("renders the upstream empty row without table slots", () => {
    const wrapper = mountTable(
      {data: []},
      {
        slots: {
          empty: () => h("span", {class: "empty-content"}, "No results found"),
        },
      },
    );

    expect(wrapper.get("[data-slot='table-body']").attributes("data-empty")).toBe("true");
    expect(wrapper.findAll("[data-slot='table-row']")).toHaveLength(0);

    const emptyRow = wrapper.get("tbody tr");
    const emptyCell = emptyRow.get("td");

    expect(emptyRow.attributes("role")).toBe("row");
    expect(emptyCell.attributes("role")).toBe("rowheader");
    expect(emptyCell.attributes("colspan")).toBe("3");
    expect(emptyCell.attributes("data-slot")).toBeUndefined();
    expect(emptyCell.find(".empty-content").text()).toBe("No results found");

    wrapper.unmount();
  });

  it("renders a loading row and busy state", () => {
    const wrapper = mountTable({isLoading: true});

    expect(wrapper.get("table").attributes("aria-busy")).toBe("true");
    expect(wrapper.get("[data-slot='table-body']").attributes("data-empty")).toBeUndefined();
    expect(wrapper.findAll("[data-slot='table-row']")).toHaveLength(4);

    const loadingRow = wrapper.findAll("[data-slot='table-row']")[3];
    const loadingCell = loadingRow?.get("[data-slot='table-cell']");

    expect(loadingRow?.attributes("role")).toBe("row");
    expect(loadingCell?.attributes("colspan")).toBe("3");
    expect(loadingCell?.text()).toBe("Loading...");

    wrapper.unmount();
  });

  it("renders a custom loading slot when there is no data", () => {
    const wrapper = mountTable(
      {data: [], isLoading: true},
      {
        slots: {
          loading: () => h("span", {class: "loading-content"}, "Fetching rows"),
        },
      },
    );

    expect(wrapper.get("[data-slot='table-body']").attributes("data-empty")).toBeUndefined();
    expect(wrapper.findAll("[data-slot='table-row']")).toHaveLength(1);
    expect(wrapper.get(".loading-content").text()).toBe("Fetching rows");

    wrapper.unmount();
  });

  it("applies the secondary variant and static sorting metadata", () => {
    const wrapper = mountTable({
      columns: [
        {allowsSorting: true, header: "Name", isRowHeader: true, key: "name"},
        {allowsSorting: true, header: "Role", key: "role"},
        {header: "Email", key: "email"},
      ],
      variant: "secondary",
    });
    const root = wrapper.get("[data-slot='table']");
    const headers = wrapper.findAll("[data-slot='table-column']");

    expect(root.classes()).toContain("table-root--secondary");
    expect(root.classes()).not.toContain("table-root--primary");
    expect(headers[0]?.attributes("aria-sort")).toBe("none");
    expect(headers[0]?.attributes("data-allows-sorting")).toBe("true");
    expect(headers[2]?.attributes("aria-sort")).toBeUndefined();
    expect(headers[2]?.attributes("data-allows-sorting")).toBeUndefined();

    wrapper.unmount();
  });

  it("applies column alignment to headers and cells", () => {
    const wrapper = mountTable({
      columns: [
        {align: "center", header: "Name", isRowHeader: true, key: "name"},
        {align: "end", header: "Role", key: "role"},
        {header: "Email", key: "email"},
      ],
    });

    expect(wrapper.findAll("[data-slot='table-column']")[0]?.attributes("style")).toContain(
      "text-align: center",
    );
    expect(
      wrapper
        .get("[data-slot='table-row']")
        .findAll("[data-slot='table-cell']")[1]
        ?.attributes("style"),
    ).toContain("text-align: end");

    wrapper.unmount();
  });

  it("navigates the grid with arrows, Home/End, and Ctrl+Home/End", async () => {
    const wrapper = mountTable();
    const table = wrapper.get("table");

    (table.element as HTMLElement).focus();
    await press("ArrowDown");

    expect(activeCell().dataset.rowIndex).toBe("0");
    expect(activeCell().dataset.colIndex).toBe("0");
    expect(table.attributes("tabindex")).toBe("-1");
    expect(activeCell().getAttribute("tabindex")).toBe("0");

    await press("ArrowRight");
    expect(activeCell().dataset.colIndex).toBe("1");

    await press("End");
    expect(activeCell().dataset.colIndex).toBe("2");

    await press("ArrowDown");
    expect(activeCell().dataset.rowIndex).toBe("1");
    expect(activeCell().dataset.colIndex).toBe("2");

    await press("Home");
    expect(activeCell().dataset.colIndex).toBe("0");

    await press("ArrowUp");
    await press("ArrowUp");
    expect(activeCell().dataset.rowIndex).toBe("-1");
    expect(activeCell().dataset.colIndex).toBe("0");

    await press("End", {ctrlKey: true});
    expect(activeCell().dataset.rowIndex).toBe("2");
    expect(activeCell().dataset.colIndex).toBe("2");

    await press("Home", {ctrlKey: true});
    expect(activeCell().dataset.rowIndex).toBe("-1");
    expect(activeCell().dataset.colIndex).toBe("0");

    await press("PageDown");
    expect(activeCell().dataset.rowIndex).toBe("2");

    wrapper.unmount();
  });

  it("does not steal arrow keys from interactive cell content", async () => {
    const wrapper = mount(Table as never, {
      attachTo: document.body,
      props: {ariaLabel: "Team members", columns, data} as never,
      slots: {
        "cell-role": () => h("button", {class: "cell-button", type: "button"}, "Edit"),
      },
    });
    const button = wrapper.get(".cell-button");

    (button.element as HTMLElement).focus();
    button.element.dispatchEvent(
      new KeyboardEvent("keydown", {bubbles: true, cancelable: true, key: "ArrowRight"}),
    );
    await nextTick();

    expect(activeCell()).toBe(button.element);

    wrapper.unmount();
  });

  it("sorts rows from a sortable header and toggles the direction", async () => {
    const wrapper = mountTable({columns: sortableColumns});
    const headers = wrapper.findAll("[data-slot='table-column']");

    expect(headers[0]?.attributes("aria-sort")).toBe("none");
    expect(headers[0]?.find("[data-slot='table-sortable-column-header']").exists()).toBe(true);
    expect(headers[0]?.find("[data-slot='table-sortable-column-indicator']").exists()).toBe(false);
    expect(headers[2]?.find("[data-slot='table-sortable-column-header']").exists()).toBe(false);
    expect(headers[2]?.attributes("aria-sort")).toBeUndefined();

    await headers[0]?.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:sortDescriptor")?.[0]?.[0]).toEqual({
      column: "name",
      direction: "ascending",
    });
    expect(headers[0]?.attributes("aria-sort")).toBe("ascending");
    expect(headers[0]?.attributes("data-sort-direction")).toBe("ascending");
    expect(
      headers[0]
        ?.find("[data-slot='table-sortable-column-indicator']")
        ?.attributes("data-direction"),
    ).toBe("ascending");
    expect(columnValues(wrapper)).toEqual(["John Smith", "Kate Moore", "Sara Johnson"]);

    await headers[0]?.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:sortDescriptor")?.[1]?.[0]).toEqual({
      column: "name",
      direction: "descending",
    });
    expect(headers[0]?.attributes("aria-sort")).toBe("descending");
    expect(
      headers[0]
        ?.find("[data-slot='table-sortable-column-indicator']")
        ?.attributes("data-direction"),
    ).toBe("descending");
    expect(columnValues(wrapper)).toEqual(["Sara Johnson", "Kate Moore", "John Smith"]);

    await headers[2]?.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:sortDescriptor")).toHaveLength(2);

    wrapper.unmount();
  });

  it("sorts from the keyboard and passes the direction to header slots", async () => {
    const wrapper = mountTable(
      {columns: sortableColumns},
      {
        slots: {
          "header-name": ({
            column,
            sortDirection,
          }: {
            column: {header: string};
            sortDirection?: string;
          }) =>
            h("span", {class: "custom-sort-header"}, `${column.header}:${sortDirection ?? "none"}`),
        },
      },
    );

    expect(wrapper.get(".custom-sort-header").text()).toBe("Name:none");

    const header = wrapper.get("thead [data-row-index='-1'][data-col-index='0']");

    (header.element as HTMLElement).focus();
    await nextTick();
    await press("Enter");

    expect(wrapper.emitted("update:sortDescriptor")?.[0]?.[0]).toEqual({
      column: "name",
      direction: "ascending",
    });
    expect(wrapper.get(".custom-sort-header").text()).toBe("Name:ascending");
    expect(wrapper.get("[data-slot='table-sortable-column-header']").text()).toBe("Name:ascending");

    await press(" ");

    expect(wrapper.emitted("update:sortDescriptor")?.[1]?.[0]).toEqual({
      column: "name",
      direction: "descending",
    });

    wrapper.unmount();
  });

  it("respects controlled and default sort descriptors", async () => {
    const wrapper = mountTable({
      columns: sortableColumns,
      sortDescriptor: {column: "name", direction: "descending"},
    });
    const headers = wrapper.findAll("[data-slot='table-column']");

    expect(columnValues(wrapper)).toEqual(["Sara Johnson", "Kate Moore", "John Smith"]);
    expect(headers[0]?.attributes("aria-sort")).toBe("descending");

    await headers[0]?.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:sortDescriptor")?.[0]?.[0]).toEqual({
      column: "name",
      direction: "ascending",
    });
    expect(columnValues(wrapper)).toEqual(["Sara Johnson", "Kate Moore", "John Smith"]);
    expect(headers[0]?.attributes("aria-sort")).toBe("descending");

    await wrapper.setProps({sortDescriptor: {column: "name", direction: "ascending"}} as never);
    await nextTick();

    expect(columnValues(wrapper)).toEqual(["John Smith", "Kate Moore", "Sara Johnson"]);
    expect(headers[0]?.attributes("aria-sort")).toBe("ascending");

    wrapper.unmount();

    const uncontrolled = mountTable({
      columns: sortableColumns,
      defaultSortDescriptor: {column: "name", direction: "ascending"},
    });
    const uncontrolledHeaders = uncontrolled.findAll("[data-slot='table-column']");

    expect(columnValues(uncontrolled)).toEqual(["John Smith", "Kate Moore", "Sara Johnson"]);

    await uncontrolledHeaders[0]?.trigger("click");
    await nextTick();

    expect(columnValues(uncontrolled)).toEqual(["Sara Johnson", "Kate Moore", "John Smith"]);

    uncontrolled.unmount();
  });

  it("renders multiple-selection semantics and toggles rows", async () => {
    const wrapper = mountTable({selectionMode: "multiple"});
    const rowWrappers = () => wrapper.findAll("[data-slot='table-row']");

    expect(wrapper.get("table").attributes("aria-multiselectable")).toBe("true");
    expect(rowWrappers()[0]?.attributes("aria-selected")).toBe("false");
    expect(rowWrappers()[0]?.attributes("data-selection-mode")).toBe("multiple");
    expect(rowWrappers()[0]?.attributes("data-level")).toBe("1");
    expect(rowWrappers()[0]?.attributes("style")).toContain("--table-row-level: 1");
    expect(
      rowWrappers()[0]?.findAll("[data-slot='table-cell']")[0]?.attributes("data-selected"),
    ).toBeUndefined();

    const firstCell = wrapper.get("tbody [data-row-index='0'][data-col-index='0']");

    (firstCell.element as HTMLElement).focus();
    await nextTick();
    await press(" ");

    expect(wrapper.emitted("update:selectedKeys")?.[0]?.[0]).toEqual(new Set(["1"]));
    expect(rowWrappers()[0]?.attributes("aria-selected")).toBe("true");
    expect(rowWrappers()[0]?.attributes("data-selected")).toBe("true");
    expect(
      rowWrappers()[0]?.findAll("[data-slot='table-cell']")[0]?.attributes("data-selected"),
    ).toBe("true");

    await rowWrappers()[1]?.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:selectedKeys")?.[1]?.[0]).toEqual(new Set(["1", "2"]));
    expect(rowWrappers()[1]?.attributes("data-selected")).toBe("true");

    await press(" ");

    expect(wrapper.emitted("update:selectedKeys")?.[2]?.[0]).toEqual(new Set(["2"]));
    expect(rowWrappers()[0]?.attributes("aria-selected")).toBe("false");

    wrapper.unmount();
  });

  it("supports select-all, range selection, and disabled keys", async () => {
    const wrapper = mountTable({disabledKeys: [2], selectionMode: "multiple"});
    const rowWrappers = () => wrapper.findAll("[data-slot='table-row']");

    expect(rowWrappers()[1]?.attributes("aria-disabled")).toBe("true");
    expect(rowWrappers()[1]?.attributes("data-disabled")).toBe("true");
    expect(
      rowWrappers()[1]?.findAll("[data-slot='table-cell']")[0]?.attributes("data-disabled"),
    ).toBe("true");

    await rowWrappers()[1]?.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:selectedKeys")).toBeUndefined();

    const disabledCell = wrapper.get("tbody [data-row-index='1'][data-col-index='0']");

    (disabledCell.element as HTMLElement).focus();
    await nextTick();
    await press(" ");

    expect(wrapper.emitted("update:selectedKeys")).toBeUndefined();

    await press("a", {ctrlKey: true});

    expect(wrapper.emitted("update:selectedKeys")?.[0]?.[0]).toEqual(new Set(["1", "3"]));

    await press("a", {ctrlKey: true});

    expect(wrapper.emitted("update:selectedKeys")?.[1]?.[0]).toEqual(new Set());

    await press("ArrowDown", {shiftKey: true});

    expect(wrapper.emitted("update:selectedKeys")?.[2]?.[0]).toEqual(new Set(["3"]));

    wrapper.unmount();

    const ranged = mountTable({selectionMode: "multiple"});
    const rangedCell = ranged.get("tbody [data-row-index='0'][data-col-index='0']");

    (rangedCell.element as HTMLElement).focus();
    await nextTick();
    await press("ArrowDown", {shiftKey: true});
    expect(ranged.emitted("update:selectedKeys")?.[0]?.[0]).toEqual(new Set(["1", "2"]));

    await press("ArrowDown", {shiftKey: true});
    expect(ranged.emitted("update:selectedKeys")?.[1]?.[0]).toEqual(new Set(["1", "2", "3"]));

    ranged.unmount();
  });

  it("supports single selection and controlled/default selected keys", async () => {
    const wrapper = mountTable({selectionMode: "single"});
    const rowWrappers = () => wrapper.findAll("[data-slot='table-row']");

    expect(wrapper.get("table").attributes("aria-multiselectable")).toBeUndefined();
    expect(rowWrappers()[0]?.attributes("aria-selected")).toBe("false");

    await rowWrappers()[0]?.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:selectedKeys")?.[0]?.[0]).toEqual(new Set(["1"]));
    expect(rowWrappers()[0]?.attributes("aria-selected")).toBe("true");

    await rowWrappers()[1]?.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:selectedKeys")?.[1]?.[0]).toEqual(new Set(["2"]));
    expect(rowWrappers()[0]?.attributes("aria-selected")).toBe("false");
    expect(rowWrappers()[1]?.attributes("aria-selected")).toBe("true");

    await rowWrappers()[1]?.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:selectedKeys")?.[2]?.[0]).toEqual(new Set());
    expect(rowWrappers()[1]?.attributes("aria-selected")).toBe("false");

    wrapper.unmount();

    const controlled = mountTable({selectedKeys: new Set([1]), selectionMode: "multiple"});
    const controlledRows = () => controlled.findAll("[data-slot='table-row']");

    expect(controlledRows()[0]?.attributes("aria-selected")).toBe("true");
    expect(controlledRows()[1]?.attributes("aria-selected")).toBe("false");

    await controlledRows()[1]?.trigger("click");
    await nextTick();

    expect(controlled.emitted("update:selectedKeys")?.[0]?.[0]).toEqual(new Set(["1", "2"]));
    expect(controlledRows()[1]?.attributes("aria-selected")).toBe("false");

    await controlled.setProps({selectedKeys: new Set(["1", "2"])} as never);
    await nextTick();

    expect(controlledRows()[1]?.attributes("aria-selected")).toBe("true");

    controlled.unmount();

    const uncontrolled = mountTable({defaultSelectedKeys: ["2"], selectionMode: "single"});
    const uncontrolledRows = () => uncontrolled.findAll("[data-slot='table-row']");

    expect(uncontrolledRows()[1]?.attributes("aria-selected")).toBe("true");
    expect(uncontrolledRows()[0]?.attributes("aria-selected")).toBe("false");

    await uncontrolledRows()[0]?.trigger("click");
    await nextTick();

    expect(uncontrolledRows()[0]?.attributes("aria-selected")).toBe("true");
    expect(uncontrolledRows()[1]?.attributes("aria-selected")).toBe("false");

    uncontrolled.unmount();
  });

  it("renders the resizable container, column widths, and resizer inputs", () => {
    const wrapper = mountTable({columns: resizableColumns, isResizable: true});

    expect(wrapper.find("[data-slot='table-resizable-container']").exists()).toBe(true);
    expect(wrapper.get("[data-slot='table-resizable-container']").classes()).toContain(
      "table__resizable-container",
    );
    expect(wrapper.find("[data-slot='table-scroll-container']").exists()).toBe(false);
    expect(wrapper.get("table").attributes("style")).toContain("table-layout: fixed");
    expect(wrapper.get("table").attributes("style")).toContain("width: min-content");

    const headers = wrapper.findAll("[data-slot='table-column']");

    expect(headers[0]?.attributes("style")).toContain("width: 200px");
    expect(headers[1]?.attributes("style")).toContain("width: 240px");
    expect(headers[2]?.attributes("style")).toContain("width: 180px");

    const resizers = wrapper.findAll("[data-slot='table-column-resizer']");

    expect(resizers).toHaveLength(2);
    expect(resizers[0]?.attributes("role")).toBe("presentation");
    expect(resizers[0]?.classes()).toContain("table__column-resizer");
    expect(resizers[0]?.attributes("data-resizable-direction")).toBe("both");
    expect(resizers[0]?.attributes("data-resizing")).toBeUndefined();
    expect(resizers[0]?.attributes("data-hovered")).toBeUndefined();

    const input = resizers[0]?.get("input");

    expect(input?.attributes("type")).toBe("range");
    expect(input?.attributes("min")).toBe("120");
    expect(input?.attributes("max")).toBe(`${Number.MAX_SAFE_INTEGER}`);
    expect(input?.attributes("value")).toBe("200");
    expect(input?.attributes("aria-label")).toBe("Resizer");
    expect(input?.attributes("aria-orientation")).toBe("horizontal");
    expect(input?.attributes("aria-valuetext")).toBe("200 pixels");
    expect(input?.attributes("aria-labelledby")).toBe(
      `${input?.attributes("id")} ${headers[0]?.attributes("id")}`,
    );
    expect(headers[0]?.attributes("id")).toBeTruthy();

    wrapper.unmount();
  });

  it("resizes a column through the hidden range input", async () => {
    const wrapper = mountTable({columns: resizableColumns, isResizable: true});
    const headers = wrapper.findAll("[data-slot='table-column']");
    const input = wrapper.findAll("[data-slot='table-column-resizer']")[0]?.get("input");

    expect(input).toBeTruthy();
    expect(headers[0]?.attributes("style")).toContain("width: 200px");

    const range = input!.element as HTMLInputElement;

    range.value = "201";
    await input!.trigger("input");
    await nextTick();

    expect(headers[0]?.attributes("style")).toContain("width: 210px");
    expect(input!.attributes("aria-valuetext")).toBe("210 pixels");

    const roleInput = wrapper.findAll("[data-slot='table-column-resizer']")[1]?.get("input");
    const roleRange = roleInput!.element as HTMLInputElement;

    roleRange.value = "999";
    await roleInput!.trigger("input");
    await nextTick();

    expect(headers[1]?.attributes("style")).toContain("width: 250px");
    expect(
      wrapper
        .findAll("[data-slot='table-column-resizer']")[1]
        ?.attributes("data-resizable-direction"),
    ).toBe("right");

    wrapper.unmount();
  });

  it("resizes a column by dragging the resizer", async () => {
    const wrapper = mountTable({columns: resizableColumns, isResizable: true});
    const resizer = wrapper.findAll("[data-slot='table-column-resizer']")[0];
    const headers = wrapper.findAll("[data-slot='table-column']");

    dispatchPointer(resizer!.element, "pointerdown", {clientX: 100, pointerId: 7});
    await nextTick();

    expect(resizer!.attributes("data-resizing")).toBe("true");

    dispatchPointer(resizer!.element, "pointermove", {clientX: 140, pointerId: 7});
    await nextTick();

    expect(headers[0]?.attributes("style")).toContain("width: 240px");

    dispatchPointer(resizer!.element, "pointermove", {clientX: -100, pointerId: 7});
    await nextTick();

    expect(headers[0]?.attributes("style")).toContain("width: 120px");

    dispatchPointer(resizer!.element, "pointerup", {clientX: -100, pointerId: 7});
    await nextTick();

    expect(resizer!.attributes("data-resizing")).toBeUndefined();

    resizer!.element.dispatchEvent(new MouseEvent("pointerenter", {bubbles: false}));
    await nextTick();

    expect(resizer!.attributes("data-hovered")).toBe("true");

    wrapper.unmount();
  });

  it("keeps header clicks on a resizer from changing the sort", async () => {
    const wrapper = mountTable({
      columns: [
        {allowsResizing: true, allowsSorting: true, header: "Name", key: "name", width: 200},
      ],
      isResizable: true,
    });
    const resizer = wrapper.get("[data-slot='table-column-resizer']");
    const header = wrapper.get("[data-slot='table-column']");

    await resizer.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:sortDescriptor")).toBeUndefined();

    await header.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:sortDescriptor")?.[0]?.[0]).toEqual({
      column: "name",
      direction: "ascending",
    });

    wrapper.unmount();
  });

  it("renders the virtualized grid window", () => {
    const bigData = Array.from({length: 100}, (_, index) => ({
      email: `user${index}@acme.com`,
      id: index + 1,
      name: `User ${index}`,
      role: "Engineer",
    }));
    const wrapper = mountTable({
      data: bigData,
      isVirtualized: true,
      rowHeight: 50,
      scrollContainerClass: "h-64",
    });

    expect(wrapper.find("table").exists()).toBe(false);
    expect(wrapper.find("thead").exists()).toBe(false);
    expect(wrapper.find("tbody").exists()).toBe(false);

    const content = wrapper.get("[data-slot='table-content']");

    expect(content.element.tagName).toBe("DIV");
    expect(content.attributes("role")).toBe("grid");
    expect(content.attributes("aria-rowcount")).toBe("101");
    expect(content.classes()).toContain("table__content");
    expect(wrapper.get("[data-slot='table-scroll-container']").classes()).toContain("h-64");

    const header = wrapper.get("[data-slot='table-column']");

    expect(header.element.tagName).toBe("DIV");
    expect(header.attributes("role")).toBe("columnheader");
    expect(header.element.parentElement?.getAttribute("role")).toBe("presentation");
    expect(header.element.parentElement?.getAttribute("style")).toContain("min-width: 0");

    const rows = wrapper.findAll("[data-slot='table-row']");

    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(100);
    expect(rows[0]?.attributes("aria-rowindex")).toBe("2");
    expect(rows[0]?.attributes("style")).toContain("display: grid");
    expect(rows[0]?.attributes("style")).toContain("grid-template-columns");
    expect(rows[0]?.attributes("style")).toContain("--table-row-level: 1");
    expect(rows[1]?.element.parentElement?.getAttribute("role")).toBe("presentation");
    expect(rows[1]?.element.parentElement?.getAttribute("style")).toContain("translateY(50px)");

    wrapper.unmount();
  });

  it("keeps the keyboard-active row rendered outside the virtual window", async () => {
    const bigData = Array.from({length: 100}, (_, index) => ({
      email: `user${index}@acme.com`,
      id: index + 1,
      name: `User ${index}`,
      role: "Engineer",
    }));
    const wrapper = mountTable({data: bigData, isVirtualized: true});
    const content = wrapper.get("[data-slot='table-content']");

    (content.element as HTMLElement).focus();
    await press("End", {ctrlKey: true});
    await flushPromises();
    await nextTick();

    const target = wrapper.get("[data-row-index='99'][data-col-index='2']");

    expect(target.attributes("tabindex")).toBe("0");
    expect(document.activeElement).toBe(target.element);

    wrapper.unmount();
  });

  it("applies the sticky header and renders the load-more sentinel", () => {
    const wrapper = mountTable({hasMore: true, isStickyHeader: true});
    const header = wrapper.get("[data-slot='table-header']");

    expect(header.attributes("style")).toContain("position: sticky");
    expect(header.attributes("style")).toContain("top: 0");

    const sentinel = wrapper.get("[data-slot='table-load-more']");

    expect(sentinel.element.tagName).toBe("TR");
    expect(sentinel.classes()).toContain("table__load-more");
    expect(sentinel.find("[data-slot='table-load-more-content']").classes()).toContain(
      "table__load-more-content",
    );

    wrapper.unmount();
  });

  it("emits loadMore when the sentinel intersects the scroll container", async () => {
    const instances: Array<{
      callback: (entries: Array<{isIntersecting: boolean}>) => void;
      disconnected: boolean;
      observed: Element | null;
    }> = [];
    const original = globalThis.IntersectionObserver;

    class MockIntersectionObserver {
      callback: (entries: Array<{isIntersecting: boolean}>) => void;
      disconnected = false;
      observed: Element | null = null;

      constructor(callback: (entries: Array<{isIntersecting: boolean}>) => void) {
        this.callback = callback;
        instances.push(this);
      }

      observe(element: Element) {
        this.observed = element;
      }

      disconnect() {
        this.disconnected = true;
        this.observed = null;
      }
    }

    Object.defineProperty(globalThis, "IntersectionObserver", {
      configurable: true,
      value: MockIntersectionObserver,
      writable: true,
    });

    try {
      const wrapper = mountTable({hasMore: true});

      expect(instances).toHaveLength(1);
      expect(instances[0]?.observed).toBe(wrapper.get("[data-slot='table-load-more']").element);

      instances[0]?.callback([{isIntersecting: true}]);
      await nextTick();

      expect(wrapper.emitted("loadMore")).toHaveLength(1);

      instances[0]?.callback([{isIntersecting: false}]);
      await nextTick();

      expect(wrapper.emitted("loadMore")).toHaveLength(1);

      await wrapper.setProps({isLoadingMore: true} as never);
      await nextTick();

      expect(instances[0]?.disconnected).toBe(true);

      instances[instances.length - 1]?.callback([{isIntersecting: true}]);
      await nextTick();

      expect(wrapper.emitted("loadMore")).toHaveLength(1);

      wrapper.unmount();
    } finally {
      Object.defineProperty(globalThis, "IntersectionObserver", {
        configurable: true,
        value: original,
        writable: true,
      });
    }
  });
});
