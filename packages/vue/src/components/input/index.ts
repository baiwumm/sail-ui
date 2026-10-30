import InputRoot from "./input.vue";

const Input = Object.assign(InputRoot, {
  Root: InputRoot
});

export {Input, InputRoot};
export {default as TextField} from "./text-field.vue";
export {default as Label} from "./label.vue";
export {default as Description} from "./description.vue";
export {default as FieldError} from "./field-error.vue";

export type {InputProps, TextFieldProps} from "./types";

export {
  descriptionVariants,
  fieldErrorVariants,
  inputVariants,
  labelVariants,
  textFieldVariants,
  type DescriptionVariants,
  type FieldErrorVariants,
  type InputVariants,
  type LabelVariants,
  type TextFieldVariants
} from "@sail-ui/styles";
