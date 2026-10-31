import type {DateValue} from "@internationalized/date";

export type DateFieldGranularity = "day" | "hour" | "minute" | "second";
export type DateFieldHourCycle = 12 | 24;

export interface DateFieldStep {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

export interface DateFieldRootProps {
  /** The selected date when the field is controlled. */
  modelValue?: DateValue | null;
  /** The date selected when the field is uncontrolled. */
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
  /** Marks individual dates as unavailable without disabling the whole field. */
  isDateUnavailable?: (date: DateValue) => boolean;
  name?: string;
  id?: string;
  dir?: "ltr" | "rtl";
  /** @default false */
  fullWidth?: boolean;
}

export interface DateFieldRootEmits {
  change: [value: DateValue | null];
}
