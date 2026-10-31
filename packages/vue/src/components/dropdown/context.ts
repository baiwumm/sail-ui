import type {UseOverlayStateReturn} from "@sail-ui/primitives";
import type {dropdownVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";

import {inject} from "vue";

export interface DropdownContext {
  overlay: UseOverlayStateReturn;
  menuId: string;
  triggerId: Ref<string>;
  slots: ComputedRef<ReturnType<typeof dropdownVariants>>;
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol("sail-dropdown");

export function useDropdownContext(): DropdownContext {
  const context = inject(dropdownContextKey, null);

  if (!context) {
    throw new Error("Dropdown parts must be used inside <DropdownRoot>.");
  }

  return context;
}
