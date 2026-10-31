<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useListBoxItemContext} from "./context";
import type {ListBoxItemIndicatorProps} from "./types";

defineOptions({name: "SailListBoxItemIndicator", inheritAttrs: false});

defineProps<ListBoxItemIndicatorProps>();

const item = useListBoxItemContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(item.indicatorClass.value, className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-slot="'list-box-item-indicator'"
    :data-visible="item.isSelected.value ? 'true' : undefined"
  >
    <slot v-bind="{isSelected: item.isSelected.value}">
      <svg
        aria-hidden="true"
        data-slot="list-box-item-indicator--checkmark"
        fill="none"
        role="presentation"
        stroke="currentColor"
        stroke-dasharray="22"
        :stroke-dashoffset="item.isSelected.value ? 44 : 66"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 17 18"
      >
        <polyline points="1 9 7 14 15 4" />
      </svg>
    </slot>
  </span>
</template>
