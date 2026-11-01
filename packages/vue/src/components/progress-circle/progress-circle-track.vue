<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {CENTER, progressCircleContextKey} from "./context";
import type {ProgressCircleTrackProps} from "./types";

defineOptions({name: "SailProgressCircleTrack", inheritAttrs: false});

withDefaults(defineProps<ProgressCircleTrackProps>(), {
  as: "svg",
});

const {className, forwarded} = useForwardedAttrs();
const context = inject(progressCircleContextKey, null);
const classes = computed(() => cx(context?.slots.value.track(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
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
