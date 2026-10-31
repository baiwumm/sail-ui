import type {SegmentPart} from "reka-ui";
import type {InjectionKey, Ref} from "vue";

export interface DateSegmentContent {
  part: SegmentPart;
  value: string;
}

export type DateInputGroupKind = "date" | "time" | "date-range";
export type DateInputGroupSide = "start" | "end";
export type DateInputGroupRangeSegments = Record<DateInputGroupSide, DateSegmentContent[]>;

export interface DateInputGroupContext {
  kind: DateInputGroupKind;
  segments: Readonly<Ref<DateSegmentContent[]>>;
  segmentValues: Readonly<Ref<Record<string, unknown>>>;
  rangeSegments?: Readonly<Ref<DateInputGroupRangeSegments | undefined>>;
  rangeSegmentValues?: Readonly<Ref<Record<DateInputGroupSide, Record<string, unknown>>>>;
  isInvalid: Readonly<Ref<boolean>>;
  isDisabled: Readonly<Ref<boolean>>;
  isReadOnly: Readonly<Ref<boolean>>;
  describedBy: Readonly<Ref<string | undefined>>;
  labelId: Readonly<Ref<string | undefined>>;
}

export const dateInputGroupContextKey: InjectionKey<DateInputGroupContext> =
  Symbol("sail-date-input-group");

export interface DateInputGroupRootProps {
  /** @default "primary" */
  variant?: "primary" | "secondary";
  /** @default false */
  fullWidth?: boolean;
}

export interface DateInputGroupInputProps {}

export interface DateInputGroupInputContainerProps {}

export interface DateInputGroupSegmentProps {
  segment: DateSegmentContent;
  /** Which side of a range the segment belongs to. Ignored outside `date-range`. */
  side?: DateInputGroupSide;
}

export interface DateInputGroupPrefixProps {}

export interface DateInputGroupSuffixProps {}
