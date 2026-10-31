<script setup lang="ts">
import {cx, paginationVariants} from "@sail-ui/styles";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {paginationContextKey} from "./context";
import type {PaginationContext, PaginationRootProps} from "./types";

defineOptions({name: "SailPaginationRoot", inheritAttrs: false});

const props = withDefaults(defineProps<PaginationRootProps>(), {size: "md"});

const {attrs, className, forwarded} = useForwardedAttrs();
const slots = computed(() => paginationVariants({size: props.size}));
const classes = computed(() => cx(slots.value.base(), className.value));
const ariaLabel = computed(() => (attrs["aria-label"] as string | undefined) ?? "pagination");

provide<PaginationContext>(paginationContextKey, {slots});
</script>

<template>
  <nav
    v-bind="forwarded"
    :aria-label="ariaLabel"
    :class="classes"
    :data-slot="'pagination'"
    role="navigation"
  >
    <slot />
  </nav>
</template>
