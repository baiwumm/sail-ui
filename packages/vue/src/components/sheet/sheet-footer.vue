<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSheetContext} from "./context";

defineOptions({name: "SailSheetFooter", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useSheetContext();

const classes = computed(() => cx(slots.value.footer(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'sheet-footer'">
    <slot />
  </div>
</template>
