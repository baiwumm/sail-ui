import LabelRoot from "./label.vue";

const Label = Object.assign(LabelRoot, {
  Root: LabelRoot
});

export {Label, LabelRoot};
export type {LabelRootProps, LabelRootProps as LabelProps} from "./types";
export {labelVariants, type LabelVariants} from "@sail-ui/styles";
