import SelectRoot from "./select-root.vue";
import SelectClearButton from "./select-clear-button.vue";
import SelectIndicator from "./select-indicator.vue";
import SelectItem from "./select-item.vue";
import SelectItemIndicator from "./select-item-indicator.vue";
import SelectListBox from "./select-list-box.vue";
import SelectPopover from "./select-popover.vue";
import SelectTrigger from "./select-trigger.vue";
import SelectValue from "./select-value.vue";

const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Indicator: SelectIndicator,
  ClearButton: SelectClearButton,
  Popover: SelectPopover,
  ListBox: SelectListBox,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
});

export {
  Select,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIndicator,
  SelectClearButton,
  SelectPopover,
  SelectListBox,
  SelectItem,
  SelectItemIndicator,
};

export type {
  SelectRootProps,
  SelectRootProps as SelectProps,
  SelectModelValue,
  SelectSelectionMode,
  SelectTriggerProps,
  SelectValueProps,
  SelectPopoverProps,
  SelectListBoxProps,
  SelectItemProps,
  SelectItemIndicatorProps,
} from "./types";

export {
  listboxItemVariants,
  listboxVariants,
  selectVariants,
  type ListBoxItemVariants,
  type ListBoxVariants,
  type SelectVariants,
} from "@sail-ui/styles";
