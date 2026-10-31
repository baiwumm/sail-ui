<script setup lang="ts">
import {useFocusRing} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {ColorSwatchPickerItem as ColorSwatchPickerItemPrimitive, colorToString} from "reka-ui";
import {computed, inject, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {toColor, toHex} from "../../shared/color-context";
import {colorSwatchPickerContextKey, colorSwatchPickerItemContextKey} from "./context";
import type {ColorSwatchPickerItemProps} from "./types";

defineOptions({name: "SailColorSwatchPickerItem", inheritAttrs: false});

const props = withDefaults(defineProps<ColorSwatchPickerItemProps>(), {
  isDisabled: false,
});

const root = inject(colorSwatchPickerContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const itemRef = ref<HTMLElement | null>(null);

const classes = computed(() => cx(root.slots.value.item(), className.value));
const swatchColor = computed(() => colorToString(toColor(props.color), "rgb"));
const value = computed(() => toHex(props.color));
const isDisabled = computed(() => props.isDisabled || root.isDisabled.value);
const bindings = computed(() => ({
  ...forwarded.value,
  ...(props.textValue ? {"aria-label": props.textValue} : {}),
}));

provide(colorSwatchPickerItemContextKey, {color: computed(() => props.color)});

const {isFocused, isFocusVisible} = useFocusRing(itemRef, {isDisabled});
</script>

<template>
  <ColorSwatchPickerItemPrimitive
    v-slot="{selected}"
    as-child
    :disabled="isDisabled"
    :value="value"
  >
    <div
      v-bind="bindings"
      ref="itemRef"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-highlighted="undefined"
      :data-selected="selected ? 'true' : undefined"
      :data-slot="'color-swatch-picker-item'"
      :data-state="undefined"
      :style="{'--color-swatch-current': swatchColor}"
    >
      <slot :selected="selected" />
    </div>
  </ColorSwatchPickerItemPrimitive>
</template>
