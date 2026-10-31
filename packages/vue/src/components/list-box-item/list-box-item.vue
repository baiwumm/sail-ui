<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx, listboxItemVariants} from "@sail-ui/styles";
import {ListboxItem as ListboxItemPrimitive} from "reka-ui";
import {computed, provide, ref, useId, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {descriptionContextKey} from "../../shared/description-context";
import {labelContextKey} from "../../shared/label-context";
import {containsComponent, flattenVNodes} from "../../shared/vnode";
import DescriptionRoot from "../description/description.vue";
import LabelRoot from "../label/label.vue";
import {useListBoxContext} from "../list-box/context";
import {listBoxItemContextKey} from "./context";
import type {ListBoxItemProps} from "./types";

defineOptions({name: "SailListBoxItem", inheritAttrs: false});

const props = withDefaults(defineProps<ListBoxItemProps>(), {
  isDisabled: false,
  variant: "default",
});

const root = useListBoxContext();
const componentSlots = useSlots() as Slots;
const {attrs, className, forwarded} = useForwardedAttrs();

const itemRef = ref<HTMLElement | null>(null);
const labelId = useId();
const descriptionId = useId();

const slots = computed(() => listboxItemVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value.item(), className.value));
const isDisabled = computed(() => props.isDisabled || root.isDisabled(props.value));
const isSelected = computed(() => root.isSelected(props.value));

const nodes = computed(() => flattenVNodes(componentSlots.default?.() ?? []));
const hasLabel = computed(() => containsComponent(nodes.value, LabelRoot));
const hasDescription = computed(() => containsComponent(nodes.value, DescriptionRoot));

const labelledBy = computed(() => {
  const explicit = attrs["aria-labelledby"];

  if (explicit) {
    return explicit as string;
  }

  return hasLabel.value ? labelId : undefined;
});

const ariaLabel = computed(() => {
  if (attrs["aria-label"] !== undefined) {
    return attrs["aria-label"] as string;
  }

  return hasLabel.value ? undefined : props.textValue;
});

const describedBy = computed(() => {
  const explicit = attrs["aria-describedby"];

  if (explicit) {
    return explicit as string;
  }

  return hasDescription.value ? descriptionId : undefined;
});

const ariaSelected = computed(() => {
  if (root.selectionMode.value === "none") {
    return undefined;
  }

  return isSelected.value ? "true" : "false";
});

const {isHovered} = useHover(itemRef, {isDisabled});
const {isPressed} = usePress(itemRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(itemRef, {isDisabled});

provide(labelContextKey, {id: labelId, elementType: "span"});
provide(descriptionContextKey, {id: descriptionId});

provide(listBoxItemContextKey, {
  isSelected,
  indicatorClass: computed(() => slots.value.indicator()),
});

function handleSelect(event: Event) {
  if (isDisabled.value) {
    return;
  }

  if (root.selectionMode.value === "none") {
    event.preventDefault();
  }

  root.emitAction(props.value);
}
</script>

<template>
  <ListboxItemPrimitive
    v-slot="{selected}"
    as-child
    :disabled="isDisabled"
    :value="value"
    @select="handleSelect"
  >
    <div
      v-bind="forwarded"
      ref="itemRef"
      :aria-describedby="describedBy"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :aria-label="ariaLabel"
      :aria-labelledby="labelledBy"
      :aria-selected="ariaSelected"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-highlighted="undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-pressed="isPressed ? 'true' : undefined"
      :data-selected="isSelected ? 'true' : undefined"
      :data-selection-mode="
        root.selectionMode.value === 'none' ? undefined : root.selectionMode.value
      "
      :data-slot="'list-box-item'"
      :data-state="undefined"
      :disabled="undefined"
    >
      <slot :selected="selected" />
    </div>
  </ListboxItemPrimitive>
</template>
