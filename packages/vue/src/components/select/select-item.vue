<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {cx, listboxItemVariants} from "@sail-ui/styles";
import {injectSelectRootContext, SelectItem as SelectItemPrimitive, SelectItemText} from "reka-ui";
import {computed, provide, ref, useAttrs} from "vue";

import {selectItemContextKey, type SelectItemContext} from "./context";
import type {SelectItemProps} from "./types";

defineOptions({name: "SailSelectItem", inheritAttrs: false});

const props = withDefaults(defineProps<SelectItemProps>(), {
  isDisabled: false,
  variant: "default",
});

const attrs = useAttrs();
const rootContext = injectSelectRootContext();
const itemRef = ref<HTMLDivElement | null>(null);

const isDisabled = computed(() => props.isDisabled || Boolean(rootContext.disabled?.value));

function matchesValue(value: unknown, currentValue: unknown, by: typeof rootContext.by) {
  if (value === undefined || currentValue === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value === currentValue;
  }

  if (typeof by === "function") {
    return by(value, currentValue);
  }

  if (typeof by === "string") {
    return (
      (value as Record<string, unknown>)?.[by] === (currentValue as Record<string, unknown>)?.[by]
    );
  }

  return JSON.stringify(value) === JSON.stringify(currentValue);
}

const isSelected = computed(() =>
  matchesValue(rootContext.modelValue.value, props.value, rootContext.by),
);

provide<SelectItemContext>(selectItemContextKey, {
  isSelected,
  variant: computed(() => props.variant),
});

const {isHovered} = useHover(itemRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(itemRef, {isDisabled});

const classes = computed(() =>
  cx(listboxItemVariants({variant: props.variant}).item(), attrs.class as string | undefined),
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
      v-bind="$attrs"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focused="isFocused ? '' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-selected="isSelected ? 'true' : undefined"
      :data-slot="'list-box-item'"
    >
      <SelectItemText>
        <slot :selected="selected" />
      </SelectItemText>
    </div>
  </SelectItemPrimitive>
</template>
