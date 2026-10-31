import ComboBoxInputGroup from "./combo-box-input-group.vue";
import ComboBoxPopover from "./combo-box-popover.vue";
import ComboBoxRoot from "./combo-box-root.vue";
import ComboBoxTrigger from "./combo-box-trigger.vue";
import ComboBoxValue from "./combo-box-value.vue";

const ComboBox = Object.assign(ComboBoxRoot, {
  Root: ComboBoxRoot,
  InputGroup: ComboBoxInputGroup,
  Trigger: ComboBoxTrigger,
  Value: ComboBoxValue,
  Popover: ComboBoxPopover,
});

export {
  ComboBox,
  ComboBoxRoot,
  ComboBoxInputGroup,
  ComboBoxTrigger,
  ComboBoxValue,
  ComboBoxPopover,
};

export type {
  ComboBoxRootProps,
  ComboBoxRootProps as ComboBoxProps,
  ComboBoxRootEmits,
  ComboBoxRootEmits as ComboBoxEmits,
  ComboBoxInputGroupProps,
  ComboBoxTriggerProps,
  ComboBoxValueProps,
  ComboBoxPopoverProps,
  ComboBoxMenuTrigger,
} from "./types";

export {comboBoxVariants, type ComboBoxVariants} from "@sail-ui/styles";
