import ButtonGroupRoot from "./button-group-root.vue";
import ButtonGroupSeparator from "./button-group-separator.vue";

const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Root: ButtonGroupRoot,
  Separator: ButtonGroupSeparator
});

export {ButtonGroup, ButtonGroupRoot, ButtonGroupSeparator};
export type {
  ButtonGroupRootProps,
  ButtonGroupRootProps as ButtonGroupProps,
  ButtonGroupSeparatorProps
} from "./types";
export {buttonGroupVariants, type ButtonGroupVariants} from "@sail-ui/styles";
