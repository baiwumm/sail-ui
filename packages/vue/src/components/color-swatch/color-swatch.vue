<script setup lang="ts">
import {colorSwatchVariants, cx} from "@sail-ui/styles";
import {ColorSwatch as ColorSwatchPrimitive, colorToString} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {colorPickerContextKey, toColor, type ColorValue} from "../../shared/color-context";
import type {ColorSwatchProps} from "./types";

defineOptions({name: "SailColorSwatch", inheritAttrs: false});

const props = defineProps<ColorSwatchProps>();

const picker = inject(colorPickerContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const color = computed<ColorValue>(() => props.color ?? picker?.color.value ?? "");
const swatchColor = computed(() =>
  color.value === "" ? "transparent" : colorToString(toColor(color.value), "rgb"),
);
const classes = computed(() =>
  cx(colorSwatchVariants({shape: props.shape, size: props.size}), className.value),
);
</script>

<template>
  <ColorSwatchPrimitive :color="color === '' ? undefined : color" :label="label" as-child>
    <div
      v-bind="forwarded"
      :class="classes"
      :data-slot="'color-swatch'"
      :style="{'--color-swatch-current': swatchColor}"
    >
      <slot />
    </div>
  </ColorSwatchPrimitive>
</template>
