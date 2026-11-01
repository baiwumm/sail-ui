<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDrawerContext} from "./context";

defineOptions({name: "SailDrawerFooter", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useDrawerContext();

const classes = computed(() => cx(slots.value.footer(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'drawer-footer'">
    <slot />
  </div>
</template>
