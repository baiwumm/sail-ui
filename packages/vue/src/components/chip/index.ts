import ChipLabel from "./chip-label.vue";
import ChipRoot from "./chip-root.vue";

const Chip = Object.assign(ChipRoot, {
  Root: ChipRoot,
  Label: ChipLabel,
});

export {Chip, ChipRoot, ChipLabel};
export type {ChipRootProps, ChipRootProps as ChipProps, ChipLabelProps} from "./types";
export {chipVariants, type ChipVariants} from "@sail-ui/styles";
