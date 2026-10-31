<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useAccordionContext} from "./context";

defineOptions({name: "SailAccordionBody", inheritAttrs: false});

const root = useAccordionContext();
const {className, forwarded} = useForwardedAttrs();

const innerClasses = computed(() => cx(root.slots.value.bodyInner(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="root.slots.value.body()" :data-slot="'accordion-body'">
    <div :class="innerClasses">
      <slot />
    </div>
  </div>
</template>
