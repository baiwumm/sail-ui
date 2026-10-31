<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useMenuItemContext} from "./context";
import type {MenuItemSubmenuIndicatorProps} from "./types";

defineOptions({name: "SailMenuItemSubmenuIndicator", inheritAttrs: false});

defineProps<MenuItemSubmenuIndicatorProps>();

const item = useMenuItemContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(item.submenuIndicatorClass.value, className.value));
</script>

<template>
  <span
    v-if="item.hasSubmenu.value"
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    data-slot="submenu-indicator"
  >
    <slot>
      <svg
        aria-hidden="true"
        fill="none"
        height="16"
        role="presentation"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </slot>
  </span>
</template>
