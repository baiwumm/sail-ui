<script setup lang="ts">
import {cx, sliderVariants} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {sliderContextKey, type SliderTrackProps} from "./types";

defineOptions({name: "SailSliderTrack", inheritAttrs: false});

defineProps<SliderTrackProps>();

const context = inject(sliderContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const percents = computed(() =>
  context.values.value.map((value) => context.percentOf(value))
);

const sorted = computed(() => [...percents.value].sort((a, b) => a - b));

const startOffset = computed(() =>
  context.values.value.length > 1 ? sorted.value[0]! : 0
);

const endOffset = computed(() => sorted.value[sorted.value.length - 1] ?? 0);

const fillWidth = computed(() => (endOffset.value - startOffset.value) * 100);

const classes = computed(() => cx(sliderVariants().track(), className.value));

const isSingle = computed(() => context.values.value.length <= 1);

const fillStart = computed(() =>
  isSingle.value ? fillWidth.value > 0 : startOffset.value === 0
);

const fillEnd = computed(() =>
  isSingle.value
    ? fillWidth.value === 100
    : startOffset.value * 100 + fillWidth.value === 100
);
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-disabled="context.isDisabled.value ? 'true' : undefined"
    :data-fill-end="fillEnd ? 'true' : undefined"
    :data-fill-start="fillStart ? 'true' : undefined"
    :data-orientation="context.orientation.value"
    :data-slot="'slider-track'"
  >
    <slot />
  </div>
</template>
