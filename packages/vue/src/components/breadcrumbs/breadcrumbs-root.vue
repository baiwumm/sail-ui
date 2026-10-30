<script setup lang="ts">
import {breadcrumbsVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {cloneVNode, computed, provide, useAttrs, useSlots, type Slots, type VNode} from "vue";

import {RenderNodes, flattenVNodes, isRenderableVNode} from "../../shared/vnode";
import BreadcrumbsItem from "./breadcrumbs-item.vue";
import {breadcrumbsContextKey} from "./context";
import type {BreadcrumbsRootProps} from "./types";

defineOptions({name: "SailBreadcrumbs", inheritAttrs: false});

const props = withDefaults(defineProps<BreadcrumbsRootProps>(), {
  as: "ol",
  isDisabled: false,
});

const attrs = useAttrs();
const componentSlots = useSlots() as Slots;
const slots = computed(() => breadcrumbsVariants());
const classes = computed(() => cx(slots.value.base(), attrs.class as string | undefined));
const ariaLabel = computed(() => (attrs["aria-label"] as string | undefined) ?? "Breadcrumbs");

provide(breadcrumbsContextKey, {
  slots,
  separator: computed(() => props.separator),
  isDisabled: computed(() => props.isDisabled),
});

function renderChildren(): VNode[] {
  const children = flattenVNodes(componentSlots.default?.() ?? []).filter(isRenderableVNode);
  let currentIndex = -1;

  children.forEach((child, index) => {
    if (child.type === BreadcrumbsItem) {
      currentIndex = index;
    }
  });

  return children.map((child, index) =>
    child.type === BreadcrumbsItem && index === currentIndex
      ? cloneVNode(child, {isCurrent: true})
      : child,
  );
}
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :aria-label="ariaLabel"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'breadcrumbs'"
  >
    <RenderNodes :render="renderChildren" />
  </Primitive>
</template>
