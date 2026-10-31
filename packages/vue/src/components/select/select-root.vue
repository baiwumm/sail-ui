<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {cx, selectVariants} from "@sail-ui/styles";
import type {AcceptableValue} from "reka-ui";
import {FieldRoot, SelectRoot as SelectRootPrimitive} from "reka-ui";
import {computed, provide, useAttrs} from "vue";

import {selectContextKey, type SelectContext} from "./context";
import type {SelectModelValue, SelectRootProps, SelectSelectionMode} from "./types";
import {valuesEqual} from "./utils";

defineOptions({name: "SailSelectRoot", inheritAttrs: false});

const props = withDefaults(defineProps<SelectRootProps>(), {
  fullWidth: false,
  isDisabled: false,
  isInvalid: false,
  isRequired: false,
  selectionMode: "single",
  variant: "primary",
});

const attrs = useAttrs();
const model = defineModel<SelectModelValue>();
// An explicit undefined default keeps Vue from casting an absent Boolean prop
// to false, so `defaultOpen` can still initialize the overlay.
const openModel = defineModel<boolean>("open", {default: undefined as unknown as boolean});

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  },
});

const slots = computed(() => selectVariants({fullWidth: props.fullWidth, variant: props.variant}));
const isDisabled = computed(() => props.isDisabled);
const selectionMode = computed<SelectSelectionMode>(() => props.selectionMode);
const isMultiple = computed(() => selectionMode.value === "multiple");
const disabledKeys = computed<readonly AcceptableValue[]>(() => [...(props.disabledKeys ?? [])]);

function isItemDisabled(value: AcceptableValue) {
  return disabledKeys.value.some((key) => valuesEqual(key, value, props.by));
}

let clearButtonCount = 0;

function registerClearButton() {
  clearButtonCount += 1;

  return () => {
    clearButtonCount -= 1;
  };
}

function hasClearButton() {
  return clearButtonCount > 0;
}

function clear() {
  model.value = isMultiple.value ? [] : undefined;
  props.onClear?.();
}

provide<SelectContext>(selectContextKey, {
  ...overlay,
  clear,
  disabledKeys,
  hasClearButton,
  isDisabled,
  isItemDisabled,
  modelValue: model,
  placeholder: computed(() => props.placeholder),
  registerClearButton,
  selectionMode,
  slots,
});

const classes = computed(() => cx(slots.value.base(), attrs.class as string | undefined));

function handleOpenChange(isOpen: boolean) {
  if (isOpen) {
    overlay.open();
  } else {
    overlay.close();
  }
}

defineExpose({
  open: overlay.open,
  close: overlay.close,
  isOpen: overlay.isOpen,
});
</script>

<template>
  <FieldRoot
    v-bind="$attrs"
    :aria-invalid="isInvalid || undefined"
    :class="classes"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'select'"
    :disabled="isDisabled"
    :invalid="isInvalid"
    :name="name"
    :required="isRequired"
  >
    <SelectRootPrimitive
      v-model="model"
      :autocomplete="autoComplete"
      :by="by"
      :default-value="defaultValue"
      :disabled="isDisabled"
      :multiple="isMultiple"
      :open="overlay.isMounted.value"
      @update:open="handleOpenChange"
    >
      <slot />
    </SelectRootPrimitive>
  </FieldRoot>
</template>
