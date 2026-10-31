<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {usePaginationContext} from "./context";
import type {PaginationEllipsisProps} from "./types";

defineOptions({name: "SailPaginationEllipsis", inheritAttrs: false});

defineProps<PaginationEllipsisProps>();

const context = usePaginationContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(context.slots.value.ellipsis(), className.value));
</script>

<template>
  <span v-bind="forwarded" aria-hidden="true" :class="classes" :data-slot="'pagination-ellipsis'">
    <slot>&hellip;</slot>
  </span>
</template>
