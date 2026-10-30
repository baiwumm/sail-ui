import TooltipArrow from "./tooltip-arrow.vue";
import TooltipContent from "./tooltip-content.vue";
import TooltipRoot from "./tooltip-root.vue";
import TooltipTrigger from "./tooltip-trigger.vue";

const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
});

export {Tooltip, TooltipRoot, TooltipTrigger, TooltipContent, TooltipArrow};

export type {
  TooltipRootProps,
  TooltipRootProps as TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
} from "./types";

export type {TooltipSide, TooltipTriggerMode} from "./context";
export {tooltipVariants, type TooltipVariants} from "@sail-ui/styles";
