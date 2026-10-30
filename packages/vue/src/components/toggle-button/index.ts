import ToggleButtonRoot from "./toggle-button-root.vue";

const ToggleButton = Object.assign(ToggleButtonRoot, {
  Root: ToggleButtonRoot,
});

export {ToggleButton, ToggleButtonRoot};
export type {ToggleButtonRootProps, ToggleButtonRootProps as ToggleButtonProps} from "./types";
export {toggleButtonVariants, type ToggleButtonVariants} from "@sail-ui/styles";
