<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import {useDrawerContext} from "./context";

defineOptions({name: "SailDrawerHandle", inheritAttrs: false});

const attrs = useAttrs();
const {slots} = useDrawerContext();

const forwarded = computed(() => {
  const rest = {...attrs};

  delete rest.class;

  return rest;
});
const classes = computed(() => cx(slots.value.handle(), attrs.class as string | undefined));
</script>

<template>
  <div v-bind="forwarded" aria-hidden="true" :class="classes" :data-slot="'drawer-handle'">
    <div data-slot="drawer-handle-bar" />
  </div>
</template>
