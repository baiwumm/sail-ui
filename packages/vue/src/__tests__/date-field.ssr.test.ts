import {CalendarDate, Time} from "@internationalized/date";
import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {
  DateFieldGroup,
  DateFieldInput,
  DateFieldRoot,
  DateFieldSegment,
  type DateFieldSegmentContent,
} from "../components/date-field";
import {Description} from "../components/description";
import {FieldError} from "../components/field-error";
import {Label} from "../components/label";
import {TimeFieldGroup, TimeFieldInput, TimeFieldRoot} from "../components/time-field";

const DateFieldPage = defineComponent({
  setup() {
    return () =>
      h(
        DateFieldRoot,
        {defaultValue: new CalendarDate(2026, 8, 15), locale: "en", name: "date"},
        {
          default: () => [
            h(Label, null, {default: () => "Date"}),
            h(DateFieldGroup, null, {
              default: () => [
                h(DateFieldInput, null, {
                  default: ({segment}: {segment: DateFieldSegmentContent}) =>
                    h(DateFieldSegment, {segment}),
                }),
              ],
            }),
            h(Description, null, {default: () => "Enter a date"}),
          ],
        },
      );
  },
});

const InvalidDateFieldPage = defineComponent({
  setup() {
    return () =>
      h(
        DateFieldRoot,
        {isInvalid: true, isRequired: true, locale: "en", name: "date"},
        {
          default: () => [
            h(Label, null, {default: () => "Date"}),
            h(DateFieldGroup, null, {default: () => [h(DateFieldInput)]}),
            h(FieldError, null, {default: () => "Please enter a valid date"}),
          ],
        },
      );
  },
});

const TimeFieldPage = defineComponent({
  setup() {
    return () =>
      h(
        TimeFieldRoot,
        {defaultValue: new Time(13, 45), locale: "en", name: "time"},
        {
          default: () => [
            h(Label, null, {default: () => "Time"}),
            h(TimeFieldGroup, null, {default: () => [h(TimeFieldInput)]}),
          ],
        },
      );
  },
});

describe("T07 date field SSR", () => {
  it("renders a dated field without mismatches", async () => {
    const html = await renderSSR(DateFieldPage);

    expect(html).toContain('data-slot="date-field"');
    expect(html).toContain('data-slot="date-input-group"');
    expect(html).toContain('data-slot="date-input-group-input"');
    expect(html).toContain('data-slot="date-input-group-segment"');
    expect(html).toContain('role="spinbutton"');
    expect(html).toContain('data-type="month"');
    expect(html).toContain('aria-valuenow="8"');
    expect(html).toContain("2026");
    expect(html).toContain('type="date"');
    expect(html).toContain('name="date"');
  });

  it("renders an invalid, required field with FieldError", async () => {
    const html = await renderSSR(InvalidDateFieldPage);

    expect(html).toContain('data-required="true"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("Please enter a valid date");
  });

  it("renders a 12-hour time field", async () => {
    const html = await renderSSR(TimeFieldPage);

    expect(html).toContain('data-slot="time-field"');
    expect(html).toContain('data-type="hour"');
    expect(html).toContain('data-type="minute"');
    expect(html).toContain('data-type="dayPeriod"');
    expect(html).toContain('aria-valuetext="PM"');
    expect(html).toContain('name="time"');
  });
});
