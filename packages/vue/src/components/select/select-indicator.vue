<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, useSlots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSelectContext} from "./context";

defineOptions({name: "SailSelectIndicator", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const slots = useSlots();
const context = useSelectContext();

const hasCustomIndicator = computed(() => Boolean(slots.default));
const classes = computed(() => cx(context.slots.value.indicator(), className.value));
</script>

<template>
  <span
    v-if="hasCustomIndicator"
    v-bind="forwarded"
    :class="classes"
    :data-open="context.isOpen.value ? 'true' : undefined"
    :data-slot="'select-indicator'"
  >
    <slot />
  </span>
  <svg
    v-else
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-open="context.isOpen.value ? 'true' : undefined"
    :data-slot="'select-default-indicator'"
    fill="none"
    height="16"
    role="presentation"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      clip-rule="evenodd"
      d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
</template>
