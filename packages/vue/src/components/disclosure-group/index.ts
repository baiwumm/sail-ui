import DisclosureGroupRoot from "./disclosure-group.vue";

const DisclosureGroup = Object.assign(DisclosureGroupRoot, {
  Root: DisclosureGroupRoot,
});

export {DisclosureGroup, DisclosureGroupRoot};
export type {
  DisclosureGroupRootProps,
  DisclosureGroupRootProps as DisclosureGroupProps,
} from "./types";
export {disclosureGroupVariants, type DisclosureGroupVariants} from "@sail-ui/styles";
