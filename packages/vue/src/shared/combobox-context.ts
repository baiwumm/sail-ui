import type {ComputedRef, InjectionKey, Ref, WritableComputedRef} from "vue";

import {computed, inject, ref, watch} from "vue";

export type ComboBoxKey = string | number;

export type ComboBoxModelValue = ComboBoxKey | undefined;

/**
 * Bridge between the public ComboBox/Autocomplete parts and the parts that
 * predate them (`Input`, `ListBox`, `ListBoxItem`, `SearchField`).
 *
 * Reka stores the selected key and the filter query in contexts that only
 * exist below `ComboboxRoot`. The Sail parts are generic, so they read this
 * binding instead of depending on Reka directly.
 */
export interface ComboboxBinding {
  /** Selected key, readable and writable from item/clear-button handlers. */
  modelValue: WritableComputedRef<ComboBoxModelValue>;
  /** Text shown in the ComboBox input. */
  inputValue: WritableComputedRef<string>;
  isDisabled: ComputedRef<boolean>;
  isMultiple: ComputedRef<boolean>;
  isOpen: Ref<boolean>;
  allowsCustomValue: ComputedRef<boolean>;
  isSelected: (value: ComboBoxKey) => boolean;
  setSelected: (value: ComboBoxModelValue) => void;
  /** Registered item label, falling back to the root `displayValue` hook. */
  labelFor: (value: unknown) => string | undefined;
  /** Value Reka writes into the input when a selection is applied. */
  displayValue: (value: unknown) => string;
  registerLabel: (value: ComboBoxKey, label: string | undefined) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

export interface UseComboboxBindingOptions {
  modelValue: WritableComputedRef<ComboBoxModelValue>;
  inputValue: WritableComputedRef<string>;
  isDisabled: ComputedRef<boolean>;
  isOpen: Ref<boolean>;
  allowsCustomValue: ComputedRef<boolean>;
  displayValue?: (value: ComboBoxKey) => string | undefined;
  onSelectionChange?: (value: ComboBoxModelValue) => void;
  onClear?: () => void;
  open: () => void;
  close: () => void;
}

export interface UseComboboxBindingReturn {
  binding: ComboboxBinding;
  labels: Ref<Map<ComboBoxKey, string>>;
}

export function createComboboxBinding(
  options: UseComboboxBindingOptions,
): UseComboboxBindingReturn {
  // Items unmount when the popover closes, but the input and Value still need
  // their text, so labels are upserted and never removed.
  const labels = ref(new Map<ComboBoxKey, string>()) as Ref<Map<ComboBoxKey, string>>;

  function labelFor(value: unknown): string | undefined {
    if (typeof value !== "string" && typeof value !== "number") {
      return undefined;
    }

    return labels.value.get(value) ?? options.displayValue?.(value);
  }

  function isSelected(value: ComboBoxKey) {
    return options.modelValue.value === value;
  }

  function setSelected(value: ComboBoxModelValue) {
    if (options.modelValue.value === value) {
      return;
    }

    options.modelValue.value = value;
    options.onSelectionChange?.(value);
  }

  function registerLabel(value: ComboBoxKey, label: string | undefined) {
    const next = label?.trim();

    if (!next || labels.value.get(value) === next) {
      return;
    }

    labels.value.set(value, next);

    if (options.modelValue.value === value && !options.inputValue.value) {
      options.inputValue.value = next;
    }
  }

  function displayValue(value: unknown) {
    const label = labelFor(value);

    if (label !== undefined) {
      return label;
    }

    return typeof value === "string" ? value : "";
  }

  function clear() {
    setSelected(undefined);
    options.onClear?.();
  }

  watch(options.modelValue, (value, previous) => {
    if (value === previous) {
      return;
    }

    const label = labelFor(value);

    if (label !== undefined) {
      options.inputValue.value = label;
      return;
    }

    // A custom selection is the typed text; anything else (an unknown key
    // controlled from outside) clears the text rather than showing the key.
    if (options.allowsCustomValue.value && typeof value === "string") {
      options.inputValue.value = value;
      return;
    }

    options.inputValue.value = "";
  });

  const binding: ComboboxBinding = {
    allowsCustomValue: options.allowsCustomValue,
    clear,
    close: options.close,
    displayValue,
    inputValue: options.inputValue,
    isDisabled: options.isDisabled,
    isMultiple: computed(() => false),
    isOpen: options.isOpen,
    isSelected,
    labelFor,
    modelValue: options.modelValue,
    open: options.open,
    registerLabel,
    setSelected,
  };

  return {binding, labels};
}

export const comboboxContextKey: InjectionKey<ComboboxBinding> = Symbol("sail-combobox");

export function useComboboxBinding(): ComboboxBinding | null {
  return inject(comboboxContextKey, null);
}
