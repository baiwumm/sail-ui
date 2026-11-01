<script setup lang="ts">
import {cx, listboxVariants} from "@sail-ui/styles";
import {
  ComboboxEmpty,
  ListboxContent as ListboxContentPrimitive,
  ListboxRoot as ListboxRootPrimitive,
} from "reka-ui";
import {computed, getCurrentInstance, onMounted, provide, ref, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useComboboxBinding, type ComboBoxModelValue} from "../../shared/combobox-context";
import {listBoxContextKey} from "./context";
import type {
  ListBoxKey,
  ListBoxRootEmits,
  ListBoxRootProps,
  ListBoxSelection,
  ListBoxSelectionMode,
} from "./types";

defineOptions({name: "SailListBox", inheritAttrs: false});

const props = withDefaults(defineProps<ListBoxRootProps>(), {
  isVirtualized: false,
  selectionMode: "single",
  variant: "default",
});

const emit = defineEmits<ListBoxRootEmits>();
const model = defineModel<ListBoxSelection>();

const instance = getCurrentInstance();
const {className, forwarded} = useForwardedAttrs();
const combobox = useComboboxBinding();

const listRef = ref<HTMLElement | null>(null);
const isFocused = ref(false);

/**
 * Reka anchors the roving tabindex on the item carrying
 * `data-state="checked"`, but list-box items strip that attribute to meet the
 * upstream DOM contract — so Reka's own fallback always highlights the first
 * item. Re-anchor on the selected item ourselves after Reka settles.
 */
interface HighlightableListboxRoot {
  highlightItem: (value: unknown) => void;
}

const rekaRootRef = ref<HighlightableListboxRoot | null>(null);

const slots = computed(() => listboxVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value, className.value));

const selectionMode = computed<ListBoxSelectionMode>(() =>
  combobox ? "single" : props.selectionMode,
);
const disabledKeys = computed<ReadonlySet<ListBoxKey>>(() => new Set(props.disabledKeys ?? []));
const comparator = computed(
  () => props.by as string | ((value: unknown, currentValue: unknown) => boolean) | undefined,
);

// A controlled host binds `modelValue` even when the selection is empty, so
// presence of the prop (not its value) decides whether `defaultValue` applies.
const vnodeProps = instance?.vnode.props ?? {};
const isControlled = "modelValue" in vnodeProps || "model-value" in vnodeProps;
const internalSelected = ref<ListBoxSelection>(
  props.selectionMode === "multiple"
    ? Array.isArray(props.defaultValue)
      ? [...props.defaultValue]
      : props.defaultValue !== undefined
        ? [props.defaultValue]
        : []
    : Array.isArray(props.defaultValue)
      ? props.defaultValue[0]
      : props.defaultValue,
);

const selectedValue = computed<ListBoxSelection>(() => {
  if (combobox) {
    return combobox.modelValue.value;
  }

  return isControlled ? model.value : internalSelected.value;
});

const rekaModel = computed<ListBoxSelection>(() => {
  if (selectionMode.value !== "multiple") {
    return Array.isArray(selectedValue.value) ? selectedValue.value[0] : selectedValue.value;
  }

  return Array.isArray(selectedValue.value) ? selectedValue.value : [];
});

function isSelected(value: ListBoxKey) {
  if (selectionMode.value === "none") {
    return false;
  }

  if (combobox) {
    return combobox.isSelected(value);
  }

  const current = selectedValue.value;

  return Array.isArray(current) ? current.includes(value) : current === value;
}

function isDisabled(value: ListBoxKey) {
  return disabledKeys.value.has(value);
}

function setSelected(value: ListBoxSelection) {
  if (combobox) {
    combobox.setSelected(value as ComboBoxModelValue);
    return;
  }

  internalSelected.value = value;
  model.value = value;
  emit("selection-change", value);
}

function emitAction(value: ListBoxKey) {
  emit("action", value);
}

function handleUpdate(value: unknown) {
  if (selectionMode.value === "none") {
    return;
  }

  if (selectionMode.value === "multiple") {
    const next = Array.isArray(value)
      ? [...(value as ListBoxKey[])]
      : value === undefined
        ? []
        : [value as ListBoxKey];

    setSelected(next);
    return;
  }

  setSelected(
    Array.isArray(value) ? (value as ListBoxKey[])[0] : (value as ListBoxKey | undefined),
  );
}

function handleFocusIn() {
  isFocused.value = true;
}

function handleFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null;

  if (!next || !listRef.value?.contains(next)) {
    isFocused.value = false;
  }
}

function scheduleAnchor(selection: ListBoxSelection) {
  if (selectionMode.value === "none" || typeof window === "undefined") {
    return;
  }

  const value = Array.isArray(selection) ? selection[0] : selection;

  if (value === undefined || value === null) {
    return;
  }

  // The timeout runs after Reka's own model watcher (a microtask), so the
  // selected item wins over Reka's first-item fallback.
  window.setTimeout(() => {
    rekaRootRef.value?.highlightItem(value);
  }, 0);
}

watch(rekaModel, (value) => scheduleAnchor(value));

onMounted(() => scheduleAnchor(rekaModel.value));

provide(listBoxContextKey, {
  selectionMode,
  selectedValue,
  disabledKeys,
  isSelected,
  isDisabled,
  setSelected,
  emitAction,
});
</script>

<template>
  <ListboxRootPrimitive
    v-if="!combobox"
    ref="rekaRootRef"
    as-child
    :by="comparator"
    :model-value="rekaModel"
    :multiple="selectionMode === 'multiple'"
    @update:model-value="handleUpdate"
  >
    <ListboxContentPrimitive as-child>
      <div
        v-bind="forwarded"
        ref="listRef"
        :aria-multiselectable="selectionMode === 'multiple' ? 'true' : undefined"
        :class="classes"
        :data-focused="isFocused ? 'true' : undefined"
        :data-slot="'list-box'"
        @focusin="handleFocusIn"
        @focusout="handleFocusOut"
      >
        <slot />
      </div>
    </ListboxContentPrimitive>
  </ListboxRootPrimitive>
  <div
    v-else
    v-bind="forwarded"
    ref="listRef"
    :class="classes"
    :data-focused="isFocused ? 'true' : undefined"
    :data-slot="'list-box'"
    role="listbox"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <slot />
    <ComboboxEmpty v-if="$slots.empty" as-child>
      <slot name="empty" />
    </ComboboxEmpty>
  </div>
</template>
