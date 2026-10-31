<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {colorPickerVariants, cx} from "@sail-ui/styles";
import {PopoverRoot as PopoverRootPrimitive, colorToString} from "reka-ui";
import {computed, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {
  colorPickerContextKey,
  toColor,
  useColorBinding,
  type ColorValue,
} from "../../shared/color-context";
import {colorPickerRootContextKey, type ColorPickerRootContext} from "./context";
import type {ColorPickerRootEmits, ColorPickerRootProps} from "./types";

defineOptions({name: "SailColorPicker", inheritAttrs: false});

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  defaultValue: undefined,
  defaultOpen: false,
});

const emit = defineEmits<ColorPickerRootEmits>();

// An explicit undefined default keeps Vue from casting an absent Boolean prop
// to false, so `defaultOpen` can still initialize the overlay.
const openModel = defineModel<boolean>("open", {default: undefined as unknown as boolean});
const model = defineModel<ColorValue>();
const binding = useColorBinding(model, {
  defaultValue: props.defaultValue,
  fallback: "#000000",
});

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  },
});

const {className, forwarded} = useForwardedAttrs();
const slots = computed(() => colorPickerVariants());
const classes = computed(() => cx(slots.value.base(), className.value));

const color = computed(() => toColor(binding.value.value));
const triggerRef = ref<HTMLElement | null>(null);

provide<ColorPickerRootContext>(colorPickerRootContextKey, {
  slots,
  overlay,
  triggerRef,
});

provide(colorPickerContextKey, {
  color,
  setColor(next: ColorValue) {
    binding.setValue(next);

    const resolved = toColor(next);

    emit("update:color", resolved);
    emit("change", colorToString(resolved, "hex"));
  },
});

function handleOpenChange(isOpen: boolean) {
  if (isOpen) {
    overlay.open();
    return;
  }

  overlay.close();
}

defineExpose({
  open: overlay.open,
  close: overlay.close,
  isOpen: overlay.isOpen,
});
</script>

<template>
  <PopoverRootPrimitive :open="overlay.isMounted.value" @update:open="handleOpenChange">
    <div v-bind="forwarded" :class="classes" :data-slot="'color-picker'">
      <slot />
    </div>
  </PopoverRootPrimitive>
</template>
