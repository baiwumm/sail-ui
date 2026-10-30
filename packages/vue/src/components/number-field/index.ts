import NumberFieldDecrementButton from "./number-field-decrement-button.vue";
import NumberFieldGroup from "./number-field-group.vue";
import NumberFieldIncrementButton from "./number-field-increment-button.vue";
import NumberFieldInput from "./number-field-input.vue";
import NumberFieldRoot from "./number-field-root.vue";

const NumberField = Object.assign(NumberFieldRoot, {
  Root: NumberFieldRoot,
  Group: NumberFieldGroup,
  Input: NumberFieldInput,
  IncrementButton: NumberFieldIncrementButton,
  DecrementButton: NumberFieldDecrementButton,
});

export {
  NumberField,
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrementButton,
  NumberFieldDecrementButton,
};
export type {
  NumberFieldRootProps,
  NumberFieldRootProps as NumberFieldProps,
  NumberFieldGroupProps,
  NumberFieldInputProps,
  NumberFieldButtonProps,
} from "./types";
export {numberFieldVariants, type NumberFieldVariants} from "@sail-ui/styles";
