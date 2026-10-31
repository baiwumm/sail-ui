<script setup lang="ts">
import {useForwardedAttrs} from "../../shared/attrs";
import {ChevronLeftIcon} from "../../shared/icons";
import type {PaginationPreviousIconProps} from "./types";

defineOptions({name: "SailPaginationPreviousIcon", inheritAttrs: false});

defineProps<PaginationPreviousIconProps>();

const {className, forwarded} = useForwardedAttrs();
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="className"
    data-slot="pagination-previous-icon"
  >
    <slot>
      <ChevronLeftIcon />
    </slot>
  </span>
</template>
