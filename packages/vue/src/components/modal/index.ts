import ModalBackdrop from "./modal-backdrop.vue";
import ModalBody from "./modal-body.vue";
import ModalCloseTrigger from "./modal-close-trigger.vue";
import ModalContainer from "./modal-container.vue";
import ModalDialog from "./modal-dialog.vue";
import ModalFooter from "./modal-footer.vue";
import ModalHeader from "./modal-header.vue";
import ModalHeading from "./modal-heading.vue";
import ModalIcon from "./modal-icon.vue";
import ModalRoot from "./modal-root.vue";
import ModalTrigger from "./modal-trigger.vue";

const Modal = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Backdrop: ModalBackdrop,
  Container: ModalContainer,
  Dialog: ModalDialog,
  Header: ModalHeader,
  Icon: ModalIcon,
  Heading: ModalHeading,
  Body: ModalBody,
  Footer: ModalFooter,
  CloseTrigger: ModalCloseTrigger
});

export {
  Modal,
  ModalRoot,
  ModalTrigger,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalIcon,
  ModalHeading,
  ModalBody,
  ModalFooter,
  ModalCloseTrigger
};

export type {
  ModalRootProps,
  ModalRootProps as ModalProps,
  ModalTriggerProps,
  ModalBackdropProps,
  ModalContainerProps,
  ModalCloseTriggerProps
} from "./types";

export {modalVariants, type ModalVariants} from "@sail-ui/styles";
