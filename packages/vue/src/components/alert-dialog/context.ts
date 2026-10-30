import type {alertDialogVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";
import {inject} from "vue";

export type AlertDialogPlacement = "auto" | "top" | "center" | "bottom";
export type AlertDialogStatus = "default" | "accent" | "success" | "warning" | "danger";
export type AlertDialogSlots = ReturnType<typeof alertDialogVariants>;

export interface AlertDialogContext {
  isOpen: Ref<boolean>;
  isMounted: Ref<boolean>;
  isEntering: Ref<boolean>;
  isExiting: Ref<boolean>;
  contentRef: Ref<HTMLElement | null>;
  triggerRef: Ref<HTMLElement | null>;
  contentId: string;
  placement: ComputedRef<AlertDialogPlacement>;
  slots: ComputedRef<AlertDialogSlots>;
  isDismissable: Ref<boolean>;
  isKeyboardDismissDisabled: Ref<boolean>;
  isTriggerDisabled: Ref<boolean>;
  open: () => void;
  close: () => void;
}

export const alertDialogContextKey: InjectionKey<AlertDialogContext> = Symbol("sail-alert-dialog");

export function useAlertDialogContext(): AlertDialogContext {
  const context = inject(alertDialogContextKey);

  if (!context) {
    throw new Error("AlertDialog parts must be used inside <AlertDialogRoot>.");
  }

  return context;
}
