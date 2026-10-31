import type {InjectionKey} from "vue";

import {inject} from "vue";
import {injectCalendarRootContext, injectRangeCalendarRootContext} from "reka-ui";

import type {
  CalendarContextValue,
  CalendarGridContextValue,
  CalendarKind,
  CalendarYearPickerGridContextValue,
  CalendarYearPickerTriggerContextValue,
  RekaCalendarState,
  RekaRangeCalendarState,
} from "./types";

export const calendarContextKey: InjectionKey<CalendarContextValue> = Symbol("sail-calendar");
export const calendarGridContextKey: InjectionKey<CalendarGridContextValue> =
  Symbol("sail-calendar-grid");
export const calendarYearPickerTriggerContextKey: InjectionKey<CalendarYearPickerTriggerContextValue> =
  Symbol("sail-calendar-year-picker-trigger");
export const calendarYearPickerGridContextKey: InjectionKey<CalendarYearPickerGridContextValue> =
  Symbol("sail-calendar-year-picker-grid");

export function useCalendarContext(): CalendarContextValue {
  const context = inject(calendarContextKey, null);

  if (!context) {
    throw new Error("Calendar parts must be used inside <Calendar> or <RangeCalendar>.");
  }

  return context;
}

export function useCalendarGridContext(): CalendarGridContextValue {
  const context = inject(calendarGridContextKey, null);

  if (!context) {
    throw new Error("Calendar grid parts must be used inside <Calendar.Grid>.");
  }

  return context;
}

export function useCalendarYearPickerTriggerContext(): CalendarYearPickerTriggerContextValue {
  const context = inject(calendarYearPickerTriggerContextKey, null);

  if (!context) {
    throw new Error("Year picker trigger parts must be used inside <Calendar.YearPickerTrigger>.");
  }

  return context;
}

export function useCalendarYearPickerGridContext(): CalendarYearPickerGridContextValue {
  const context = inject(calendarYearPickerGridContextKey, null);

  if (!context) {
    throw new Error("Year picker cells must be used inside <Calendar.YearPickerGrid>.");
  }

  return context;
}

export function injectRekaCalendarState(
  kind: CalendarKind,
): RekaCalendarState | RekaRangeCalendarState | null {
  const calendar = injectCalendarRootContext(null);
  const range = injectRangeCalendarRootContext(null);

  if (kind === "range-calendar") {
    return range as unknown as RekaRangeCalendarState | null;
  }

  return calendar as unknown as RekaCalendarState | null;
}
