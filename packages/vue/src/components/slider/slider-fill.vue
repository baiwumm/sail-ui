<script setup lang="ts">
import {cx, sliderVariants} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {sliderContextKey, type SliderFillProps} from "./types";

defineOptions({name: "SailSliderFill", inheritAttrs: false});

defineProps<SliderFillProps>();

const context = inject(sliderContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const percents = computed(() => context.values.value.map((value) => context.percentOf(value)));

const sorted = computed(() => [...percents.value].sort((a, b) => a - b));

const startOffset = computed(() => (context.values.value.length > 1 ? sorted.value[0]! : 0));

const endOffset = computed(() => sorted.value[sorted.value.length - 1] ?? 0);

const classes = computed(() => cx(sliderVariants().fill(), className.value));

const style = computed(() => {
  const isVertical = context.orientation.value === "vertical";

  return {
    [isVertical ? "bottom" : context.isRTL.value ? "right" : "left"]: `${startOffset.value * 100}%`,
    [isVertical ? "height" : "width"]: `${(endOffset.value - startOffset.value) * 100}%`,
  };
});
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-disabled="context.isDisabled.value ? 'true' : undefined"
    :data-orientation="context.orientation.value"
    :data-slot="'slider-fill'"
    :style="style"
  />
</template>
