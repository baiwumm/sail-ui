<script setup lang="ts">
import {avatarGroupVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, h, provide, useAttrs, useSlots, type Slots, type VNode} from "vue";

import {RenderNodes, flattenVNodes, isRenderableVNode} from "../../shared/vnode";
import AvatarGroupCount from "./avatar-group-count.vue";
import {avatarGroupContextKey} from "./context";
import type {AvatarGroupRootProps} from "./types";

defineOptions({name: "SailAvatarGroup", inheritAttrs: false});

const props = withDefaults(defineProps<AvatarGroupRootProps>(), {
  as: "div",
  isGrid: false,
  overlap: "clip",
  size: "md"
});

const attrs = useAttrs();
const slots = computed(() =>
  avatarGroupVariants({isGrid: props.isGrid, overlap: props.overlap})
);
const classes = computed(() => cx(slots.value.base(), attrs.class as string | undefined));

provide(avatarGroupContextKey, {
  slots,
  color: computed(() => props.color),
  size: computed(() => props.size),
  variant: computed(() => props.variant)
});

const componentSlots = useSlots() as Slots;

function renderChildren(): VNode[] {
  const children = flattenVNodes(componentSlots.default?.() ?? []).filter(isRenderableVNode);
  const avatarChildren: VNode[] = [];
  const countChildren: VNode[] = [];

  for (const child of children) {
    if (child.type === AvatarGroupCount) {
      countChildren.push(child);
    } else {
      avatarChildren.push(child);
    }
  }

  const visible =
    props.max == null ? avatarChildren : avatarChildren.slice(0, Math.max(0, props.max));
  const remaining =
    props.max == null ? 0 : Math.max(0, avatarChildren.length - visible.length);

  const rendered = [...visible];

  if (countChildren.length > 0) {
    return [...rendered, ...countChildren];
  }

  if (remaining > 0) {
    rendered.push(h(AvatarGroupCount, null, {default: () => `+${remaining}`}));
  }

  return rendered;
}
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'avatar-group'"
  >
    <RenderNodes :render="renderChildren" />
  </Primitive>
</template>
