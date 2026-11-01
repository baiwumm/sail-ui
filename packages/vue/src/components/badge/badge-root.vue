<script setup lang="ts">
import {badgeVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, h, provide, useSlots, type Slots, type VNode} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {RenderNodes, plainTextChild} from "../../shared/vnode";
import BadgeLabel from "./badge-label.vue";
import {badgeContextKey} from "./context";
import type {BadgeRootProps} from "./types";

defineOptions({name: "SailBadge", inheritAttrs: false});

const props = withDefaults(defineProps<BadgeRootProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const componentSlots = useSlots() as Slots;
const slots = computed(() =>
  badgeVariants({
    color: props.color,
    placement: props.placement,
    size: props.size,
    variant: props.variant,
  }),
);
const classes = computed(() => cx(slots.value.base(), className.value));

provide(badgeContextKey, {slots});

function renderChildren(): VNode[] {
  const children = componentSlots.default?.() ?? [];
  const text = plainTextChild(componentSlots.default);

  if (text !== undefined) {
    return [h(BadgeLabel, null, {default: () => text})];
  }

  return children;
}
</script>

<template>
  <Primitive v-bind="forwarded" :as="as" :as-child="asChild" :class="classes" :data-slot="'badge'">
    <RenderNodes :render="renderChildren" />
  </Primitive>
</template>
