import DescriptionRoot from "./description.vue";

const Description = Object.assign(DescriptionRoot, {
  Root: DescriptionRoot
});

export {Description, DescriptionRoot};
export type {DescriptionProps, DescriptionProps as DescriptionRootProps} from "./types";
export {descriptionVariants, type DescriptionVariants} from "@sail-ui/styles";
