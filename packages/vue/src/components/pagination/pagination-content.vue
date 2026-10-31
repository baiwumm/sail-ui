<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {usePaginationContext} from "./context";
import type {PaginationContentProps} from "./types";

defineOptions({name: "SailPaginationContent", inheritAttrs: false});

defineProps<PaginationContentProps>();

const context = usePaginationContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(context.slots.value.content(), className.value));
</script>

<template>
  <ul v-bind="forwarded" :class="classes" :data-slot="'pagination-content'">
    <slot />
  </ul>
</template>
