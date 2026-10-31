import type {UseOverlayStateReturn} from "@sail-ui/primitives";
import type {comboBoxVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";
import {inject} from "vue";

import type {ComboboxBinding} from "../../shared/combobox-context";

export interface ComboBoxContext {
  overlay: UseOverlayStateReturn;
  binding: ComboboxBinding;
  slots: ComputedRef<ReturnType<typeof comboBoxVariants>>;
  /** Input group element used as the popover anchor. */
  anchorRef: Ref<HTMLElement | null>;
  isDisabled: ComputedRef<boolean>;
}

export const comboBoxContextKey: InjectionKey<ComboBoxContext> = Symbol("sail-combo-box");

export function useComboBoxContext(): ComboBoxContext {
  const context = inject(comboBoxContextKey, null);

  if (!context) {
    throw new Error("ComboBox parts must be used inside <ComboBox>.");
  }

  return context;
}
