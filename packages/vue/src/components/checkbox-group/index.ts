import CheckboxGroupRoot from "./checkbox-group-root.vue";

const CheckboxGroup = Object.assign(CheckboxGroupRoot, {
  Root: CheckboxGroupRoot
});

export {CheckboxGroup, CheckboxGroupRoot};
export type {
  CheckboxGroupRootProps,
  CheckboxGroupRootProps as CheckboxGroupProps
} from "./types";
export {
  checkboxGroupVariants,
  type CheckboxGroupVariants
} from "@sail-ui/styles";
