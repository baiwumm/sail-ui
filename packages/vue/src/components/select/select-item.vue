<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx, listboxItemVariants} from "@sail-ui/styles";
import {injectSelectRootContext, SelectItem as SelectItemPrimitive, SelectItemText} from "reka-ui";
import {computed, provide, ref, useId, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {descriptionContextKey} from "../../shared/description-context";
import {labelContextKey} from "../../shared/label-context";
import {containsComponent, flattenVNodes} from "../../shared/vnode";
import DescriptionRoot from "../description/description.vue";
import LabelRoot from "../label/label.vue";
import {selectItemContextKey, useSelectContext, type SelectItemContext} from "./context";
import type {SelectItemProps} from "./types";
import {valuesEqual} from "./utils";

defineOptions({name: "SailSelectItem", inheritAttrs: false});

const props = withDefaults(defineProps<SelectItemProps>(), {
  isDisabled: false,
  variant: "default",
});

const {attrs, className, forwarded} = useForwardedAttrs();
const rootContext = injectSelectRootContext();
const context = useSelectContext();
const componentSlots = useSlots() as Slots;

const itemRef = ref<HTMLDivElement | null>(null);
const labelId = useId();
const descriptionId = useId();

const isDisabled = computed(
  () =>
    props.isDisabled ||
    context.isDisabled.value ||
    Boolean(rootContext.disabled?.value) ||
    context.isItemDisabled(props.value),
);

const isSelected = computed(() => {
  const current = rootContext.modelValue.value;

  if (Array.isArray(current)) {
    return current.some((value) => valuesEqual(value, props.value, rootContext.by));
  }

  return valuesEqual(current, props.value, rootContext.by);
});

const nodes = computed(() => flattenVNodes(componentSlots.default?.() ?? []));
const hasLabel = computed(() => containsComponent(nodes.value, LabelRoot));
const hasDescription = computed(() => containsComponent(nodes.value, DescriptionRoot));

const itemAttrs = computed(() => {
  const base: Record<string, unknown> = {...forwarded.value};

  if (hasLabel.value && !base["aria-labelledby"]) {
    base["aria-labelledby"] = labelId;
  }

  return base;
});

const describedBy = computed(() => {
  const explicit = attrs["aria-describedby"];

  if (explicit) {
    return explicit as string;
  }

  return hasDescription.value ? descriptionId : undefined;
});

provide(labelContextKey, {id: labelId, elementType: "span"});
provide(descriptionContextKey, {id: descriptionId});

provide<SelectItemContext>(selectItemContextKey, {
  isSelected,
  variant: computed(() => props.variant),
});

const {isHovered} = useHover(itemRef, {isDisabled});
const {isPressed} = usePress(itemRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(itemRef, {isDisabled});

const classes = computed(() =>
  cx(listboxItemVariants({variant: props.variant}).item(), className.value),
);
</script>

<template>
  <SelectItemPrimitive
    v-slot="{selected}"
    as-child
    :disabled="isDisabled"
    :text-value="textValue"
    :value="value"
  >
    <div
      ref="itemRef"
      v-bind="itemAttrs"
      :aria-describedby="describedBy"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :aria-selected="isSelected ? 'true' : 'false'"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-highlighted="undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-pressed="isPressed ? 'true' : undefined"
      :data-selected="isSelected ? 'true' : undefined"
      :data-selection-mode="rootContext.multiple.value ? 'multiple' : 'single'"
      :data-slot="'list-box-item'"
      :data-state="undefined"
    >
      <SelectItemText>
        <slot :selected="selected" />
      </SelectItemText>
    </div>
  </SelectItemPrimitive>
</template>
