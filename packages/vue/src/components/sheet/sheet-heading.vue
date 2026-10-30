<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {DialogTitle} from "reka-ui";
import {computed, useAttrs} from "vue";

import {useSheetContext} from "./context";

defineOptions({name: "SailSheetHeading", inheritAttrs: false});

const attrs = useAttrs();
const {slots} = useSheetContext();

const classes = computed(() => cx(slots.value.heading(), attrs.class as string | undefined));
</script>

<template>
  <DialogTitle v-bind="$attrs" :class="classes" :data-slot="'sheet-heading'">
    <slot />
  </DialogTitle>
</template>
