<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {usePaginationContext} from "./context";
import type {PaginationSummaryProps} from "./types";

defineOptions({name: "SailPaginationSummary", inheritAttrs: false});

defineProps<PaginationSummaryProps>();

const context = usePaginationContext();
const {attrs, className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(context.slots.value.summary(), className.value));
const dir = computed(() => (attrs.dir as string | undefined) ?? "auto");
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'pagination-summary'" :dir="dir">
    <slot />
  </div>
</template>
