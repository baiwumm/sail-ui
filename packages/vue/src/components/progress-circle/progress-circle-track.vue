<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {CENTER, progressCircleContextKey} from "./context";
import type {ProgressCircleTrackProps} from "./types";

defineOptions({name: "SailProgressCircleTrack", inheritAttrs: false});

withDefaults(defineProps<ProgressCircleTrackProps>(), {
  as: "svg",
});

const attrs = useAttrs();
const context = inject(progressCircleContextKey, null);
const classes = computed(() => cx(context?.slots.value.track(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'progress-circle-track'"
    fill="none"
    :viewBox="`0 0 ${CENTER * 2} ${CENTER * 2}`"
  >
    <slot />
  </Primitive>
</template>
