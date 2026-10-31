<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {meterContextKey} from "./context";
import type {MeterTrackProps} from "./types";

defineOptions({name: "SailMeterTrack", inheritAttrs: false});

withDefaults(defineProps<MeterTrackProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const context = inject(meterContextKey, null);
const classes = computed(() => cx(context?.slots.value.track(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'meter-track'"
  >
    <slot />
  </Primitive>
</template>
