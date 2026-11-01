<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {CENTER, CIRCUMFERENCE, RADIUS, STROKE_WIDTH, progressCircleContextKey} from "./context";
import type {ProgressCircleFillCircleProps} from "./types";

defineOptions({name: "SailProgressCircleFillCircle", inheritAttrs: false});

withDefaults(defineProps<ProgressCircleFillCircleProps>(), {
  as: "circle",
});

const {className, forwarded} = useForwardedAttrs();
const context = inject(progressCircleContextKey, null);
const classes = computed(() => cx(context?.slots.value.fillCircle(), className.value));

const strokeDashoffset = computed(() => {
  if (context?.isIndeterminate.value) {
    return CIRCUMFERENCE * 0.75;
  }

  return CIRCUMFERENCE - ((context?.percentage.value ?? 0) / 100) * CIRCUMFERENCE;
});
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :cx="CENTER"
    :cy="CENTER"
    :data-slot="'progress-circle-fill-circle'"
    :r="RADIUS"
    :stroke-dasharray="CIRCUMFERENCE"
    :stroke-dashoffset="strokeDashoffset"
    stroke-linecap="round"
    :stroke-width="STROKE_WIDTH"
    :transform="`rotate(-90 ${CENTER} ${CENTER})`"
  />
</template>
