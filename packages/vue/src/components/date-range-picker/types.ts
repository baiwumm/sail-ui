import type {DateValue} from "@internationalized/date";

import type {
  CalendarFirstDayOfWeek,
  CalendarPageBehavior,
  CalendarVisibleDuration,
} from "../calendar/types";
import type {DateFieldGranularity, DateFieldHourCycle, DateFieldStep} from "../date-field/types";
import type {PopoverSide} from "../popover/context";

export interface DateRangePickerValue {
  start?: DateValue;
  end?: DateValue;
}

export interface DateRangePickerRootProps {
  /** The selected range when the picker is controlled. */
  modelValue?: DateRangePickerValue | null;
  /** The range selected when the picker is uncontrolled. */
  defaultValue?: DateRangePickerValue;
  /** The date the empty segments fall back to. */
  placeholderValue?: DateValue;
  /** Name of the hidden input that submits the start date. */
  startName?: string;
  /** Name of the hidden input that submits the end date. */
  endName?: string;
  minValue?: DateValue;
  maxValue?: DateValue;
  /** @default inferred from the value, or "day" */
  granularity?: DateFieldGranularity;
  hourCycle?: DateFieldHourCycle;
  hideTimeZone?: boolean;
  step?: DateFieldStep;
  /** @default "en" */
  locale?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  /** Marks individual dates as unavailable without disabling the whole picker. */
  isDateUnavailable?: (date: DateValue) => boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  /** Marks dates that can receive a highlighted range preview. */
  isDateHighlightable?: (date: DateValue) => boolean;
  /** Allows ranges that contain unavailable dates. */
  allowNonContiguousRanges?: boolean;
  /** Fixes one side of the range while the user picks the other. */
  fixedDate?: "start" | "end";
  /** Limits the number of days a range may span. */
  maximumDays?: number;
  firstDayOfWeek?: CalendarFirstDayOfWeek;
  /** @default "visible" */
  pageBehavior?: CalendarPageBehavior;
  /** @default {months: 1} */
  visibleDuration?: CalendarVisibleDuration;
  /** Closes the popover as soon as a range is selected. @default true */
  closeOnSelect?: boolean;
  name?: string;
  id?: string;
  dir?: "ltr" | "rtl";
  open?: boolean;
  defaultOpen?: boolean;
}

export interface DateRangePickerRootEmits {
  change: [value: DateRangePickerValue | null];
}

export interface DateRangePickerTriggerProps {
  isDisabled?: boolean;
}

export interface DateRangePickerTriggerIndicatorProps {}

export interface DateRangePickerRangeSeparatorProps {}

export interface DateRangePickerPopoverProps {
  /** @default "bottom" */
  placement?: PopoverSide;
  /** @default "center" */
  align?: "start" | "center" | "end";
  /** @default 0 */
  alignOffset?: number;
  /** @default 8 */
  sideOffset?: number;
  /** @default true */
  avoidCollisions?: boolean;
}
