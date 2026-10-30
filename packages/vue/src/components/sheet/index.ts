import SheetBackdrop from "./sheet-backdrop.vue";
import SheetBody from "./sheet-body.vue";
import SheetClose from "./sheet-close.vue";
import SheetCloseTrigger from "./sheet-close-trigger.vue";
import SheetContent from "./sheet-content.vue";
import SheetDialog from "./sheet-dialog.vue";
import SheetFooter from "./sheet-footer.vue";
import SheetHandle from "./sheet-handle.vue";
import SheetHeader from "./sheet-header.vue";
import SheetHeading from "./sheet-heading.vue";
import SheetRoot from "./sheet-root.vue";
import SheetTrigger from "./sheet-trigger.vue";

const Sheet = Object.assign(SheetRoot, {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Backdrop: SheetBackdrop,
  Content: SheetContent,
  Dialog: SheetDialog,
  Header: SheetHeader,
  Heading: SheetHeading,
  Body: SheetBody,
  Footer: SheetFooter,
  Handle: SheetHandle,
  Close: SheetClose,
  CloseTrigger: SheetCloseTrigger,
});

export {
  Sheet,
  SheetRoot,
  SheetTrigger,
  SheetBackdrop,
  SheetContent,
  SheetDialog,
  SheetHeader,
  SheetHeading,
  SheetBody,
  SheetFooter,
  SheetHandle,
  SheetClose,
  SheetCloseTrigger,
};

export type {
  SheetRootProps,
  SheetRootProps as SheetProps,
  SheetTriggerProps,
  SheetBackdropProps,
  SheetCloseProps,
  SheetCloseTriggerProps,
} from "./types";

export type {SheetPlacement} from "./context";
export {sheetVariants, type SheetVariants} from "@sail-ui/styles";
