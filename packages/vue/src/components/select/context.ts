import type {SelectModelValue, SelectSelectionMode} from "./types";
import type {ListBoxItemVariants, selectVariants} from "@sail-ui/styles";
import type {AcceptableValue} from "reka-ui";
import type {ComputedRef, InjectionKey, Ref} from "vue";
import {inject} from "vue";

export type SelectSlots = ReturnType<typeof selectVariants>;
export type SelectItemVariant = ListBoxItemVariants["variant"];

export interface SelectContext {
  slots: ComputedRef<SelectSlots>;
  isOpen: Ref<boolean>;
  isMounted: Ref<boolean>;
  isEntering: Ref<boolean>;
  isExiting: Ref<boolean>;
  contentRef: Ref<HTMLElement | null>;
  placeholder: ComputedRef<string | undefined>;
  modelValue: Ref<SelectModelValue | undefined>;
  isDisabled: ComputedRef<boolean>;
  selectionMode: ComputedRef<SelectSelectionMode>;
  disabledKeys: ComputedRef<readonly AcceptableValue[]>;
  isItemDisabled: (value: AcceptableValue) => boolean;
  clear: () => void;
  registerClearButton: () => () => void;
  hasClearButton: () => boolean;
}

export interface SelectItemContext {
  isSelected: ComputedRef<boolean>;
  variant: ComputedRef<SelectItemVariant | undefined>;
}

export const selectContextKey: InjectionKey<SelectContext> = Symbol("sail-select");
export const selectItemContextKey: InjectionKey<SelectItemContext> = Symbol("sail-select-item");

export function useSelectContext(): SelectContext {
  const context = inject(selectContextKey);

  if (!context) {
    throw new Error("Select parts must be used inside <SelectRoot>.");
  }

  return context;
}

export function useSelectItemContext(): SelectItemContext {
  const context = inject(selectItemContextKey);

  if (!context) {
    throw new Error("SelectItemIndicator must be used inside <SelectItem>.");
  }

  return context;
}
