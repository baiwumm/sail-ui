import SpinnerRoot from "./spinner.vue";

const Spinner = Object.assign(SpinnerRoot, {
  Root: SpinnerRoot
});

export {Spinner, SpinnerRoot};
export type {SpinnerRootProps, SpinnerRootProps as SpinnerProps} from "./types";
export {spinnerVariants, type SpinnerVariants} from "@sail-ui/styles";
