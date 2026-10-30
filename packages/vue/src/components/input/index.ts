import InputRoot from "./input.vue";

const Input = Object.assign(InputRoot, {
  Root: InputRoot,
});

export {Input, InputRoot};
export {default as TextField} from "./text-field.vue";

export type {InputProps, TextFieldProps} from "./types";

export {
  inputVariants,
  textFieldVariants,
  type InputVariants,
  type TextFieldVariants,
} from "@sail-ui/styles";
