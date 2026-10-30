<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import {useDrawerContext} from "./context";

defineOptions({name: "SailDrawerHeader", inheritAttrs: false});

const attrs = useAttrs();
const {slots} = useDrawerContext();

const classes = computed(() => cx(slots.value.header(), attrs.class as string | undefined));
</script>

<template>
  <div v-bind="$attrs" :class="classes" :data-slot="'drawer-header'">
    <slot />
  </div>
</template>
