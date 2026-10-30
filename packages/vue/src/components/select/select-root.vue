<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {cx, selectVariants} from "@sail-ui/styles";
import type {AcceptableValue} from "reka-ui";
import {FieldRoot, SelectRoot as SelectRootPrimitive} from "reka-ui";
import {computed, provide, useAttrs} from "vue";

import {selectContextKey, type SelectContext} from "./context";
import type {SelectRootProps} from "./types";

defineOptions({name: "SailSelectRoot", inheritAttrs: false});

const props = withDefaults(defineProps<SelectRootProps>(), {
  fullWidth: false,
  isDisabled: false,
  isInvalid: false,
  isRequired: false,
  variant: "primary"
});

const attrs = useAttrs();
const model = defineModel<AcceptableValue>("modelValue");
const openModel = defineModel<boolean>("open");

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  }
});

const slots = computed(() =>
  selectVariants({fullWidth: props.fullWidth, variant: props.variant})
);
const isDisabled = computed(() => props.isDisabled);

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
  model.value = undefined;
  props.onClear?.();
}

provide<SelectContext>(selectContextKey, {
  ...overlay,
  clear,
  hasClearButton,
  isDisabled,
  modelValue: model,
  placeholder: computed(() => props.placeholder),
  registerClearButton,
  slots
});

const classes = computed(() =>
  cx(slots.value.base(), attrs.class as string | undefined)
);

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
  isOpen: overlay.isOpen
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
      :by="by"
      :default-value="defaultValue"
      :disabled="isDisabled"
      :open="overlay.isMounted.value"
      @update:open="handleOpenChange"
    >
      <slot />
    </SelectRootPrimitive>
  </FieldRoot>
</template>
