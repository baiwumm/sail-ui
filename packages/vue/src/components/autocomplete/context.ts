import type {UseOverlayStateReturn} from "@sail-ui/primitives";
import type {autocompleteVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";
import {inject} from "vue";

import type {ComboboxBinding} from "../../shared/combobox-context";

export interface AutocompleteContext {
  overlay: UseOverlayStateReturn;
  binding: ComboboxBinding;
  slots: ComputedRef<ReturnType<typeof autocompleteVariants>>;
  triggerRef: Ref<HTMLElement | null>;
  isDisabled: ComputedRef<boolean>;
  isInvalid: ComputedRef<boolean>;
  placeholder: ComputedRef<string | undefined>;
  labelId: string;
  describedBy: ComputedRef<string | undefined>;
  clear: () => void;
}

export const autocompleteContextKey: InjectionKey<AutocompleteContext> =
  Symbol("sail-autocomplete");

export function useAutocompleteContext(): AutocompleteContext {
  const context = inject(autocompleteContextKey, null);

  if (!context) {
    throw new Error("Autocomplete parts must be used inside <Autocomplete>.");
  }

  return context;
}
