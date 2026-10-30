import RadioContent from "./radio-content.vue";
import RadioControl from "./radio-control.vue";
import RadioIndicator from "./radio-indicator.vue";
import RadioRoot from "./radio-root.vue";

const Radio = Object.assign(RadioRoot, {
  Root: RadioRoot,
  Content: RadioContent,
  Control: RadioControl,
  Indicator: RadioIndicator
});

export {Radio, RadioRoot, RadioContent, RadioControl, RadioIndicator};
export type {
  RadioRootProps,
  RadioRootProps as RadioProps,
  RadioContentProps,
  RadioControlProps,
  RadioIndicatorProps
} from "./types";
export {radioVariants, type RadioVariants} from "@sail-ui/styles";
