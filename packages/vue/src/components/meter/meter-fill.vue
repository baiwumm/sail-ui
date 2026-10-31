<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {meterContextKey} from "./context";
import type {MeterFillProps} from "./types";

defineOptions({name: "SailMeterFill", inheritAttrs: false});

withDefaults(defineProps<MeterFillProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const context = inject(meterContextKey, null);
const classes = computed(() => {
  // Destructured because the linter mistakes the tv slot `fill()` for Array#fill.
  const fill = context?.slots.value.fill;

  return cx(fill?.(), className.value);
});
const style = computed(() => ({width: `${context?.percentage.value ?? 0}%`}));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'meter-fill'"
    :style="style"
  />
</template>
