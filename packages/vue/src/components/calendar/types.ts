import type {DateValue} from "@internationalized/date";
import type {calendarVariants, rangeCalendarVariants} from "@sail-ui/styles";
import type {Component, ComputedRef, Ref} from "vue";

export type CalendarKind = "calendar" | "range-calendar";
export type CalendarSelectionMode = "single" | "multiple";
export type CalendarPageBehavior = "single" | "visible";
export type WeekdayStyle = "narrow" | "short" | "long";
export type CalendarFirstDayOfWeek = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface CalendarOffset {
  days?: number;
  weeks?: number;
  months?: number;
  years?: number;
}

export interface CalendarDateRange {
  start: DateValue;
  end?: DateValue;
}

export type CalendarValue = DateValue | DateValue[] | null | undefined;
export type RangeCalendarValue = CalendarDateRange | null | undefined;
export type CalendarSlotsValue =
  ReturnType<typeof calendarVariants> | ReturnType<typeof rangeCalendarVariants>;

export interface CalendarVisibleDuration {
  /** Months rendered side by side. @default 1 */
  months?: number;
}

export interface CalendarRootProps {
  /** The selected date (or dates) when the calendar is controlled. */
  modelValue?: CalendarValue;
  /** The date selected when the calendar is uncontrolled. */
  defaultValue?: CalendarValue;
  /** The date that owns keyboard focus. */
  focusedValue?: DateValue;
  /** The focused date when the calendar is uncontrolled. */
  defaultFocusedValue?: DateValue;
  minValue?: DateValue;
  maxValue?: DateValue;
  /** @default "en" */
  locale?: string;
  /** @default "single" */
  selectionMode?: CalendarSelectionMode;
  /** @default {months: 1} */
  visibleDuration?: CalendarVisibleDuration;
  /** @default "visible" */
  pageBehavior?: CalendarPageBehavior;
  firstDayOfWeek?: CalendarFirstDayOfWeek;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  /** Marks individual dates as unavailable without disabling the whole calendar. */
  isDateUnavailable?: (date: DateValue) => boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  initialFocus?: boolean;
  isYearPickerOpen?: boolean;
  defaultYearPickerOpen?: boolean;
}

export interface CalendarRootEmits {
  change: [value: CalendarValue];
  "focus-change": [value: DateValue | undefined];
}

export interface RangeCalendarRootProps {
  /** The selected range when the calendar is controlled. */
  modelValue?: RangeCalendarValue;
  /** The range selected when the calendar is uncontrolled. */
  defaultValue?: RangeCalendarValue;
  /** The date that owns keyboard focus. */
  focusedValue?: DateValue;
  /** The focused date when the calendar is uncontrolled. */
  defaultFocusedValue?: DateValue;
  minValue?: DateValue;
  maxValue?: DateValue;
  /** @default "en" */
  locale?: string;
  /** @default {months: 1} */
  visibleDuration?: CalendarVisibleDuration;
  /** @default "visible" */
  pageBehavior?: CalendarPageBehavior;
  firstDayOfWeek?: CalendarFirstDayOfWeek;
  /** Allows ranges that contain unavailable dates. */
  allowNonContiguousRanges?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  initialFocus?: boolean;
  isYearPickerOpen?: boolean;
  defaultYearPickerOpen?: boolean;
}

export interface RangeCalendarRootEmits {
  change: [value: RangeCalendarValue];
  "focus-change": [value: DateValue | undefined];
}

export interface CalendarHeaderProps {}

export interface CalendarHeadingProps {
  /** Renders another month relative to the visible month. */
  offset?: CalendarOffset;
  format?: Intl.DateTimeFormatOptions;
}

export interface CalendarNavButtonProps {
  /**
   * Which page the button navigates to. Emitted as the upstream `slot`
   * attribute; the prop cannot be named `slot` because Vue reserves it.
   * @default "previous"
   */
  page?: "previous" | "next";
}

export interface CalendarGridProps {
  /** Renders another month of a multi-month calendar. */
  offset?: CalendarOffset;
  /** @default "short" */
  weekdayStyle?: WeekdayStyle;
}

export interface CalendarGridHeaderProps {}

