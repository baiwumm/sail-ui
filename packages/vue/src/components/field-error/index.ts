import FieldErrorRoot from "./field-error.vue";

const FieldError = Object.assign(FieldErrorRoot, {
  Root: FieldErrorRoot
});

export {FieldError, FieldErrorRoot};
export type {FieldErrorProps, FieldErrorProps as FieldErrorRootProps} from "./types";
export {fieldErrorVariants, type FieldErrorVariants} from "@sail-ui/styles";
