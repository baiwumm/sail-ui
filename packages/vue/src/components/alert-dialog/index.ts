import AlertDialogBackdrop from "./alert-dialog-backdrop.vue";
import AlertDialogBody from "./alert-dialog-body.vue";
import AlertDialogCloseTrigger from "./alert-dialog-close-trigger.vue";
import AlertDialogContainer from "./alert-dialog-container.vue";
import AlertDialogDialog from "./alert-dialog-dialog.vue";
import AlertDialogFooter from "./alert-dialog-footer.vue";
import AlertDialogHeader from "./alert-dialog-header.vue";
import AlertDialogHeading from "./alert-dialog-heading.vue";
import AlertDialogIcon from "./alert-dialog-icon.vue";
import AlertDialogRoot from "./alert-dialog-root.vue";
import AlertDialogTrigger from "./alert-dialog-trigger.vue";

const AlertDialog = Object.assign(AlertDialogRoot, {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Backdrop: AlertDialogBackdrop,
  Container: AlertDialogContainer,
  Dialog: AlertDialogDialog,
  Header: AlertDialogHeader,
  Icon: AlertDialogIcon,
  Heading: AlertDialogHeading,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  CloseTrigger: AlertDialogCloseTrigger,
});

export {
  AlertDialog,
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogBackdrop,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogHeading,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseTrigger,
};

export type {
  AlertDialogRootProps,
  AlertDialogRootProps as AlertDialogProps,
  AlertDialogTriggerProps,
  AlertDialogBackdropProps,
  AlertDialogContainerProps,
  AlertDialogIconProps,
  AlertDialogCloseTriggerProps,
} from "./types";

export type {AlertDialogPlacement, AlertDialogStatus} from "./context";
export {alertDialogVariants, type AlertDialogVariants} from "@sail-ui/styles";
