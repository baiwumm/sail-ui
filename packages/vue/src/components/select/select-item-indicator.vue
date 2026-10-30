<script setup lang="ts">
import {cx, listboxItemVariants} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import {useSelectItemContext} from "./context";
import type {SelectItemIndicatorProps} from "./types";

defineOptions({name: "SailSelectItemIndicator", inheritAttrs: false});

const props = defineProps<SelectItemIndicatorProps>();
const attrs = useAttrs();
const item = useSelectItemContext();

const variant = computed(() => props.variant ?? item.variant.value);
const classes = computed(() =>
  cx(listboxItemVariants({variant: variant.value}).indicator(), attrs.class as string | undefined)
);
</script>

<template>
  <span
    v-bind="$attrs"
    aria-hidden="true"
    :class="classes"
    :data-slot="'list-box-item-indicator'"
    :data-visible="item.isSelected.value || undefined"
  >
    <slot>
      <svg
        aria-hidden="true"
        data-slot="list-box-item-indicator--checkmark"
        fill="none"
        role="presentation"
        :stroke-dasharray="22"
        :stroke-dashoffset="item.isSelected.value ? 44 : 66"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-width="2"
        viewBox="0 0 17 18"
      >
        <polyline points="1 9 7 14 15 4" />
      </svg>
    </slot>
  </span>
</template>
