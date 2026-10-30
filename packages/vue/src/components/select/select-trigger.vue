<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {injectSelectRootContext, SelectTrigger as SelectTriggerPrimitive} from "reka-ui";
import {computed, ref, useAttrs} from "vue";

import {useSelectContext} from "./context";
import type {SelectTriggerProps} from "./types";

defineOptions({name: "SailSelectTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<SelectTriggerProps>(), {
  isDisabled: false
});

const attrs = useAttrs();
const context = useSelectContext();
const rootContext = injectSelectRootContext();
const buttonRef = ref<HTMLButtonElement | null>(null);

const isDisabled = computed(() => context.isDisabled.value || props.isDisabled);

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isFocusVisible} = useFocusRing(buttonRef, {isDisabled});

const classes = computed(() =>
  cx(context.slots.value.trigger(), attrs.class as string | undefined)
);

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== "Backspace" && event.key !== "Delete") {
    return;
  }

  if (
    !context.hasClearButton() ||
    context.isOpen.value ||
    rootContext.isEmptyModelValue.value
  ) {
    return;
  }

  event.preventDefault();
  context.clear();
}
</script>

<template>
  <SelectTriggerPrimitive
    as-child
    :disabled="isDisabled"
  >
    <button
      ref="buttonRef"
      v-bind="$attrs"
      :class="classes"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-open="context.isOpen.value ? 'true' : undefined"
      :data-slot="'select-trigger'"
      :disabled="isDisabled || undefined"
      type="button"
      @keydown="handleKeyDown"
    >
      <slot />
    </button>
  </SelectTriggerPrimitive>
</template>