export interface CalendarGridBodyProps {}

export interface CalendarHeaderCellProps {}

export interface CalendarCellProps {
  date: DateValue;
}

export interface CalendarCellIndicatorProps {}

export interface CalendarYearPickerTriggerProps {}

export interface CalendarYearPickerTriggerHeadingProps {
  format?: Intl.DateTimeFormatOptions;
  offset?: CalendarOffset;
}

export interface CalendarYearPickerTriggerIndicatorProps {}

export interface CalendarYearPickerGridProps {
  format?: Intl.DateTimeFormatOptions;
  /** @default the whole min/max year range, or 20 without bounds */
  visibleYears?: number;
}

export interface CalendarYearPickerCellProps {
  year: number;
  /** Forces the cell out of the tab order. */
  excludeFromTabOrder?: boolean;
}

export interface CalendarYearPickerRenderProps {
  formattedYear: string;
  isCurrentYear: boolean;
  isOpen: boolean;
  isSelected: boolean;
  selectYear: () => void;
  year: number;
}

export interface RekaCalendarState {
  locale: Ref<string>;
  placeholder: Ref<DateValue>;
  grid: Ref<CalendarMonthGrid[]>;
  headingValue: Ref<string>;
  formatter: {
    custom: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
    fullMonthAndYear: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  };
  parentElement: Ref<HTMLElement | undefined>;
  onPlaceholderChange: (date: DateValue) => void;
  minValue: Ref<DateValue | undefined>;
  maxValue: Ref<DateValue | undefined>;
  disabled: Ref<boolean>;
  readonly: Ref<boolean>;
  isInvalid: Ref<boolean>;
  isPlaceholderFocusable: Ref<boolean>;
  firstFocusableDate: Ref<DateValue | undefined>;
  isOutsideVisibleView: (date: DateValue) => boolean;
  isDateSelected: (date: DateValue) => boolean;
  isDateDisabled: (date: DateValue) => boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
  prevPage: () => void;
  nextPage: () => void;
  isPrevButtonDisabled: () => boolean;
  isNextButtonDisabled: () => boolean;
}

export interface RekaRangeCalendarState extends RekaCalendarState {
  startValue: Ref<DateValue | undefined>;
  endValue: Ref<DateValue | undefined>;
  highlightedRange: Ref<{start: DateValue; end: DateValue} | null>;
  focusedValue: Ref<DateValue | undefined>;
  isSelected: (date: DateValue) => boolean;
  isSelectionStart: (date: DateValue) => boolean;
  isSelectionEnd: (date: DateValue) => boolean;
  isHighlightedStart: (date: DateValue) => boolean;
  isHighlightedEnd: (date: DateValue) => boolean;
}

export interface CalendarMonthGrid {
  value: DateValue;
  rows: (DateValue | null)[][];
}

export interface CalendarGridContextValue {
  label: ComputedRef<string>;
  month: ComputedRef<DateValue>;
  rows: ComputedRef<(DateValue | null)[][]>;
  weekdayStyle: WeekdayStyle;
}

export interface CalendarContextValue {
  cellComponent: Component;
  heading: ComputedRef<string>;
  isMultiple: ComputedRef<boolean>;
  isYearPickerOpen: ComputedRef<boolean>;
  kind: CalendarKind;
  label: ComputedRef<string>;
  rangeState: RekaRangeCalendarState | null;
  setYearPickerOpen: (open: boolean) => void;
  slots: CalendarSlotsValue;
  state: RekaCalendarState;
}

export interface CalendarYearPickerTriggerContextValue {
  isOpen: ComputedRef<boolean>;
  monthYear: ComputedRef<string>;
  toggle: () => void;
}

export interface CalendarYearItem {
  id: number;
  date: DateValue;
  year: number;
  formatted: string;
}

export interface CalendarYearPickerGridContextValue {
  activeYear: Ref<number>;
  currentYear: number;
  focusedYear: ComputedRef<number>;
  isOpen: ComputedRef<boolean>;
  items: ComputedRef<CalendarYearItem[]>;
  selectYear: (year: number) => void;
  setActiveYear: (year: number) => void;
}
