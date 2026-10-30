import PopoverArrow from "./popover-arrow.vue";
import PopoverContent from "./popover-content.vue";
import PopoverDialog from "./popover-dialog.vue";
import PopoverHeading from "./popover-heading.vue";
import PopoverRoot from "./popover-root.vue";
import PopoverTrigger from "./popover-trigger.vue";

const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Dialog: PopoverDialog,
  Heading: PopoverHeading,
  Arrow: PopoverArrow,
});

export {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverDialog,
  PopoverHeading,
  PopoverArrow,
};

export type {
  PopoverRootProps,
  PopoverRootProps as PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverDialogProps,
  PopoverHeadingProps,
} from "./types";

export type {PopoverSide} from "./context";
export {popoverVariants, type PopoverVariants} from "@sail-ui/styles";
