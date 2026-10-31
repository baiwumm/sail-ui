import {CalendarDate} from "@internationalized/date";
import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import type {Component} from "vue";
import {defineComponent, h} from "vue";

import {
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarRoot,
} from "../components/calendar";
import {
  DateFieldGroup,
  DateFieldInput,
  DateFieldSegment,
  DateFieldSuffix,
  type DateFieldSegmentContent,
} from "../components/date-field";
import {
  DatePickerPopover,
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
} from "../components/date-picker";
import {
  DateRangePickerPopover,
  DateRangePickerRangeSeparator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
} from "../components/date-range-picker";
import {Label} from "../components/label";
import {RangeCalendarRoot} from "../components/range-calendar";

const segmentsSlot = {
  default: ({segment}: {segment: DateFieldSegmentContent}) => h(DateFieldSegment, {segment}),
};

function pickerCalendar(calendar: Component) {
  return h(calendar, null, {
    default: () => [
      h(CalendarGrid, null, {
        default: () => [h(CalendarGridHeader), h(CalendarGridBody)],
      }),
    ],
  });
}

const DatePickerPage = defineComponent({
  setup() {
    return () =>
      h(
        DatePickerRoot,
        {defaultValue: new CalendarDate(2026, 8, 15), locale: "en", name: "date"},
        {
          default: () => [
            h(Label, null, {default: () => "Date"}),
            h(DateFieldGroup, null, {
              default: () => [
                h(DateFieldInput, null, segmentsSlot),
                h(DateFieldSuffix, null, {
                  default: () => [
                    h(
                      DatePickerTrigger,
                      {"aria-label": "Choose date"},
                      {
                        default: () => [h(DatePickerTriggerIndicator)],
                      },
                    ),
                  ],
                }),
              ],
            }),
            h(DatePickerPopover, null, {
              default: () => [pickerCalendar(CalendarRoot)],
            }),
          ],
        },
      );
  },
});

const DateRangePickerPage = defineComponent({
  setup() {
    return () =>
      h(
        DateRangePickerRoot,
        {
          defaultValue: {
            start: new CalendarDate(2026, 8, 10),
            end: new CalendarDate(2026, 8, 15),
          },
          endName: "end",
          locale: "en",
          startName: "start",
        },
        {
          default: () => [
            h(Label, null, {default: () => "Stay"}),
            h(DateFieldGroup, null, {
              default: () => [
                h(DateFieldInput, {slot: "start"}, segmentsSlot),
                h(DateRangePickerRangeSeparator),
                h(DateFieldInput, {slot: "end"}, segmentsSlot),
                h(DateFieldSuffix, null, {
                  default: () => [
                    h(
                      DateRangePickerTrigger,
                      {"aria-label": "Choose dates"},
                      {
                        default: () => [h(DateRangePickerTriggerIndicator)],
                      },
                    ),
                  ],
                }),
              ],
            }),
            h(DateRangePickerPopover, null, {
              default: () => [pickerCalendar(RangeCalendarRoot)],
            }),
          ],
        },
      );
  },
});

describe("T07 date picker SSR", () => {
  it("renders a closed date picker without the popover", async () => {
    const html = await renderSSR(DatePickerPage);

    expect(html).toContain('data-slot="date-picker"');
    expect(html).toContain('data-slot="date-input-group"');
    expect(html).toContain('data-slot="date-picker-trigger"');
    expect(html).toContain('data-slot="date-picker-trigger-indicator"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('type="date"');
    expect(html).toContain('name="date"');
    expect(html).not.toContain('data-slot="date-picker-popover"');
    expect(html).not.toContain('data-slot="calendar"');
  });

  it("renders a closed date range picker with both hidden inputs", async () => {
    const html = await renderSSR(DateRangePickerPage);

    expect(html).toContain('data-slot="date-range-picker"');
    expect(html).toContain('data-slot="date-range-picker-range-separator"');
    expect(html).toContain('data-slot="date-range-picker-trigger"');
    expect(html).toContain('slot="start"');
    expect(html).toContain('slot="end"');
    expect(html).toContain('name="start"');
    expect(html).toContain('value="2026-08-10"');
    expect(html).toContain('name="end"');
    expect(html).toContain('value="2026-08-15"');
    expect(html).not.toContain('data-slot="date-range-picker-popover"');
    expect(html).not.toContain('data-slot="range-calendar"');
  });
});
