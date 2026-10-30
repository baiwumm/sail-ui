<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {progressBarContextKey} from "./context";
import type {ProgressBarFillProps} from "./types";

defineOptions({name: "SailProgressBarFill", inheritAttrs: false});

withDefaults(defineProps<ProgressBarFillProps>(), {
  as: "div",
});

const attrs = useAttrs();
const context = inject(progressBarContextKey, null);
const classes = computed(() => {
  // Destructured because the linter mistakes the tv slot `fill()` for Array#fill.
  const fill = context?.slots.value.fill;

  return cx(fill?.(), attrs.class as string | undefined);
});
const style = computed(() =>
  context?.isIndeterminate.value ? undefined : {width: `${context?.percentage.value ?? 0}%`},
);
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'progress-bar-fill'"
    :style="style"
  />
</template>
