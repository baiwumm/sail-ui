import type {sheetVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";
import {inject} from "vue";

export type SheetPlacement = "top" | "bottom" | "left" | "right";
export type SheetSlots = ReturnType<typeof sheetVariants>;

export interface SheetContext {
  isOpen: Ref<boolean>;
  isMounted: Ref<boolean>;
  isEntering: Ref<boolean>;
  isExiting: Ref<boolean>;
  contentRef: Ref<HTMLElement | null>;
  triggerRef: Ref<HTMLElement | null>;
  dialogRef: Ref<HTMLElement | null>;
  contentId: string;
  placement: ComputedRef<SheetPlacement>;
  slots: ComputedRef<SheetSlots>;
  isDismissable: Ref<boolean>;
  isKeyboardDismissDisabled: Ref<boolean>;
  isTriggerDisabled: Ref<boolean>;
  open: () => void;
  close: () => void;
}

export const sheetContextKey: InjectionKey<SheetContext> = Symbol("sail-sheet");

export function useSheetContext(): SheetContext {
  const context = inject(sheetContextKey);

  if (!context) {
    throw new Error("Sheet parts must be used inside <SheetRoot>.");
  }

  return context;
}
