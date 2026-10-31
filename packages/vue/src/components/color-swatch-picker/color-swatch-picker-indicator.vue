<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {convertToRgb} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {toColor} from "../../shared/color-context";
import {colorSwatchPickerContextKey, useColorSwatchPickerItemContext} from "./context";

defineOptions({name: "SailColorSwatchPickerIndicator", inheritAttrs: false});

const root = inject(colorSwatchPickerContextKey)!;
const item = useColorSwatchPickerItemContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.value.indicator(), className.value));
const isLightColor = computed(() => {
  const rgb = convertToRgb(toColor(item.color.value));

  return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255 > 0.5;
});
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-light-color="isLightColor ? 'true' : undefined"
    :data-slot="'color-swatch-picker-indicator'"
  >
    <slot>
      <svg
        aria-hidden="true"
        data-slot="color-swatch-picker-checkmark"
        fill="none"
        role="presentation"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-width="1.5"
        viewBox="0 0 12 12"
      >
        <polyline points="2.5 6 5 8.5 9.5 3" />
      </svg>
    </slot>
  </span>
</template>
