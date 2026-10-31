import type {TimeValue} from "reka-ui";

export type {TimeValue};

export type TimeFieldGranularity = "hour" | "minute" | "second";
export type TimeFieldHourCycle = 12 | 24;

export interface TimeFieldStep {
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

export interface TimeFieldRootProps {
  /** The selected time when the field is controlled. */
  modelValue?: TimeValue | null;
  /** The time selected when the field is uncontrolled. */
  defaultValue?: TimeValue;
  /** The time the empty segments fall back to. */
  placeholderValue?: TimeValue;
  minValue?: TimeValue;
  maxValue?: TimeValue;
  /** @default "minute" */
  granularity?: TimeFieldGranularity;
  hourCycle?: TimeFieldHourCycle;
  hideTimeZone?: boolean;
  step?: TimeFieldStep;
  /** @default false */
  stepSnapping?: boolean;
  /** @default "en" */
  locale?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  name?: string;
  id?: string;
  dir?: "ltr" | "rtl";
  /** @default false */
  fullWidth?: boolean;
}

export interface TimeFieldRootEmits {
  change: [value: TimeValue | null];
}
