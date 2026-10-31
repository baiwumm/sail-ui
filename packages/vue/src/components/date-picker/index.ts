import DatePickerRoot from "./date-picker-root.vue";
import DatePickerPopover from "./date-picker-popover.vue";
import DatePickerTrigger from "./date-picker-trigger.vue";
import DatePickerTriggerIndicator from "./date-picker-trigger-indicator.vue";

const DatePicker = Object.assign(DatePickerRoot, {
  Root: DatePickerRoot,
  Trigger: DatePickerTrigger,
  TriggerIndicator: DatePickerTriggerIndicator,
  Popover: DatePickerPopover,
});

export {
  DatePicker,
  DatePickerRoot,
  DatePickerPopover,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
};

export type {
  DatePickerRootProps,
  DatePickerRootProps as DatePickerProps,
  DatePickerRootEmits,
  DatePickerRootEmits as DatePickerEmits,
  DatePickerPopoverProps,
  DatePickerTriggerProps,
  DatePickerTriggerIndicatorProps,
} from "./types";

export {datePickerVariants, type DatePickerVariants} from "@sail-ui/styles";
