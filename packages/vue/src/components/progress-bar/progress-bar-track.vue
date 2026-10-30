<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {progressBarContextKey} from "./context";
import type {ProgressBarTrackProps} from "./types";

defineOptions({name: "SailProgressBarTrack", inheritAttrs: false});

withDefaults(defineProps<ProgressBarTrackProps>(), {
  as: "div"
});

const attrs = useAttrs();
const context = inject(progressBarContextKey, null);
const classes = computed(() =>
  cx(context?.slots.value.track(), attrs.class as string | undefined)
);
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'progress-bar-track'"
  >
    <slot />
  </Primitive>
</template>
