<script setup lang="ts">
import {cx, listboxVariants} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import type {SelectListBoxProps} from "./types";

defineOptions({name: "SailSelectListBox", inheritAttrs: false});

const props = defineProps<SelectListBoxProps>();
const attrs = useAttrs();

const classes = computed(() =>
  cx(listboxVariants({variant: props.variant}), attrs.class as string | undefined),
);
</script>

<template>
  <div v-bind="$attrs" :class="classes" :data-slot="'list-box'">
    <slot />
  </div>
</template>
