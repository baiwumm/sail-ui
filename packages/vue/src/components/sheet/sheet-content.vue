<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import {useSheetContext} from "./context";

defineOptions({name: "SailSheetContent", inheritAttrs: false});

const attrs = useAttrs();
const {slots, placement, isOpen, isEntering, isExiting} = useSheetContext();

const classes = computed(() => cx(slots.value.content(), attrs.class as string | undefined));
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classes"
    :data-entering="isEntering ? 'true' : undefined"
    :data-exiting="isExiting ? 'true' : undefined"
    :data-expanded="isOpen ? '' : undefined"
    :data-placement="placement"
    :data-slot="'sheet-content'"
  >
    <slot />
  </div>
</template>
