import type {DateValue} from "@internationalized/date";

import type {
  CalendarFirstDayOfWeek,
  CalendarPageBehavior,
  CalendarVisibleDuration,
} from "../calendar/types";
import type {DateFieldGranularity, DateFieldHourCycle, DateFieldStep} from "../date-field/types";
import type {PopoverSide} from "../popover/context";

export interface DatePickerRootProps {
  /** The selected date when the picker is controlled. */
  modelValue?: DateValue | null;
  /** The date selected when the picker is uncontrolled. */
  defaultValue?: DateValue;
  /** The date the empty segments fall back to. */
  placeholderValue?: DateValue;
  minValue?: DateValue;
  maxValue?: DateValue;
  /** @default inferred from the value, or "day" */
  granularity?: DateFieldGranularity;
  hourCycle?: DateFieldHourCycle;
  hideTimeZone?: boolean;
  step?: DateFieldStep;
  /** @default false */
  stepSnapping?: boolean;
  /** @default "en" */
  locale?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  /** Marks individual dates as unavailable without disabling the whole picker. */
  isDateUnavailable?: (date: DateValue) => boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  firstDayOfWeek?: CalendarFirstDayOfWeek;
  /** @default "visible" */
  pageBehavior?: CalendarPageBehavior;
  /** @default {months: 1} */
  visibleDuration?: CalendarVisibleDuration;
  /** Closes the popover as soon as a date is selected. @default true */
  closeOnSelect?: boolean;
  name?: string;
  id?: string;
  dir?: "ltr" | "rtl";
  open?: boolean;
  defaultOpen?: boolean;
}

export interface DatePickerRootEmits {
  change: [value: DateValue | null];
}

export interface DatePickerTriggerProps {
  isDisabled?: boolean;
}

export interface DatePickerTriggerIndicatorProps {}

export interface DatePickerPopoverProps {
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
