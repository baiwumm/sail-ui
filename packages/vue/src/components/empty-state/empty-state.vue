<script setup lang="ts">
import {cx, emptyStateVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {hasSlotContent} from "../../shared/vnode";
import type {EmptyStateRootProps} from "./types";

defineOptions({name: "SailEmptyState", inheritAttrs: false});

withDefaults(defineProps<EmptyStateRootProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const componentSlots = useSlots() as Slots;
const classes = computed(() => cx(emptyStateVariants(), className.value));
const hasContent = computed(() => hasSlotContent(componentSlots.default));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'empty-state'"
  >
    <slot v-if="hasContent" />
    <template v-else> No results found </template>
  </Primitive>
</template>
