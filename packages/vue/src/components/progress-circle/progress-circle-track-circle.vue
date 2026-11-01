<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {CENTER, RADIUS, STROKE_WIDTH, progressCircleContextKey} from "./context";
import type {ProgressCircleTrackCircleProps} from "./types";

defineOptions({name: "SailProgressCircleTrackCircle", inheritAttrs: false});

withDefaults(defineProps<ProgressCircleTrackCircleProps>(), {
  as: "circle",
});

const {className, forwarded} = useForwardedAttrs();
const context = inject(progressCircleContextKey, null);
const classes = computed(() => cx(context?.slots.value.trackCircle(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
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
