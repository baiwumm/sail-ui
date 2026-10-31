import type {MaybeRefOrGetter, Ref} from "vue";

import {computed, ref, toValue} from "vue";

import type {MenuKey, MenuSelection, MenuSelectionContext, MenuSelectionMode} from "./types";

export interface UseMenuSelectionOptions {
  parent?: MenuSelectionContext | null;
  selectionMode?: MaybeRefOrGetter<MenuSelectionMode | undefined>;
  defaultValue?: MaybeRefOrGetter<MenuSelection | undefined>;
  model?: Ref<MenuSelection | undefined>;
  isControlled?: boolean;
  disabledKeys?: MaybeRefOrGetter<Iterable<MenuKey> | undefined>;
  shouldCloseOnSelect?: MaybeRefOrGetter<boolean | undefined>;
  disallowEmptySelection?: MaybeRefOrGetter<boolean | undefined>;
  onSelectionChange?: (value: MenuSelection) => void;
  onAction?: (key: MenuKey) => void;
  requestClose: () => void;
}

function normalizeSelection(
  mode: MenuSelectionMode,
  value: MenuSelection | undefined,
): MenuSelection {
  if (mode !== "multiple") {
    return Array.isArray(value) ? value[0] : value;
  }

  if (Array.isArray(value)) {
    return [...value];
  }

  return value === undefined ? [] : [value];
}

/**
 * Sections can layer a selection model over the menu. A section owns state only
 * when it declares `selectionMode`, `defaultValue` or `v-model`; otherwise it
 * proxies the parent so the root menu still emits the change.
 */
export function useMenuSelection(options: UseMenuSelectionOptions): MenuSelectionContext {
  const parent = options.parent ?? null;

  const selectionMode = computed<MenuSelectionMode>(
    () => toValue(options.selectionMode) ?? parent?.selectionMode.value ?? "none",
  );

  const hasOwnState =
    parent === null ||
    toValue(options.selectionMode) !== undefined ||
    toValue(options.defaultValue) !== undefined ||
    Boolean(options.isControlled);

  const internalSelected = ref<MenuSelection>(
    normalizeSelection(selectionMode.value, toValue(options.defaultValue)),
  );

  const selectedValue = computed<MenuSelection>(() => {
    if (!hasOwnState) {
      return parent!.selectedValue.value;
    }

    return options.isControlled ? options.model?.value : internalSelected.value;
  });

  const disabledKeys = computed<ReadonlySet<MenuKey>>(() => {
    const merged = new Set<MenuKey>(parent?.disabledKeys.value ?? []);

    for (const key of toValue(options.disabledKeys) ?? []) {
      merged.add(key);
    }

    return merged;
  });

  const shouldCloseOnSelect = computed(() => {
    const explicit = toValue(options.shouldCloseOnSelect);

    if (explicit !== undefined) {
      return explicit;
    }

    if (!hasOwnState) {
      return parent!.shouldCloseOnSelect.value;
    }

    return selectionMode.value !== "multiple";
  });

  const disallowEmptySelection = computed(
    () => toValue(options.disallowEmptySelection) ?? parent?.disallowEmptySelection.value ?? false,
  );

  function isSelected(key: MenuKey) {
    if (selectionMode.value === "none") {
      return false;
    }

    const current = selectedValue.value;

    return Array.isArray(current) ? current.includes(key) : current === key;
  }

  function isDisabled(key: MenuKey) {
    return disabledKeys.value.has(key);
  }

  function setSelected(value: MenuSelection) {
    internalSelected.value = value;

    if (options.model) {
      options.model.value = value;
    }

    options.onSelectionChange?.(value);
  }

  function select(key: MenuKey) {
    if (selectionMode.value === "none" || isDisabled(key)) {
      return;
    }

    if (!hasOwnState) {
      parent!.select(key);
      return;
    }

    if (selectionMode.value !== "multiple") {
      setSelected(key);
      return;
    }

    const current = Array.isArray(selectedValue.value) ? [...selectedValue.value] : [];
    const index = current.indexOf(key);

    if (index >= 0) {
      if (disallowEmptySelection.value && current.length === 1) {
        return;
      }

      current.splice(index, 1);
    } else {
      current.push(key);
    }

    setSelected(current);
  }

  function emitAction(key: MenuKey) {
    options.onAction?.(key);
    parent?.emitAction(key);
  }

  function activate(key: MenuKey) {
    if (isDisabled(key)) {
      return;
    }

    emitAction(key);
    select(key);

    if (shouldCloseOnSelect.value) {
      options.requestClose();
    }
  }

  return {
    selectionMode,
    selectedValue,
    disabledKeys,
    shouldCloseOnSelect,
    disallowEmptySelection,
    isSelected,
    isDisabled,
    select,
    emitAction,
    activate,
  };
}
