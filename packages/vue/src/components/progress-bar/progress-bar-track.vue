<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {progressBarContextKey} from "./context";
import type {ProgressBarTrackProps} from "./types";

defineOptions({name: "SailProgressBarTrack", inheritAttrs: false});

withDefaults(defineProps<ProgressBarTrackProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const context = inject(progressBarContextKey, null);
const classes = computed(() => cx(context?.slots.value.track(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'progress-bar-track'"
  >
    <slot />
  </Primitive>
</template>
