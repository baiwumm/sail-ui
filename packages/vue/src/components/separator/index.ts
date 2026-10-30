import SeparatorRoot from "./separator.vue";

const Separator = Object.assign(SeparatorRoot, {
  Root: SeparatorRoot
});

export {Separator, SeparatorRoot};
export type {SeparatorRootProps, SeparatorRootProps as SeparatorProps} from "./types";
export {separatorVariants, type SeparatorVariants} from "@sail-ui/styles";
