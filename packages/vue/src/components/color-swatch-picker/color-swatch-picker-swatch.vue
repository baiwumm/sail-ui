<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {ColorSwatch as ColorSwatchPrimitive, colorToString} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {toColor} from "../../shared/color-context";
import {colorSwatchPickerContextKey, useColorSwatchPickerItemContext} from "./context";

defineOptions({name: "SailColorSwatchPickerSwatch", inheritAttrs: false});

const root = inject(colorSwatchPickerContextKey)!;
const item = useColorSwatchPickerItemContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.value.swatch(), className.value));
const color = computed(() => item.color.value);
const swatchColor = computed(() => colorToString(toColor(color.value), "rgb"));
</script>

<template>
  <ColorSwatchPrimitive :color="color" as-child>
    <div
      v-bind="forwarded"
      :class="classes"
      :data-slot="'color-swatch-picker-swatch'"
      :style="{backgroundColor: swatchColor}"
    />
  </ColorSwatchPrimitive>
</template>
