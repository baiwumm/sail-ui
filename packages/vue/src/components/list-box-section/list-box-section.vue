<script setup lang="ts">
import {cx, listboxSectionVariants} from "@sail-ui/styles";
import {computed, provide, useId, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {headerContextKey} from "../../shared/header-context";
import {containsComponent, flattenVNodes} from "../../shared/vnode";
import HeaderRoot from "../header/header.vue";
import type {ListBoxSectionProps} from "./types";

defineOptions({name: "SailListBoxSection", inheritAttrs: false});

defineProps<ListBoxSectionProps>();

const componentSlots = useSlots() as Slots;
const {attrs, className, forwarded} = useForwardedAttrs();

const headerId = useId();
const classes = computed(() => cx(listboxSectionVariants(), className.value));
const hasHeader = computed(() =>
  containsComponent(flattenVNodes(componentSlots.default?.() ?? []), HeaderRoot),
);
const labelledBy = computed(() => {
  const explicit = attrs["aria-labelledby"];

  if (explicit) {
    return explicit as string;
  }

  return hasHeader.value ? headerId : undefined;
});

provide(headerContextKey, {id: headerId});
</script>

<template>
  <section v-bind="forwarded" :aria-labelledby="labelledBy" :class="classes" role="group">
    <slot />
  </section>
</template>
