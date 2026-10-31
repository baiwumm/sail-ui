<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx, tagVariants} from "@sail-ui/styles";
import {TagGroupItem as TagGroupItemPrimitive} from "reka-ui";
import {Text, computed, provide, ref, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {flattenVNodes} from "../../shared/vnode";
import {useTagGroupContext} from "../tag-group/context";
import {tagItemContextKey} from "./context";
import TagRemoveButtonRoot from "./tag-remove-button.vue";
import type {TagRootProps} from "./types";

defineOptions({name: "SailTag", inheritAttrs: false});

const props = withDefaults(defineProps<TagRootProps>(), {isDisabled: false});

const root = useTagGroupContext();
const componentSlots = useSlots() as Slots;
const {className, forwarded} = useForwardedAttrs();

const tagRef = ref<HTMLElement | null>(null);
const isDisabled = computed(() => root.isDisabled.value || props.isDisabled);
const slots = computed(() => tagVariants({size: root.size.value, variant: root.variant.value}));
const classes = computed(() => cx(slots.value.base(), className.value));
const canRemove = root.canRemove;

const textValue = computed(() => {
  if (props.textValue !== undefined) {
    return props.textValue;
  }

  const nodes = flattenVNodes(componentSlots.default?.() ?? []);
  const firstText = nodes.find(
    (node) =>
      node.type === Text && typeof node.children === "string" && node.children.trim() !== "",
  );

  return typeof firstText?.children === "string" ? firstText.children.trim() : undefined;
});

const hasCustomRemoveButton = computed(() =>
  flattenVNodes(componentSlots.default?.() ?? []).some((node) => node.type === TagRemoveButtonRoot),
);

const isSelected = computed(() => root.isSelected(props.value));
const removeButtonClass = computed(() => slots.value.removeButton());

const {isHovered} = useHover(tagRef, {isDisabled});
const {isPressed} = usePress(tagRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(tagRef, {isDisabled});

provide(tagItemContextKey, {
  isDisabled,
  removeButtonClass,
  remove: () => root.requestRemove([props.value]),
});
</script>

<template>
  <TagGroupItemPrimitive as-child :disabled="isDisabled" :text-value="textValue" :value="value">
    <div
      v-bind="forwarded"
      ref="tagRef"
      :aria-label="textValue"
      :aria-selected="
        root.selectionMode.value === 'none' || isDisabled
          ? undefined
          : isSelected
            ? 'true'
            : 'false'
      "
      :class="classes"
      :data-allows-removing="canRemove ? 'true' : undefined"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-orientation="undefined"
      :data-pressed="isPressed ? 'true' : undefined"
      :data-selected="isSelected ? 'true' : undefined"
      :data-selection-mode="
        root.selectionMode.value === 'none' ? undefined : root.selectionMode.value
      "
      :data-slot="'tag'"
      :data-state="undefined"
    >
      <div aria-colindex="1" role="gridcell" style="display: contents">
        <slot />
        <TagRemoveButtonRoot v-if="!hasCustomRemoveButton && canRemove" />
      </div>
    </div>
  </TagGroupItemPrimitive>
</template>
