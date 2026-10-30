import CheckboxContent from "./checkbox-content.vue";
import CheckboxControl from "./checkbox-control.vue";
import CheckboxIndicator from "./checkbox-indicator.vue";
import CheckboxRoot from "./checkbox-root.vue";

const Checkbox = Object.assign(CheckboxRoot, {
  Root: CheckboxRoot,
  Content: CheckboxContent,
  Control: CheckboxControl,
  Indicator: CheckboxIndicator,
});

export {Checkbox, CheckboxRoot, CheckboxContent, CheckboxControl, CheckboxIndicator};
export type {
  CheckboxRootProps,
  CheckboxRootProps as CheckboxProps,
  CheckboxContentProps,
  CheckboxControlProps,
  CheckboxIndicatorProps,
} from "./types";
export {checkboxVariants, type CheckboxVariants} from "@sail-ui/styles";
