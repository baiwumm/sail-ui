import type {ComputedRef, InjectionKey, Ref} from "vue";

import type {popoverVariants} from "@sail-ui/styles";

import {inject} from "vue";

export type PopoverSide = "top" | "right" | "bottom" | "left";

export interface PopoverContext {
  slots: ComputedRef<ReturnType<typeof popoverVariants>>;
  isOpen: Ref<boolean>;
  isMounted: Ref<boolean>;
  isEntering: Ref<boolean>;
  isExiting: Ref<boolean>;
  contentRef: Ref<HTMLElement | null>;
  triggerRef: Ref<HTMLElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const popoverContextKey: InjectionKey<PopoverContext> = Symbol("sail-popover");

export function usePopoverContext() {
  const context = inject(popoverContextKey);

  if (!context) {
    throw new Error("Popover parts must be used inside <PopoverRoot>.");
  }

  return context;
}
