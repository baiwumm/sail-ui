<script setup lang="ts">
import {cx, sliderVariants} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {sliderContextKey, type SliderMarksProps} from "./types";

defineOptions({name: "SailSliderMarks", inheritAttrs: false});

defineProps<SliderMarksProps>();

const context = inject(sliderContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(sliderVariants().marks(), className.value));

const direction = computed(() => (context.isRTL.value ? "rtl" : "ltr"));
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-direction="direction"
    :data-disabled="context.isDisabled.value ? 'true' : undefined"
    :data-orientation="context.orientation.value"
    :data-slot="'slider-marks'"
    :dir="direction"
  >
    <slot />
  </div>
</template>
