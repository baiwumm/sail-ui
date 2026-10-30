import SwitchGroupRoot from "./switch-group-root.vue";

const SwitchGroup = Object.assign(SwitchGroupRoot, {
  Root: SwitchGroupRoot,
});

export {SwitchGroup, SwitchGroupRoot};
export type {SwitchGroupRootProps, SwitchGroupRootProps as SwitchGroupProps} from "./types";
export {switchGroupVariants, type SwitchGroupVariants} from "@sail-ui/styles";
