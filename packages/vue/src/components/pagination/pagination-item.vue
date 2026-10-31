<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {usePaginationContext} from "./context";
import type {PaginationItemProps} from "./types";

defineOptions({name: "SailPaginationItem", inheritAttrs: false});

defineProps<PaginationItemProps>();

const context = usePaginationContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(context.slots.value.item(), className.value));
</script>

<template>
  <li v-bind="forwarded" :class="classes" :data-slot="'pagination-item'">
    <slot />
  </li>
</template>
