<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import {useSheetContext} from "./context";

defineOptions({name: "SailSheetHeader", inheritAttrs: false});

const attrs = useAttrs();
const {slots} = useSheetContext();

const classes = computed(() => cx(slots.value.header(), attrs.class as string | undefined));
</script>

<template>
  <div v-bind="$attrs" :class="classes" :data-slot="'sheet-header'">
    <slot />
  </div>
</template>
