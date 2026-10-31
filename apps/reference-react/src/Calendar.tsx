import type {DateValue} from "@internationalized/date";

import {CalendarDate, isWeekend} from "@internationalized/date";
import {Calendar, RangeCalendar} from "@heroui/react";
import {useState} from "react";

function formatDate(value: DateValue | null | undefined) {
  return value
    ? `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`
    : "none";
}

export default function CalendarDemo() {
  const [basicValue, setBasicValue] = useState<CalendarDate | null>(new CalendarDate(2025, 2, 14));
  const [pickerValue, setPickerValue] = useState<CalendarDate | null>(
    new CalendarDate(2025, 2, 14),
  );
  const [multiValue, setMultiValue] = useState<CalendarDate | null>(new CalendarDate(2025, 2, 14));
  const [rangeValue, setRangeValue] = useState<{start: CalendarDate; end: CalendarDate} | null>({
    start: new CalendarDate(2025, 2, 10),
    end: new CalendarDate(2025, 2, 12),
  });

  const [basicFocused, setBasicFocused] = useState<CalendarDate | undefined>(
    new CalendarDate(2025, 2, 14),
  );
  const [pickerFocused, setPickerFocused] = useState<CalendarDate | undefined>(
    new CalendarDate(2025, 2, 14),
  );
  const [multiFocused, setMultiFocused] = useState<CalendarDate | undefined>(
    new CalendarDate(2025, 2, 14),
  );
  const [rangeFocused, setRangeFocused] = useState<CalendarDate | undefined>(
    new CalendarDate(2025, 2, 10),
  );

  return (
    <section id="calendar" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Calendar</h2>
      <div className="flex flex-wrap items-start gap-8">
        <div className="flex flex-col gap-2">
          <Calendar
            aria-label="Event date"
            data-testid="calendar-basic"
            focusedValue={basicFocused}
            value={basicValue}
            onChange={setBasicValue}
            onFocusChange={setBasicFocused}
          >
            <Calendar.Header>
              <Calendar.NavButton slot="previous" />
              <Calendar.Heading />
              <Calendar.NavButton slot="next" />
            </Calendar.Header>
            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>
                {(date) => (
                  <Calendar.Cell date={date}>
                    {({formattedDate}) => (
                      <>
                        {formattedDate}
                        <Calendar.CellIndicator />
                      </>
                    )}
                  </Calendar.Cell>
                )}
              </Calendar.GridBody>
            </Calendar.Grid>
          </Calendar>
          <p className="text-sm text-muted">
            Selected: <span data-testid="calendar-basic-value">{formatDate(basicValue)}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Calendar
            aria-label="Picker date"
            data-testid="calendar-picker"
            focusedValue={pickerFocused}
            value={pickerValue}
            onChange={setPickerValue}
            onFocusChange={setPickerFocused}
          >
            <Calendar.Header>
              <Calendar.NavButton slot="previous" />
              <Calendar.YearPickerTrigger data-testid="calendar-picker-trigger">
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator />
              </Calendar.YearPickerTrigger>
              <Calendar.NavButton slot="next" />
            </Calendar.Header>
            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>
                {(date) => (
                  <Calendar.Cell date={date}>
                    {({formattedDate}) => (
                      <>
                        {formattedDate}
                        <Calendar.CellIndicator />
                      </>
                    )}
                  </Calendar.Cell>
                )}
              </Calendar.GridBody>
            </Calendar.Grid>
            <Calendar.YearPickerGrid data-testid="calendar-picker-grid">
              <Calendar.YearPickerGridBody>
                {({year}) => <Calendar.YearPickerCell year={year} />}
              </Calendar.YearPickerGridBody>
            </Calendar.YearPickerGrid>
          </Calendar>
          <p className="text-sm text-muted">
            Selected: <span data-testid="calendar-picker-value">{formatDate(pickerValue)}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <RangeCalendar
            aria-label="Trip range"
            data-testid="range-calendar"
            focusedValue={rangeFocused}
            value={rangeValue}
            onChange={setRangeValue}
            onFocusChange={setRangeFocused}
          >
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
                {(date) => (
                  <RangeCalendar.Cell date={date}>
                    {({formattedDate}) => (
                      <>
                        {formattedDate}
                        <RangeCalendar.CellIndicator />
                      </>
                    )}
                  </RangeCalendar.Cell>
                )}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
          </RangeCalendar>
          <p className="text-sm text-muted">
            Range:{" "}
            <span data-testid="range-calendar-value">
              {rangeValue
                ? `${formatDate(rangeValue.start)} → ${formatDate(rangeValue.end)}`
                : "none → none"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">Two visible months, weekends unavailable.</p>
        <Calendar
          aria-label="Availability"
          className="w-full max-w-none overflow-x-auto"
          data-testid="calendar-two-month"
          focusedValue={multiFocused}
          isDateUnavailable={(date) => isWeekend(date, "en")}
          value={multiValue}
          visibleDuration={{months: 2}}
          onChange={setMultiValue}
          onFocusChange={setMultiFocused}
        >
          <div className="flex gap-8">
            <div className="w-64">
              <Calendar.Header>
                <Calendar.NavButton slot="previous" />
                <Calendar.Heading className="flex-none" />
                <div className="size-6" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(date) => (
                    <Calendar.Cell date={date}>
                      {({formattedDate}) => (
                        <>
                          {formattedDate}
                          <Calendar.CellIndicator />
                        </>
                      )}
                    </Calendar.Cell>
                  )}
                </Calendar.GridBody>
              </Calendar.Grid>
            </div>
            <div className="w-64">
              <Calendar.Header>
                <div className="size-6" />
                <Calendar.Heading className="flex-none" offset={{months: 1}} />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid offset={{months: 1}}>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(date) => (
                    <Calendar.Cell date={date}>
                      {({formattedDate}) => (
                        <>
                          {formattedDate}
                          <Calendar.CellIndicator />
                        </>
                      )}
                    </Calendar.Cell>
                  )}
                </Calendar.GridBody>
              </Calendar.Grid>
            </div>
          </div>
        </Calendar>
        <p className="text-sm text-muted">
          Selected: <span data-testid="calendar-two-month-value">{formatDate(multiValue)}</span>
        </p>
      </div>
    </section>
  );
}
