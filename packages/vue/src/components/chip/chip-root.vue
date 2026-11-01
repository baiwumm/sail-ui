<script setup lang="ts">
import {chipVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, h, provide, useSlots, type Slots, type VNode} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {RenderNodes, plainTextChild} from "../../shared/vnode";
import ChipLabel from "./chip-label.vue";
import {chipContextKey} from "./context";
import type {ChipRootProps} from "./types";

defineOptions({name: "SailChip", inheritAttrs: false});

const props = withDefaults(defineProps<ChipRootProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const componentSlots = useSlots() as Slots;
const slots = computed(() =>
  chipVariants({color: props.color, size: props.size, variant: props.variant}),
);
const classes = computed(() => cx(slots.value.base(), className.value));

provide(chipContextKey, {slots});

function renderChildren(): VNode[] {
  const text = plainTextChild(componentSlots.default);

  if (text !== undefined) {
    return [h(ChipLabel, null, {default: () => text})];
  }

  return componentSlots.default?.() ?? [];
}
</script>

<template>
  <Primitive v-bind="forwarded" :as="as" :as-child="asChild" :class="classes" :data-slot="'chip'">
    <RenderNodes :render="renderChildren" />
  </Primitive>
</template>
