import RadioGroupRoot from "./radio-group-root.vue";

const RadioGroup = Object.assign(RadioGroupRoot, {
  Root: RadioGroupRoot
});

export {RadioGroup, RadioGroupRoot};
export type {
  RadioGroupRootProps,
  RadioGroupRootProps as RadioGroupProps
} from "./types";
export {radioGroupVariants, type RadioGroupVariants} from "@sail-ui/styles";
