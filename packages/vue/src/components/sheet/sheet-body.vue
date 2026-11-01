<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSheetContext} from "./context";

defineOptions({name: "SailSheetBody", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useSheetContext();

const classes = computed(() => cx(slots.value.body(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'sheet-body'">
    <slot />
  </div>
</template>
