import type {DateValue} from "@internationalized/date";

import {CalendarDate} from "@internationalized/date";
import {
  Calendar,
  DateField,
  DatePicker,
  DateRangePicker,
  Label,
  RangeCalendar,
} from "@heroui/react";
import {useState} from "react";

const minDate = new CalendarDate(2025, 2, 1);
const maxDate = new CalendarDate(2025, 4, 30);

function formatDate(value: DateValue | undefined) {
  return value
    ? `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`
    : "none";
}

export default function DatePickers() {
  const [dateValue, setDateValue] = useState<CalendarDate | null>(new CalendarDate(2025, 2, 14));
  const [rangeValue, setRangeValue] = useState<{start: CalendarDate; end: CalendarDate} | null>({
    start: new CalendarDate(2025, 2, 10),
    end: new CalendarDate(2025, 2, 12),
  });
  const [travelValue, setTravelValue] = useState<{start: DateValue; end: DateValue} | null>(null);

  return (
    <section id="date-pickers" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Date pickers</h2>
      <div className="flex flex-wrap items-start gap-6">
        <DatePicker
          className="w-64"
          data-testid="date-picker-basic"
          maxValue={maxDate}
          minValue={minDate}
          name="date"
          placeholderValue={minDate}
          value={dateValue}
          onChange={setDateValue}
        >
          <Label>Event date</Label>
          <DateField.Group>
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DatePicker.Trigger aria-label="Choose event date">
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DatePicker.Popover>
            <Calendar aria-label="Event date">
              <Calendar.Header>
                <Calendar.NavButton slot="previous" />
                <Calendar.Heading />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
              </Calendar.Grid>
            </Calendar>
          </DatePicker.Popover>
        </DatePicker>

        <DateRangePicker
          className="w-80"
          data-testid="date-range-picker-basic"
          endName="end"
          maxValue={maxDate}
          minValue={minDate}
          placeholderValue={minDate}
          startName="start"
          value={rangeValue}
          onChange={setRangeValue}
        >
          <Label>Stay</Label>
          <DateField.Group>
            <DateField.Input slot="start">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateRangePicker.RangeSeparator />
            <DateField.Input slot="end">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DateRangePicker.Trigger aria-label="Choose stay dates">
                <DateRangePicker.TriggerIndicator />
              </DateRangePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DateRangePicker.Popover>
            <RangeCalendar aria-label="Stay">
              <RangeCalendar.Header>
                <RangeCalendar.NavButton slot="previous" />
                <RangeCalendar.Heading />
                <RangeCalendar.NavButton slot="next" />
              </RangeCalendar.Header>
              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                </RangeCalendar.GridHeader>
                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
            </RangeCalendar>
          </DateRangePicker.Popover>
        </DateRangePicker>

        <DateRangePicker
          className="w-80"
          data-testid="date-range-picker-disabled"
          isDisabled
          value={travelValue}
          onChange={setTravelValue}
        >
          <Label>Travel dates</Label>
          <DateField.Group>
            <DateField.Input slot="start">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateRangePicker.RangeSeparator />
            <DateField.Input slot="end">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DateRangePicker.Trigger aria-label="Choose travel dates">
                <DateRangePicker.TriggerIndicator />
              </DateRangePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DateRangePicker.Popover>
            <RangeCalendar aria-label="Travel dates">
              <RangeCalendar.Grid>
                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
            </RangeCalendar>
          </DateRangePicker.Popover>
        </DateRangePicker>
      </div>

      <p className="text-sm text-muted">
        Event date:{" "}
        <span data-testid="date-picker-value">{formatDate(dateValue ?? undefined)}</span>
      </p>
      <p className="text-sm text-muted">
        Stay:{" "}
        <span data-testid="date-range-picker-value">
          {rangeValue ? `${formatDate(rangeValue.start)} → ${formatDate(rangeValue.end)}` : "none"}
        </span>
      </p>
      <p className="text-sm text-muted">
        Travel:{" "}
        <span data-testid="date-range-picker-disabled-value">
          {travelValue
            ? `${formatDate(travelValue.start)} → ${formatDate(travelValue.end)}`
            : "none"}
        </span>
      </p>
    </section>
  );
}
