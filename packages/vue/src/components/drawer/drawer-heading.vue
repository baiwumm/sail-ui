<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {DialogTitle} from "reka-ui";
import {computed, useAttrs} from "vue";

import {useDrawerContext} from "./context";

defineOptions({name: "SailDrawerHeading", inheritAttrs: false});

const attrs = useAttrs();
const {slots} = useDrawerContext();

const classes = computed(() => cx(slots.value.heading(), attrs.class as string | undefined));
</script>

<template>
  <DialogTitle v-bind="$attrs" :class="classes" :data-slot="'drawer-heading'">
    <slot />
  </DialogTitle>
</template>
