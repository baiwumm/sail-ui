import type {modalVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";
import {inject} from "vue";

export type ModalPlacement = "auto" | "top" | "center" | "bottom";
export type ModalSlots = ReturnType<typeof modalVariants>;

export interface ModalContext {
  isOpen: Ref<boolean>;
  isMounted: Ref<boolean>;
  isEntering: Ref<boolean>;
  isExiting: Ref<boolean>;
  contentRef: Ref<HTMLElement | null>;
  placement: ComputedRef<ModalPlacement>;
  slots: ComputedRef<ModalSlots>;
  isDismissable: Ref<boolean>;
  open: () => void;
  close: () => void;
}

export const modalContextKey: InjectionKey<ModalContext> = Symbol("sail-modal");

export function useModalContext(): ModalContext {
  const context = inject(modalContextKey);

  if (!context) {
    throw new Error("Modal parts must be used inside <ModalRoot>.");
  }

  return context;
}
