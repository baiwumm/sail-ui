<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {cloneVNode, computed, createTextVNode, h, inject, isVNode, useAttrs, type VNode} from "vue";

import {ChevronRightIcon} from "../../shared/icons";
import {RenderNodes} from "../../shared/vnode";
import Link from "../link/link-root.vue";
import {breadcrumbsContextKey} from "./context";
import type {BreadcrumbsItemInternalProps} from "./types";

defineOptions({name: "SailBreadcrumbsItem", inheritAttrs: false});

const props = withDefaults(defineProps<BreadcrumbsItemInternalProps>(), {
  isCurrent: false
});

const attrs = useAttrs();
const context = inject(breadcrumbsContextKey, null);
const slots = context?.slots;
const itemClasses = computed(() =>
  cx(slots?.value.item(), attrs.class as string | undefined)
);
const linkClasses = computed(() => slots?.value.link());
const isDisabled = computed(
  () => props.isDisabled === true || props.isCurrent || Boolean(context?.isDisabled.value)
);

function renderSeparator(): VNode {
  const separator = context?.separator.value;

  if (separator == null) {
    return h(ChevronRightIcon, {
      class: slots?.value.separator(),
      "data-slot": "breadcrumbs-separator"
    });
  }

  if (isVNode(separator)) {
    return cloneVNode(separator, {
      class: slots?.value.separator(),
      "data-slot": "breadcrumbs-separator"
    });
  }

  return createTextVNode(String(separator));
}
</script>

<template>
  <li
    v-bind="$attrs"
    :class="itemClasses"
    :data-current="isCurrent ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-slot="'breadcrumbs-item'"
  >
    <Link
      :aria-current="isCurrent ? 'page' : undefined"
      :class="linkClasses"
      :download="download === false ? undefined : download"
      :href="href"
      :hreflang="hreflang"
      :is-disabled="isDisabled"
      :ping="ping"
      :referrerpolicy="referrerpolicy"
      :rel="rel"
      :target="target"
      :type="type"
      @press="props.onPress"
    >
      <slot />
    </Link>
    <RenderNodes
      v-if="!isCurrent"
      :render="renderSeparator"
    />
  </li>
</template>
