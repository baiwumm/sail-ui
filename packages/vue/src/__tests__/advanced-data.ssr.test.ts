import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {renderSSR} from "@sail-ui/testing";

import {
  InputOtpGroup,
  InputOtpRoot,
  InputOtpSeparator,
  InputOtpSlot,
} from "../components/input-otp";
import {Label} from "../components/label";
import {Meter, MeterFill, MeterOutput, MeterTrack} from "../components/meter";
import {ScrollShadow} from "../components/scroll-shadow";
import {Table} from "../components/table";

const tableColumns = [
  {header: "Name", isRowHeader: true, key: "name"},
  {header: "Role", key: "role"},
];
const tableData = [
  {id: 1, name: "Kate Moore", role: "CEO"},
  {id: 2, name: "John Smith", role: "CTO"},
];

const Page = defineComponent({
  setup() {
    return () =>
      h("main", [
        h(
          Meter,
          {color: "success", value: 72},
          {
            default: () => [
              h(Label, null, {default: () => "Storage"}),
              h(MeterOutput),
              h(MeterTrack, null, {default: () => h(MeterFill)}),
            ],
          },
        ),
      ]);
  },
});

describe("T08 SSR", () => {
  it("renders Meter with its role, values, and slots", async () => {
    const html = await renderSSR(Page);

    for (const slot of ["meter", "meter-output", "meter-track", "meter-fill", "label"]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="100"');
    expect(html).toContain('aria-valuenow="72"');
    expect(html).toContain('aria-valuetext="72%"');
    expect(html).toContain("width:72%");
  });

  it("renders ScrollShadow without shadow attributes on the server", async () => {
    const ScrollShadowPage = defineComponent({
      setup() {
        return () =>
          h(
            ScrollShadow,
            {class: "max-h-60", offset: 16, size: 80},
            {default: () => "Scrollable content"},
          );
      },
    });
    const html = await renderSSR(ScrollShadowPage);

    expect(html).toContain('data-slot="scroll-shadow"');
    expect(html).toContain('data-orientation="vertical"');
    expect(html).toContain('data-scroll-shadow-mode="auto"');
    expect(html).toContain('data-scroll-shadow-size="80"');
    expect(html).toContain("--scroll-shadow-size:80px");
    expect(html).toContain("--scroll-shadow-offset:16px");
    expect(html).toContain("scroll-shadow--fade");
    expect(html).toContain("scroll-shadow--vertical");
    expect(html).not.toContain("data-top-scroll");
    expect(html).not.toContain("data-bottom-scroll");
    expect(html).not.toContain("data-top-bottom-scroll");
  });

  it("renders InputOtp slots without a caret on the server", async () => {
    const InputOtpPage = defineComponent({
      setup() {
        return () =>
          h(
            InputOtpRoot,
            {defaultValue: "12", isInvalid: true, maxLength: 6},
            {
              default: () => [
                h(InputOtpGroup, null, {
                  default: () => [0, 1, 2].map((index) => h(InputOtpSlot, {index})),
                }),
                h(InputOtpSeparator),
                h(InputOtpGroup, null, {
                  default: () => [3, 4, 5].map((index) => h(InputOtpSlot, {index})),
                }),
              ],
            },
          );
      },
    });
    const html = await renderSSR(InputOtpPage);

    for (const slot of [
      "input-otp",
      "input-otp-group",
      "input-otp-separator",
      "input-otp-slot",
      "input-otp-slot-value",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html).toContain("input-otp--primary");
    expect(html).toContain('data-invalid="true"');
    expect(html).not.toContain("data-complete");
    expect(html).not.toContain("input-otp__caret");
    expect(html).toContain(">1</div>");
    expect(html).toContain(">2</div>");
  });

  it("renders Table rows and grid roles on the server", async () => {
    const TablePage = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            {
              ariaLabel: "Team members",
              columns: tableColumns,
              contentClass: "min-w-[600px]",
              data: tableData,
            },
            {footer: () => "2 results"},
          );
      },
    });
    const html = await renderSSR(TablePage);

    for (const slot of [
      "table",
      "table-scroll-container",
      "table-content",
      "table-header",
      "table-column",
      "table-body",
      "table-row",
      "table-cell",
      "table-footer",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html).toContain('role="grid"');
    expect(html).toContain("table-root table-root--primary");
    expect(html).toContain("table__content min-w-[600px]");
    expect(html).toContain('aria-label="Team members"');
    expect(html).toContain('role="rowheader"');
    expect(html).toContain("Kate Moore");
    expect(html).toContain("John Smith");
    expect(html.match(/data-slot="table-row"/g)).toHaveLength(2);
    expect(html).toContain("2 results");
    expect(html).not.toContain("data-empty");
  });

  it("renders sorted and selected Table state on the server", async () => {
    const SortedTablePage = defineComponent({
      setup() {
        return () =>
          h(Table, {
            ariaLabel: "Team members",
            columns: [
              {allowsSorting: true, header: "Name", isRowHeader: true, key: "name"},
              {header: "Role", key: "role"},
            ],
            data: tableData,
            selectionMode: "multiple",
            sortDescriptor: {column: "name", direction: "ascending"},
          });
      },
    });
    const html = await renderSSR(SortedTablePage);

    expect(html).toContain('data-slot="table-sortable-column-header"');
    expect(html).toContain('data-slot="table-sortable-column-indicator"');
    expect(html).toContain('aria-sort="ascending"');
    expect(html).toContain('data-sort-direction="ascending"');
    expect(html).toContain('aria-multiselectable="true"');
    expect(html).toContain('data-selection-mode="multiple"');
    expect(html.match(/aria-selected="false"/g)).toHaveLength(2);
    expect(html.indexOf("John Smith")).toBeLessThan(html.indexOf("Kate Moore"));
  });

  it("renders the virtualized initial window and the load-more sentinel", async () => {
    const manyRows = Array.from({length: 30}, (_, index) => ({
      id: index + 1,
      name: `Member ${index + 1}`,
      role: "Engineer",
    }));
    const VirtualTablePage = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            {
              ariaLabel: "Virtual team",
              columns: tableColumns,
              data: manyRows,
              hasMore: true,
              isStickyHeader: true,
              isVirtualized: true,
              rowHeight: 50,
              scrollContainerClass: "h-64",
            },
            {loadMore: () => "Loading more"},
          );
      },
    });
    const html = await renderSSR(VirtualTablePage);

    expect(html).not.toContain("<table");
    expect(html).toContain('data-slot="table-content"');
    expect(html).toContain('role="grid"');
    expect(html).toContain('aria-rowcount="31"');
    expect(html).toContain("h-64");
    expect(html).toContain("position:sticky");
    expect(html).toContain("grid-template-columns:repeat(2, minmax(0, 1fr))");
    expect(html).toContain("translateY(0px)");
    expect(html).toContain("translateY(450px)");
    expect(html).toContain("Member 1");
    expect(html).toContain("Member 10");
    expect(html).not.toContain("Member 11");
    expect(html.match(/data-slot="table-row"/g)).toHaveLength(10);
    expect(html).toContain('data-slot="table-load-more"');
    expect(html).toContain('data-slot="table-load-more-content"');
    expect(html).toContain("Loading more");
    expect(await renderSSR(VirtualTablePage)).toBe(html);
  });

  it("is deterministic across renders", async () => {
    expect(await renderSSR(Page)).toBe(await renderSSR(Page));
  });
});
