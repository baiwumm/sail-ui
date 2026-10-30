import DrawerBackdrop from "./drawer-backdrop.vue";
import DrawerBody from "./drawer-body.vue";
import DrawerCloseTrigger from "./drawer-close-trigger.vue";
import DrawerContent from "./drawer-content.vue";
import DrawerDialog from "./drawer-dialog.vue";
import DrawerFooter from "./drawer-footer.vue";
import DrawerHandle from "./drawer-handle.vue";
import DrawerHeader from "./drawer-header.vue";
import DrawerHeading from "./drawer-heading.vue";
import DrawerRoot from "./drawer-root.vue";
import DrawerTrigger from "./drawer-trigger.vue";

const Drawer = Object.assign(DrawerRoot, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Backdrop: DrawerBackdrop,
  Content: DrawerContent,
  Dialog: DrawerDialog,
  Header: DrawerHeader,
  Heading: DrawerHeading,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Handle: DrawerHandle,
  CloseTrigger: DrawerCloseTrigger,
});

export {
  Drawer,
  DrawerRoot,
  DrawerTrigger,
  DrawerBackdrop,
  DrawerContent,
  DrawerDialog,
  DrawerHeader,
  DrawerHeading,
  DrawerBody,
  DrawerFooter,
  DrawerHandle,
  DrawerCloseTrigger,
};

export type {
  DrawerRootProps,
  DrawerRootProps as DrawerProps,
  DrawerTriggerProps,
  DrawerBackdropProps,
  DrawerContentProps,
  DrawerCloseTriggerProps,
} from "./types";

export type {DrawerPlacement} from "./context";
export {drawerVariants, type DrawerVariants} from "@sail-ui/styles";
