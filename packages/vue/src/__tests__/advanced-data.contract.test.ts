import {readFileSync} from "node:fs";
import {join} from "node:path";
import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

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

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const uniqueSorted = (slots: string[]) => [...new Set(slots)].sort();

function expectUpstreamSlots(html: string, component: string, extras: string[] = []) {
  const expected = [...(slotSnapshot.components[component] ?? []), ...extras];

  expect(uniqueSorted(dataSlots(html)), `${component} data-slot parity`).toEqual(
    uniqueSorted(expected),
  );
}

describe("T08 data-slot parity", () => {
  it("Meter renders every upstream slot", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            Meter,
            {color: "warning", size: "lg", value: 60},
            {
              default: () => [
                h(Label, null, {default: () => "Storage"}),
                h(MeterOutput),
                h(MeterTrack, null, {default: () => h(MeterFill)}),
              ],
            },
          );
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "meter", ["label"]);
    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-valuenow="60"');
    expect(html).toContain("meter--warning");
    expect(html).toContain("meter--lg");
  });

  it("ScrollShadow renders every upstream slot and root attribute", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            ScrollShadow,
            {orientation: "horizontal", size: 80, visibility: "bottom"},
            {default: () => "Content"},
          );
      },
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "scroll-shadow");
    expect(html).toContain('data-orientation="horizontal"');
    expect(html).toContain('data-scroll-shadow-mode="manual"');
    expect(html).toContain('data-scroll-shadow-size="80"');
    expect(html).toContain("--scroll-shadow-size:80px");
    expect(html).toContain("scroll-shadow--fade");
    expect(html).toContain("scroll-shadow--horizontal");
    expect(html).not.toContain("data-left-scroll");
    expect(html).not.toContain("data-right-scroll");
  });

  it("InputOtp renders every upstream slot", async () => {
    const wrapper = mount(InputOtpRoot, {
      attachTo: document.body,
      props: {defaultValue: "12", maxLength: 6},
      slots: {
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
    });

    await nextTick();

    const inputs = wrapper.findAll("input.input-otp__input");

    (inputs[2]?.element as HTMLInputElement).focus();
    await nextTick();

    const html = wrapper.html();

    expectUpstreamSlots(html, "input-otp");
    expect(html).toContain("input-otp--primary");
    expect(html).toContain("input-otp__slot-value");
    expect(html).toContain('aria-label="pin input 1 of 6"');
    expect(wrapper.find("[data-slot='input-otp']").attributes("data-complete")).toBeUndefined();

    wrapper.unmount();
  });

  it("Table renders the upstream grid slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            {
              ariaLabel: "Team members",
              columns: [
                {header: "Name", isRowHeader: true, key: "name"},
                {header: "Role", key: "role"},
              ],
              data: [{id: 1, name: "Kate Moore", role: "CEO"}],
            },
            {footer: () => "1 result"},
          );
      },
    });
    const html = await renderSSR(host);
    const slots = uniqueSorted(dataSlots(html));
    const upstream = slotSnapshot.components.table ?? [];

    expect(slots).toEqual([
      "table",
      "table-body",
      "table-cell",
      "table-column",
      "table-content",
      "table-footer",
      "table-header",
      "table-row",
      "table-scroll-container",
    ]);

    for (const slot of slots) {
      expect(upstream, slot).toContain(slot);
    }

    expect(html).toContain("table-root table-root--primary");
    expect(html).toContain('role="grid"');
    expect(html).toContain('role="rowgroup"');
    expect(html).toContain('role="columnheader"');
    expect(html).toContain('role="rowheader"');
    expect(html).toContain('role="gridcell"');
    expect(html).toContain('aria-label="Team members"');
  });

  it("Table renders the upstream sorting and selection contract", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(Table, {
            ariaLabel: "Team members",
            columns: [
              {allowsSorting: true, header: "Name", isRowHeader: true, key: "name"},
              {header: "Role", key: "role"},
            ],
            data: [
              {id: 1, name: "Kate Moore", role: "CEO"},
              {id: 2, name: "John Smith", role: "CTO"},
            ],
            disabledKeys: [2],
            selectedKeys: new Set([1]),
            selectionMode: "multiple",
            sortDescriptor: {column: "name", direction: "ascending"},
          });
      },
    });
    const html = await renderSSR(host);

    expect(html).toContain('data-slot="table-sortable-column-header"');
    expect(html).toContain('data-slot="table-sortable-column-indicator"');
    expect(html).toContain("table__sortable-column-header");
    expect(html).toContain("table__sortable-column-indicator");
    expect(html).toContain('aria-sort="ascending"');
    expect(html).toContain('data-sort-direction="ascending"');
    expect(html).toContain('data-allows-sorting="true"');
    expect(html).toContain('aria-multiselectable="true"');
    expect(html).toContain('data-selection-mode="multiple"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-selected="false"');
    expect(html).toContain('data-selected="true"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('data-disabled="true"');
    expect(html).toContain('data-level="1"');
    expect(html).toContain("--table-row-level:1");
    expect(html.indexOf("John Smith")).toBeLessThan(html.indexOf("Kate Moore"));
  });

  it("Table renders the upstream resizable slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(Table, {
            ariaLabel: "Resizable team members",
            columns: [
              {allowsResizing: true, header: "Name", isRowHeader: true, key: "name", width: 200},
              {allowsResizing: true, header: "Role", key: "role", width: 160},
            ],
            data: [{id: 1, name: "Kate Moore", role: "CEO"}],
            isResizable: true,
          });
      },
    });
    const html = await renderSSR(host);
    const upstream = slotSnapshot.components.table ?? [];

    for (const slot of uniqueSorted(dataSlots(html))) {
      expect(upstream, slot).toContain(slot);
    }

    expect(html).toContain('data-slot="table-resizable-container"');
    expect(html).toContain('data-slot="table-column-resizer"');
    expect(html).toContain("table__resizable-container");
    expect(html).toContain("table__column-resizer");
    expect(html).not.toContain('data-slot="table-scroll-container"');
    expect(html).toContain("table-layout:fixed");
    expect(html).toContain("width:min-content");
    expect(html).toContain("width:200px");
    expect(html).toContain('role="presentation"');
    expect(html).toContain('data-resizable-direction="both"');
    expect(html).toContain('type="range"');
    expect(html).toContain('aria-label="Resizer"');
    expect(html).toContain('aria-orientation="horizontal"');
    expect(html).toContain('aria-valuetext="200 pixels"');
    expect(html).toContain('aria-labelledby="');
  });

  it("Table renders the virtualized, sticky-header, and load-more contract", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(Table, {
            ariaLabel: "Virtualized team members",
            columns: [
              {header: "Name", isRowHeader: true, key: "name"},
              {header: "Role", key: "role"},
            ],
            data: Array.from({length: 30}, (_, index) => ({
              id: index + 1,
              name: `User ${index}`,
              role: "Engineer",
            })),
            hasMore: true,
            isStickyHeader: true,
            isVirtualized: true,
            rowHeight: 50,
            scrollContainerClass: "h-64",
          });
      },
    });
    const html = await renderSSR(host);
    const upstream = slotSnapshot.components.table ?? [];

    for (const slot of uniqueSorted(dataSlots(html))) {
      expect(upstream, slot).toContain(slot);
    }

    expect(html).not.toContain("<table");
    expect(html).not.toContain("<thead");
    expect(html).not.toContain("<tbody");
    expect(html).toContain("table__content");
    expect(html).toContain('role="grid"');
    expect(html).toContain('aria-rowcount="31"');
    expect(html).toContain("position:sticky");
    expect(html).toContain("grid-template-columns:repeat(2, minmax(0, 1fr))");
    expect(html).toContain("translateY(50px)");
    expect(html).toContain("--table-row-level:1");
    expect(html).toContain('data-slot="table-load-more"');
    expect(html).toContain('data-slot="table-load-more-content"');
    expect(html).toContain("table__load-more");
    expect(html).toContain("table__load-more-content");
    expect(html).toContain("h-64");
  });
});
