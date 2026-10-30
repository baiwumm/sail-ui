<script setup lang="ts">
import {cx, sliderVariants} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {sliderContextKey, type SliderOutputProps} from "./types";

defineOptions({name: "SailSliderOutput", inheritAttrs: false});

defineProps<SliderOutputProps>();

const context = inject(sliderContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(sliderVariants().output(), className.value));

const label = computed(() =>
  context.values.value.map((value) => context.format(value)).join(" – ")
);
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-orientation="context.orientation.value"
    :data-slot="'slider-output'"
  >
    <slot :label="label">
      {{ label }}
    </slot>
  </div>
</template>
