<script setup lang="ts">
import {cx, listboxVariants} from "@sail-ui/styles";
import {
  ListboxContent as ListboxContentPrimitive,
  ListboxRoot as ListboxRootPrimitive,
} from "reka-ui";
import {computed, getCurrentInstance, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
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

const listRef = ref<HTMLElement | null>(null);
const isFocused = ref(false);

const slots = computed(() => listboxVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value, className.value));

const selectionMode = computed<ListBoxSelectionMode>(() => props.selectionMode);
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

const selectedValue = computed<ListBoxSelection>(() =>
  isControlled ? model.value : internalSelected.value,
);

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

  const current = selectedValue.value;

  return Array.isArray(current) ? current.includes(value) : current === value;
}

function isDisabled(value: ListBoxKey) {
  return disabledKeys.value.has(value);
}

function setSelected(value: ListBoxSelection) {
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
</template>
