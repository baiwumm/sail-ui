<script setup lang="ts">
import {colorSwatchPickerVariants, cx} from "@sail-ui/styles";
import {
  ListboxContent as ListboxContentPrimitive,
  ListboxRoot as ListboxRootPrimitive,
} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {toHex, useColorBinding, type ColorValue} from "../../shared/color-context";
import {colorSwatchPickerContextKey} from "./context";
import type {ColorSwatchPickerRootEmits, ColorSwatchPickerRootProps} from "./types";

defineOptions({name: "SailColorSwatchPicker", inheritAttrs: false});

const props = withDefaults(defineProps<ColorSwatchPickerRootProps>(), {
  isDisabled: false,
  loop: false,
  dir: "ltr",
  layout: "grid",
  size: "md",
  variant: "circle",
});

const emit = defineEmits<ColorSwatchPickerRootEmits>();
const model = defineModel<ColorValue>();

const {className, forwarded} = useForwardedAttrs();
const binding = useColorBinding(model, {defaultValue: props.defaultValue, fallback: "#000000"});

const slots = computed(() =>
  colorSwatchPickerVariants({layout: props.layout, size: props.size, variant: props.variant}),
);
const classes = computed(() => cx(slots.value.base(), className.value));

const selected = computed(() => {
  const value = binding.value.value;

  return value === undefined ? "" : toHex(value);
});

const orientation = computed(() => (props.layout === "stack" ? "vertical" : "horizontal"));
const isDisabled = computed(() => props.isDisabled);

provide(colorSwatchPickerContextKey, {slots, isDisabled});

function handleUpdate(value: unknown) {
  const next = Array.isArray(value) ? value[0] : value;

  // Upstream keeps a selection once made; Reka emits `null` when the
  // selected item is activated again.
  if (typeof next !== "string" || next === "") {
    return;
  }

  binding.setValue(next);
  emit("change", next);
}
</script>

<template>
  <ListboxRootPrimitive
    as-child
    :dir="dir"
    :disabled="isDisabled"
    :loop="loop"
    :model-value="selected"
    :orientation="orientation"
    @update:model-value="handleUpdate"
  >
    <ListboxContentPrimitive as-child>
      <div
        v-bind="forwarded"
        :class="classes"
        :data-disabled="isDisabled ? 'true' : undefined"
        :data-slot="'color-swatch-picker'"
      >
        <slot />
      </div>
    </ListboxContentPrimitive>
  </ListboxRootPrimitive>
</template>
