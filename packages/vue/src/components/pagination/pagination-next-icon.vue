<script setup lang="ts">
import {useForwardedAttrs} from "../../shared/attrs";
import {ChevronRightIcon} from "../../shared/icons";
import type {PaginationNextIconProps} from "./types";

defineOptions({name: "SailPaginationNextIcon", inheritAttrs: false});

defineProps<PaginationNextIconProps>();

const {className, forwarded} = useForwardedAttrs();
</script>

<template>
  <span v-bind="forwarded" aria-hidden="true" :class="className" data-slot="pagination-next-icon">
    <slot>
      <ChevronRightIcon />
    </slot>
  </span>
</template>
