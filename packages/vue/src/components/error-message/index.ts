import ErrorMessageRoot from "./error-message.vue";

const ErrorMessage = Object.assign(ErrorMessageRoot, {
  Root: ErrorMessageRoot
});

export {ErrorMessage, ErrorMessageRoot};
export type {
  ErrorMessageRootProps,
  ErrorMessageRootProps as ErrorMessageProps
} from "./types";
export {errorMessageVariants, type ErrorMessageVariants} from "@sail-ui/styles";
