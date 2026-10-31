import type {DateValue} from "@internationalized/date";

import {
  getLocalTimeZone,
  isEqualMonth,
  isSameYear,
  startOfYear,
  toCalendarDate,
} from "@internationalized/date";

import type {
  CalendarFirstDayOfWeek,
  CalendarMonthGrid,
  CalendarOffset,
  CalendarYearItem,
  RekaCalendarState,
  WeekdayStyle,
} from "./types";

export type {CalendarMonthGrid, RekaCalendarState};

export function mapFirstDayOfWeek(
  day: CalendarFirstDayOfWeek | undefined,
): 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined {
  switch (day) {
    case "sun":
      return 0;
    case "mon":
      return 1;
    case "tue":
      return 2;
    case "wed":
      return 3;
    case "thu":
      return 4;
    case "fri":
      return 5;
    case "sat":
      return 6;
    default:
      return undefined;
  }
}

export function formatDay(state: RekaCalendarState, date: DateValue): string {
  const formatter = new Intl.DateTimeFormat(state.locale.value, {
    calendar: date.calendar.identifier,
    day: "numeric",
    timeZone: getLocalTimeZone(),
  });

  return (
    formatter.formatToParts(date.toDate(getLocalTimeZone())).find((part) => part.type === "day")
      ?.value ?? String(date.day)
  );
}

export function getYearRange(start?: DateValue | null, end?: DateValue | null): DateValue[] {
  const years: DateValue[] = [];

  if (!start || !end) {
    return years;
  }

  let current = startOfYear(start);

  while (current.compare(end) <= 0 && years.length < 5000) {
    years.push(current);
    current = startOfYear(current.add({years: 1}));
  }

  return years;
}

function monthHeadingOptions(date: DateValue, options: Intl.DateTimeFormatOptions = {}) {
  return {
    calendar: date.calendar.identifier,
    era: date.calendar.identifier === "gregory" && date.era === "BC" ? "short" : undefined,
    ...options,
  } satisfies Intl.DateTimeFormatOptions;
}

export function formatMonthHeading(
  state: RekaCalendarState,
  date: DateValue,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return state.formatter.fullMonthAndYear(
    date.toDate(getLocalTimeZone()),
    monthHeadingOptions(date, options),
  );
}

export function formatYearHeading(
  state: RekaCalendarState,
  date: DateValue,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return state.formatter.custom(date.toDate(getLocalTimeZone()), {
    year: "numeric",
    ...(date.calendar.identifier === "gregory" && date.era === "BC" ? {era: "short"} : {}),
    calendar: date.calendar.identifier,
    ...options,
  });
}

export function resolveMonth(
  months: CalendarMonthGrid[],
  offset?: CalendarOffset,
): CalendarMonthGrid | undefined {
  const first = months[0];

  if (!first) {
    return undefined;
  }

  if (!offset) {
    return first;
  }

  const target = first.value.add(offset);
  const match = months.find((month) => isEqualMonth(month.value, target));

  return match ?? first;
}

/** Mirrors upstream's `useCalendarHeading`: the offset applies to the visible range start. */
export function resolveHeading(
  state: RekaCalendarState,
  offset?: CalendarOffset,
  format?: Intl.DateTimeFormatOptions,
): string {
  const first = state.grid.value[0];

  if (!first) {
    return state.headingValue.value;
  }

  // Reka's `headingValue` joins every visible month ("February - March 2025");
  // upstream formats the single visible range start instead.
  return formatMonthHeading(state, offset ? first.value.add(offset) : first.value, format);
}

export function getWeekdayLabels(
  state: RekaCalendarState,
  rows: (DateValue | null)[][],
  style: WeekdayStyle,
): string[] {
  const firstWeek = rows[0] ?? [];
  const formatter = new Intl.DateTimeFormat(state.locale.value, {weekday: style});

  return firstWeek
    .slice(0, 7)
    .map((date) => (date ? formatter.format(date.toDate(getLocalTimeZone())) : ""));
}

export function getYearItems(
  state: RekaCalendarState,
  visibleYearsProp: number | undefined,
  format: Intl.DateTimeFormatOptions = {},
): CalendarYearItem[] {
  const focused = state.placeholder.value;
  const minValue = state.minValue.value;
  const maxValue = state.maxValue.value;
  const visibleYears =
    visibleYearsProp ?? (minValue && maxValue ? getYearRange(minValue, maxValue).length : 20);
  let minDate = focused.subtract({years: Math.floor(visibleYears / 2)});
  let maxDate = focused.add({years: Math.ceil(visibleYears / 2) - 1});

  if (maxValue && maxDate.compare(maxValue) > 0) {
    maxDate = toCalendarDate(maxValue);
    minDate = maxDate.subtract({years: visibleYears - 1});
  }

  if (minValue && minDate.compare(minValue) < 0) {
    minDate = toCalendarDate(minValue);
    maxDate = minDate.add({years: visibleYears - 1});

    if (maxValue && maxDate.compare(maxValue) > 0) {
      maxDate = toCalendarDate(maxValue);
    }
  }

  const items: CalendarYearItem[] = [];
  let date = minDate;

  while ((date.compare(maxDate) <= 0 || isSameYear(date, maxDate)) && items.length < 5000) {
    const itemDate = date.compare(maxDate) > 0 ? maxDate : date;

    items.push({
      id: items.length,
      date: itemDate,
      year: itemDate.year,
      formatted: formatYearHeading(state, itemDate, format),
    });
    date = date.add({years: 1});
  }

  return items;
}

export function getYearGridLabel(locale: string): string {
  try {
    return new Intl.DisplayNames(locale, {type: "dateTimeField"}).of("year") ?? "Year";
  } catch {
    return "Year";
  }
}
