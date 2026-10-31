import {readFileSync} from "node:fs";
import {join} from "node:path";

import {CalendarDate} from "@internationalized/date";
import type {DateValue} from "@internationalized/date";
import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

import {
  CalendarCell,
  CalendarCellIndicator,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  CalendarNavButton,
  CalendarRoot,
} from "../components/calendar";
import {
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
} from "../components/calendar-year-picker";
import {
  RangeCalendarCell,
  RangeCalendarCellIndicator,
  RangeCalendarRoot,
} from "../components/range-calendar";

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

const yearPickerSlots = slotSnapshot.components["calendar-year-picker"] ?? [];

function headerParts(page: "previous" | "next" = "next") {
  return [
    h(CalendarNavButton, {page: "previous"}),
    h(CalendarYearPickerTrigger, null, {
      default: () => [h(CalendarYearPickerTriggerHeading), h(CalendarYearPickerTriggerIndicator)],
    }),
    page === "next" ? h(CalendarNavButton, {page: "next"}) : null,
    h(CalendarHeading),
  ];
}

const CalendarHost = defineComponent({
  setup() {
    return () =>
      h(
        CalendarRoot,
        {
          "aria-label": "Event date",
          defaultValue: new CalendarDate(2025, 2, 14),
          locale: "en",
        },
        {
          default: () => [
            h(CalendarHeader, null, {default: () => headerParts()}),
            h(CalendarGrid, null, {
              default: () => [
                h(CalendarGridHeader),
                h(CalendarGridBody, null, {
                  default: ({date}: {date: DateValue}) =>
                    h(CalendarCell, {date}, {default: () => h(CalendarCellIndicator)}),
                }),
              ],
            }),
            h(CalendarYearPickerGrid, null, {default: () => h(CalendarYearPickerGridBody)}),
          ],
        },
      );
  },
});

const RangeCalendarHost = defineComponent({
  setup() {
    return () =>
      h(
        RangeCalendarRoot,
        {
          "aria-label": "Range",
          defaultValue: {
            start: new CalendarDate(2025, 2, 10),
            end: new CalendarDate(2025, 2, 12),
          },
          locale: "en",
        },
        {
          default: () => [
            h(CalendarHeader, null, {default: () => headerParts()}),
            h(CalendarGrid, null, {
              default: () => [
                h(CalendarGridHeader),
                h(CalendarGridBody, null, {
                  default: ({date}: {date: DateValue}) =>
                    h(
                      RangeCalendarCell,
                      {date},
                      {
                        default: () => h(RangeCalendarCellIndicator),
                      },
                    ),
                }),
              ],
            }),
            h(CalendarYearPickerGrid, null, {default: () => h(CalendarYearPickerGridBody)}),
          ],
        },
      );
  },
});

const cellTags = (html: string, slot: string) =>
  [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, "g"))].map((match) => match[0]);

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Calendar contract", () => {
  it("renders every upstream slot", async () => {
    const wrapper = mount(CalendarHost, {attachTo: document.body});

    expectUpstreamSlots(wrapper.html(), "calendar", yearPickerSlots);
  });

  it("renders the root, header, grid and cell attributes", async () => {
    const wrapper = mount(CalendarHost, {attachTo: document.body});
    const root = wrapper.get('[data-slot="calendar"]');
    const html = wrapper.html();

    expect(root.attributes("role")).toBe("application");
    expect(root.attributes("aria-label")).toBe("Event date, February 2025");
    expect(root.attributes("data-slot")).toBe("calendar");

    const previous = wrapper.get('[data-slot="calendar-nav-button"][slot="previous"]');

    expect(previous.attributes("aria-label")).toBe("Previous");
    expect(previous.attributes("type")).toBe("button");
    expect(previous.attributes("data-disabled")).toBeUndefined();

    expect(wrapper.get('[data-slot="calendar-heading"]').element.tagName).toBe("H2");
    expect(wrapper.get('[data-slot="calendar-heading"]').attributes("aria-hidden")).toBe("true");

    const grid = wrapper.get('[data-slot="calendar-grid"]');

    expect(grid.element.tagName).toBe("TABLE");
    expect(grid.attributes("role")).toBe("grid");
    expect(grid.attributes("aria-label")).toBe("Event date, February 2025");
    expect(grid.attributes("aria-readonly")).toBeUndefined();
    expect(grid.attributes("aria-multiselectable")).toBeUndefined();
    expect(grid.attributes("cellpadding")).toBe("0");

    expect(wrapper.get('[data-slot="calendar-grid-header"]').element.tagName).toBe("THEAD");
    expect(wrapper.get('[data-slot="calendar-grid-header"]').attributes("aria-hidden")).toBe(
      "true",
    );
    expect(wrapper.get('[data-slot="calendar-grid-body"]').element.tagName).toBe("TBODY");
    expect(wrapper.find('[data-slot="calendar-header-cell"]').element.tagName).toBe("TH");

    const selected = wrapper.get('[data-slot="calendar-cell"][data-selected="true"]');

    expect(selected.attributes("role")).toBe("button");
    expect(selected.attributes("tabindex")).toBe("0");
    expect(selected.element.parentElement?.getAttribute("role")).toBe("gridcell");
    expect(selected.element.parentElement?.getAttribute("aria-selected")).toBe("true");
    expect(wrapper.find('[data-slot="calendar-cell"][data-outside-month="true"]')).toBeTruthy();
    expect(wrapper.get('[data-slot="calendar-cell-indicator"]').attributes("aria-hidden")).toBe(
      "true",
    );
    expect(html).toContain('class="calendar__cell"');
  });

  it("keeps the year picker closed in the server render", async () => {
    const html = await renderSSR(CalendarHost);
    const yearCells = [
      ...html.matchAll(/<button[^>]*data-slot="calendar-year-picker-year-cell"[^>]*>/g),
    ];

    expect(yearCells).toHaveLength(20);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('data-open="true"');
    expect(yearCells.every((cell) => cell[0].includes('tabindex="-1"'))).toBe(true);
  });
});

