import type {DateValue} from "@internationalized/date";

import {CalendarDate, Time} from "@internationalized/date";
import {DateField, Description, FieldError, Label, TimeField} from "@heroui/react";
import {useState} from "react";

const rangeMin = new CalendarDate(2025, 2, 1);
const defaultTime = new Time(13, 45, 30);

function formatDate(value: DateValue | null) {
  return value
    ? `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`
    : "none";
}

function formatTime(value: Time | null) {
  return value
    ? `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`
    : "none";
}

export default function DateFields() {
  const [dateValue, setDateValue] = useState<DateValue | null>(new CalendarDate(2025, 2, 14));
  const [timeValue, setTimeValue] = useState<Time | null>(new Time(13, 45));

  return (
    <section id="date-fields" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Date &amp; time fields</h2>
      <div className="flex flex-wrap items-start gap-6">
        <DateField
          className="w-64"
          data-testid="date-field-basic"
          name="date"
          value={dateValue}
          onChange={setDateValue}
        >
          <Label>Date</Label>
          <DateField.Group>
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
          </DateField.Group>
          <Description>Arrow keys change the focused segment.</Description>
        </DateField>

        <DateField
          className="w-64"
          data-testid="date-field-invalid"
          isInvalid
          isRequired
          name="start-date"
        >
          <Label>Start date</Label>
          <DateField.Group>
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
          </DateField.Group>
          <FieldError>Choose a start date.</FieldError>
        </DateField>

        <DateField
          className="w-72"
          data-testid="date-field-range"
          defaultValue={new CalendarDate(2025, 1, 1)}
          minValue={rangeMin}
          name="due-date"
          validationBehavior="aria"
        >
          <Label>Due date</Label>
          <DateField.Group variant="secondary">
            <DateField.Prefix>On</DateField.Prefix>
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>UTC</DateField.Suffix>
          </DateField.Group>
          <Description>Dates before February 2025 are invalid.</Description>
        </DateField>

        <DateField
          className="w-64"
          data-testid="date-field-disabled"
          isDisabled
          name="disabled-date"
        >
          <Label>Locked date</Label>
          <DateField.Group>
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
          </DateField.Group>
        </DateField>
      </div>

      <p className="text-sm text-muted">
        Controlled date: <span data-testid="date-field-value">{formatDate(dateValue)}</span>
      </p>

      <div className="flex flex-wrap items-start gap-6">
        <TimeField
          className="w-56"
          data-testid="time-field-basic"
          name="time"
          value={timeValue}
          onChange={setTimeValue}
        >
          <Label>Time</Label>
          <TimeField.Group>
            <TimeField.Input>
              {(segment) => <TimeField.Segment segment={segment} />}
            </TimeField.Input>
          </TimeField.Group>
        </TimeField>

        <TimeField
          className="w-56"
          data-testid="time-field-24h"
          defaultValue={defaultTime}
          granularity="second"
          hourCycle={24}
          name="time-24"
        >
          <Label>Alarm</Label>
          <TimeField.Group>
            <TimeField.Input>
              {(segment) => <TimeField.Segment segment={segment} />}
            </TimeField.Input>
          </TimeField.Group>
          <Description>24-hour clock with seconds.</Description>
        </TimeField>
      </div>

      <p className="text-sm text-muted">
        Controlled time: <span data-testid="time-field-value">{formatTime(timeValue)}</span>
      </p>
    </section>
  );
}
