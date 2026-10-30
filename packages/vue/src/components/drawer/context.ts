import type {drawerVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";
import {inject} from "vue";

export type DrawerPlacement = "top" | "bottom" | "left" | "right";
export type DrawerSlots = ReturnType<typeof drawerVariants>;

export interface DrawerContext {
  isOpen: Ref<boolean>;
  isMounted: Ref<boolean>;
  isEntering: Ref<boolean>;
  isExiting: Ref<boolean>;
  contentRef: Ref<HTMLElement | null>;
  triggerRef: Ref<HTMLElement | null>;
  contentId: string;
  placement: ComputedRef<DrawerPlacement>;
  slots: ComputedRef<DrawerSlots>;
  isDismissable: Ref<boolean>;
  isKeyboardDismissDisabled: Ref<boolean>;
  isTriggerDisabled: Ref<boolean>;
  open: () => void;
  close: () => void;
}

export const drawerContextKey: InjectionKey<DrawerContext> = Symbol("sail-drawer");

export function useDrawerContext(): DrawerContext {
  const context = inject(drawerContextKey);

  if (!context) {
    throw new Error("Drawer parts must be used inside <DrawerRoot>.");
  }

  return context;
}
