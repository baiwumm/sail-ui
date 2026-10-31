import {CalendarDate} from "@internationalized/date";
import type {DateValue} from "@internationalized/date";
import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

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

const headerParts = () => [
  h(CalendarNavButton, {page: "previous"}),
  h(CalendarYearPickerTrigger, null, {
    default: () => [h(CalendarYearPickerTriggerHeading), h(CalendarYearPickerTriggerIndicator)],
  }),
  h(CalendarNavButton, {page: "next"}),
  h(CalendarHeading),
];

const CalendarPage = defineComponent({
  setup() {
    return () =>
      h(
        CalendarRoot,
        {"aria-label": "Event date", defaultValue: new CalendarDate(2025, 2, 14), locale: "en"},
        {
          default: () => [
            h(CalendarHeader, null, {default: headerParts}),
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

const RangeCalendarPage = defineComponent({
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
            h(CalendarHeader, null, {default: headerParts}),
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

const tagsOf = (html: string, slot: string) =>
  [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, "g"))].map((match) => match[0]);

describe("T07 calendar SSR", () => {
  it("renders every upstream slot", async () => {
    const html = await renderSSR(CalendarPage);

    for (const slot of [
      "calendar",
      "calendar-header",
      "calendar-heading",
      "calendar-nav-button",
      "calendar-nav-button-icon",
      "calendar-grid",
      "calendar-grid-header",
      "calendar-grid-body",
      "calendar-header-cell",
      "calendar-cell",
      "calendar-cell-indicator",
      "calendar-year-picker-trigger",
      "calendar-year-picker-trigger-heading",
      "calendar-year-picker-trigger-indicator",
      "calendar-year-picker-grid",
      "calendar-year-picker-year-cell",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }
  });

  it("renders the labeled calendar with a selected, focusable day", async () => {
    const html = await renderSSR(CalendarPage);
    const selected = tagsOf(html, "calendar-cell").find((tag) =>
      tag.includes('data-selected="true"'),
    );
    const grid = tagsOf(html, "calendar-grid")[0] ?? "";

    expect(html).toContain('<div aria-label="Event date, February 2025"');
    expect(html).toContain('role="application"');
    expect(grid).toContain('aria-label="Event date, February 2025"');
    expect(grid).toContain('role="grid"');
    expect(html).toContain("<h2");
    expect(html).toContain('aria-label="Previous"');
    expect(html).toContain('slot="previous"');
    expect(html).toContain('slot="next"');
    expect(selected).toContain('data-value="2025-02-14"');
    expect(selected).toContain('tabindex="0"');
    expect(
      tagsOf(html, "calendar-cell").filter((tag) => tag.includes('tabindex="0"')),
    ).toHaveLength(1);
  });

  it("keeps the year picker closed", async () => {
    const html = await renderSSR(CalendarPage);
    const grid = tagsOf(html, "calendar-year-picker-grid")[0] ?? "";
    const yearCells = tagsOf(html, "calendar-year-picker-year-cell");

    expect(grid).toContain('aria-hidden="true"');
    expect(grid).not.toContain("data-open");
    expect(yearCells).toHaveLength(20);
    expect(yearCells.every((cell) => cell.includes('tabindex="-1"'))).toBe(true);
  });

  it("produces deterministic markup", async () => {
    const first = await renderSSR(CalendarPage);

    expect(await renderSSR(CalendarPage)).toBe(first);
  });
});

describe("T07 range calendar SSR", () => {
  it("renders every upstream slot", async () => {
    const html = await renderSSR(RangeCalendarPage);

    for (const slot of [
      "range-calendar",
      "range-calendar-header",
      "range-calendar-heading",
      "range-calendar-nav-button",
      "range-calendar-grid",
      "range-calendar-grid-body",
      "range-calendar-header-cell",
      "range-calendar-cell",
      "range-calendar-cell-button",
      "range-calendar-cell-indicator",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html).not.toContain('data-slot="calendar-cell"');
    expect(html).not.toContain('data-slot="calendar-grid"');
  });

  it("renders the selected endpoints", async () => {
    const html = await renderSSR(RangeCalendarPage);
    const start = tagsOf(html, "range-calendar-cell").find((tag) =>
      tag.includes('data-selection-start="true"'),
    );
    const end = tagsOf(html, "range-calendar-cell").find((tag) =>
      tag.includes('data-selection-end="true"'),
    );

    expect(html).toContain('aria-label="Range, February 2025"');
    expect(html).toContain('aria-multiselectable="true"');
    expect(start).toContain('data-value="2025-02-10"');
    expect(start).toContain('data-selected="true"');
    expect(start).toContain('data-selection-start="true"');
    expect(end).toContain('data-value="2025-02-12"');
    expect(end).toContain('data-selection-end="true"');

    const buttons = tagsOf(html, "range-calendar-cell-button");

    expect(buttons.filter((tag) => tag.includes('data-selected="true"'))).toHaveLength(2);
  });
});
