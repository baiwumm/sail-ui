import CloseButtonRoot from "./close-button-root.vue";

const CloseButton = Object.assign(CloseButtonRoot, {
  Root: CloseButtonRoot
});

export {CloseButton, CloseButtonRoot};
export type {CloseButtonRootProps, CloseButtonRootProps as CloseButtonProps} from "./types";
export {closeButtonVariants, type CloseButtonVariants} from "@sail-ui/styles";
