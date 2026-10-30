<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import type {StyleValue} from "vue";
import {computed, useAttrs} from "vue";

import {useDrawerContext} from "./context";

defineOptions({name: "SailDrawerBody", inheritAttrs: false});

const attrs = useAttrs();
const {slots} = useDrawerContext();

const forwarded = computed(() => {
  const rest = {...attrs};

  delete rest.class;
  delete rest.style;

  return rest;
});
const classes = computed(() => cx(slots.value.body(), attrs.class as string | undefined));
const bodyStyle = computed<StyleValue>(() => [{touchAction: "pan-y"}, attrs.style as StyleValue]);
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'drawer-body'" :style="bodyStyle">
    <slot />
  </div>
</template>
