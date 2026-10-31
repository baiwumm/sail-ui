<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useAccordionContext} from "./context";

defineOptions({name: "SailAccordionHeading", inheritAttrs: false});

const root = useAccordionContext();
const {className, forwarded} = useForwardedAttrs();
const classes = computed(() => cx(root.slots.value.heading(), className.value));
</script>

<template>
  <h3 v-bind="forwarded" :class="classes" :data-slot="'accordion-heading'">
    <slot />
  </h3>
</template>
