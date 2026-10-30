<script setup lang="ts">
import {cx, emptyStateVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, useAttrs, useSlots, type Slots} from "vue";

import {hasSlotContent} from "../../shared/vnode";
import type {EmptyStateRootProps} from "./types";

defineOptions({name: "SailEmptyState", inheritAttrs: false});

withDefaults(defineProps<EmptyStateRootProps>(), {
  as: "div"
});

const attrs = useAttrs();
const componentSlots = useSlots() as Slots;
const classes = computed(() => cx(emptyStateVariants(), attrs.class as string | undefined));
const hasContent = computed(() => hasSlotContent(componentSlots.default));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'empty-state'"
  >
    <slot v-if="hasContent" />
    <template v-else>
      No results found
    </template>
  </Primitive>
</template>
