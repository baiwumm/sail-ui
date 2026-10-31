import DateRangePickerPopover from "./date-range-picker-popover.vue";
import DateRangePickerRangeSeparator from "./date-range-picker-range-separator.vue";
import DateRangePickerRoot from "./date-range-picker-root.vue";
import DateRangePickerTrigger from "./date-range-picker-trigger.vue";
import DateRangePickerTriggerIndicator from "./date-range-picker-trigger-indicator.vue";

const DateRangePicker = Object.assign(DateRangePickerRoot, {
  Root: DateRangePickerRoot,
  RangeSeparator: DateRangePickerRangeSeparator,
  Trigger: DateRangePickerTrigger,
  TriggerIndicator: DateRangePickerTriggerIndicator,
  Popover: DateRangePickerPopover,
});

export {
  DateRangePicker,
  DateRangePickerPopover,
  DateRangePickerRangeSeparator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
};

export type {
  DateRangePickerRootProps,
  DateRangePickerRootProps as DateRangePickerProps,
  DateRangePickerRootEmits,
  DateRangePickerRootEmits as DateRangePickerEmits,
  DateRangePickerPopoverProps,
  DateRangePickerRangeSeparatorProps,
  DateRangePickerTriggerProps,
  DateRangePickerTriggerIndicatorProps,
  DateRangePickerValue,
} from "./types";

export {dateRangePickerVariants, type DateRangePickerVariants} from "@sail-ui/styles";