describe("RangeCalendar contract", () => {
  it("renders every upstream slot", () => {
    const wrapper = mount(RangeCalendarHost, {attachTo: document.body});

    expectUpstreamSlots(wrapper.html(), "range-calendar", yearPickerSlots);
  });

  it("renders range selection attributes", () => {
    const wrapper = mount(RangeCalendarHost);
    const grid = wrapper.get('[data-slot="range-calendar-grid"]');
    const html = wrapper.html();

    expect(grid.attributes("role")).toBe("grid");
    expect(grid.attributes("aria-multiselectable")).toBe("true");
    expect(grid.attributes("aria-label")).toBe("Range, February 2025");
    expect(wrapper.get('[data-slot="range-calendar"]').attributes("data-slot")).toBe(
      "range-calendar",
    );

    const start = wrapper.get('[data-slot="range-calendar-cell"][data-selection-start="true"]');
    const end = wrapper.get('[data-slot="range-calendar-cell"][data-selection-end="true"]');

    expect(start.attributes("data-selected")).toBe("true");
    expect(end.attributes("data-selected")).toBe("true");
    expect(start.get('[data-slot="range-calendar-cell-button"]').attributes("data-selected")).toBe(
      "true",
    );
    expect(
      wrapper
        .get('[data-slot="range-calendar-cell"][data-value="2025-02-11"]')
        .get('[data-slot="range-calendar-cell-button"]')
        .attributes("data-selected"),
    ).toBeUndefined();

    expect(cellTags(html, "range-calendar-cell").length).toBeGreaterThan(20);
  });

  it("does not render Calendar-only slots", () => {
    const wrapper = mount(RangeCalendarHost);

    expect(wrapper.find('[data-slot="calendar-cell"]').exists()).toBe(false);
    expect(wrapper.find('[data-slot="calendar-grid"]').exists()).toBe(false);
  });
});

describe("Calendar year picker contract", () => {
  it("renders the trigger, grid and cells with upstream attributes", () => {
    const wrapper = mount(CalendarHost);
    const trigger = wrapper.get('[data-slot="calendar-year-picker-trigger"]');
    const grid = wrapper.get('[data-slot="calendar-year-picker-grid"]');
    const cells = wrapper.findAll('[data-slot="calendar-year-picker-year-cell"]');

    expect(trigger.attributes("type")).toBe("button");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(trigger.attributes("aria-label")).toContain("year selector");
    expect(trigger.find('[data-slot="calendar-year-picker-trigger-heading"]').text()).toBe(
      "February 2025",
    );
    expect(
      trigger.get('[data-slot="calendar-year-picker-trigger-indicator"]').attributes("aria-hidden"),
    ).toBe("true");

    expect(grid.attributes("role")).toBe("listbox");
    expect(grid.attributes("tabindex")).toBe("-1");
    expect(grid.attributes("aria-hidden")).toBe("true");
    expect(grid.attributes("data-open")).toBeUndefined();

    expect(cells).toHaveLength(20);
    expect(cells[0]!.attributes("data-year")).toBeTruthy();
    expect(cells.every((cell) => cell.attributes("tabindex") === "-1")).toBe(true);
    expect(cells.every((cell) => cell.attributes("aria-selected") === undefined)).toBe(true);

    const selected = wrapper.get('[data-year="2025"]');

    expect(selected.attributes("data-selected")).toBe("true");
    expect(selected.attributes("aria-label")).toBe("2025");
  });
});
