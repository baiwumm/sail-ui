import ToggleButtonGroupRoot from "./toggle-button-group-root.vue";
import ToggleButtonGroupSeparator from "./toggle-button-group-separator.vue";

const ToggleButtonGroup = Object.assign(ToggleButtonGroupRoot, {
  Root: ToggleButtonGroupRoot,
  Separator: ToggleButtonGroupSeparator,
});

export {ToggleButtonGroup, ToggleButtonGroupRoot, ToggleButtonGroupSeparator};
export type {
  ToggleButtonGroupRootProps,
  ToggleButtonGroupRootProps as ToggleButtonGroupProps,
  ToggleButtonGroupSeparatorProps,
} from "./types";
export {toggleButtonGroupVariants, type ToggleButtonGroupVariants} from "@sail-ui/styles";
