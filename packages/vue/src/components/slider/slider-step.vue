<script setup lang="ts">
import {cx, sliderVariants} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {SliderTrackProps} from "./types";

defineOptions({name: "SailSliderStep", inheritAttrs: false});

defineProps<SliderTrackProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(sliderVariants().step(), className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    :class="classes"
    :data-slot="'slider-step'"
  >
    <slot />
  </span>
</template>
