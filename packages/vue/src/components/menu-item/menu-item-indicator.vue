<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useMenuItemContext} from "./context";
import type {MenuItemIndicatorProps} from "./types";

defineOptions({name: "SailMenuItemIndicator", inheritAttrs: false});

withDefaults(defineProps<MenuItemIndicatorProps>(), {
  type: "checkmark",
});

const item = useMenuItemContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(item.indicatorClass.value, className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-slot="'menu-item-indicator'"
    :data-type="type"
    :data-visible="item.isSelected.value ? 'true' : undefined"
  >
    <slot v-bind="{isSelected: item.isSelected.value}">
      <svg
        v-if="type === 'dot'"
        aria-hidden="true"
        data-slot="menu-item-indicator--dot"
        fill="currentColor"
        fill-rule="evenodd"
        role="presentation"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path clip-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14" fill-rule="evenodd" />
      </svg>
      <svg
        v-else
        aria-hidden="true"
        data-slot="menu-item-indicator--checkmark"
        fill="none"
        role="presentation"
        stroke="currentColor"
        :stroke-dasharray="22"
        :stroke-dashoffset="item.isSelected.value ? 44 : 66"
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
