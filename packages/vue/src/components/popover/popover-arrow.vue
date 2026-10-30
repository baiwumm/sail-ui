<script setup lang="ts">
import {PopoverArrow as PopoverArrowPrimitive} from "reka-ui";

import {useForwardedAttrs} from "../../shared/attrs";

defineOptions({name: "SailPopoverArrow", inheritAttrs: false});

const {forwarded} = useForwardedAttrs();
</script>

<template>
  <!-- Reka positions and rotates its own span wrapper; the upstream CSS rotates
       the svg again per placement, so the svg pins `rotate` inline to 0deg. -->
  <div v-bind="forwarded" :data-slot="'popover-overlay-arrow-group'">
    <PopoverArrowPrimitive :height="12" :width="12" as-child>
      <svg
        data-slot="popover-overlay-arrow"
        fill="none"
        height="12"
        style="rotate: 0deg"
        viewBox="0 0 12 12"
        width="12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0C5.48483 8 6.5 8 12 0Z" />
      </svg>
    </PopoverArrowPrimitive>
  </div>
</template>
