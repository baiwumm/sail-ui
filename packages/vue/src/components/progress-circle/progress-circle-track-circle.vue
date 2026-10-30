<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {CENTER, RADIUS, STROKE_WIDTH, progressCircleContextKey} from "./context";
import type {ProgressCircleTrackCircleProps} from "./types";

defineOptions({name: "SailProgressCircleTrackCircle", inheritAttrs: false});

withDefaults(defineProps<ProgressCircleTrackCircleProps>(), {
  as: "circle",
});

const attrs = useAttrs();
const context = inject(progressCircleContextKey, null);
const classes = computed(() =>
  cx(context?.slots.value.trackCircle(), attrs.class as string | undefined),
);
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :cx="CENTER"
    :cy="CENTER"
    :data-slot="'progress-circle-track-circle'"
    :r="RADIUS"
    :stroke-width="STROKE_WIDTH"
  />
</template>
