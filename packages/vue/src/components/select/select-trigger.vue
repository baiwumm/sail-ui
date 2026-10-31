<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {injectSelectRootContext, SelectTrigger as SelectTriggerPrimitive} from "reka-ui";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSelectContext} from "./context";
import type {SelectTriggerProps} from "./types";

defineOptions({name: "SailSelectTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<SelectTriggerProps>(), {
  isDisabled: false,
});

const {className, forwarded} = useForwardedAttrs();
const context = useSelectContext();
const rootContext = injectSelectRootContext();
const buttonRef = ref<HTMLButtonElement | null>(null);

const isDisabled = computed(() => context.isDisabled.value || props.isDisabled);

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isFocusVisible} = useFocusRing(buttonRef, {isDisabled});

const classes = computed(() => cx(context.slots.value.trigger(), className.value));

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== "Backspace" && event.key !== "Delete") {
    return;
  }

  if (!context.hasClearButton() || context.isOpen.value || rootContext.isEmptyModelValue.value) {
    return;
  }

  event.preventDefault();
  context.clear();
}
</script>

<template>
  <SelectTriggerPrimitive as-child :disabled="isDisabled">
    <button
      ref="buttonRef"
      v-bind="forwarded"
      aria-haspopup="listbox"
      :aria-autocomplete="undefined"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-open="context.isOpen.value ? 'true' : undefined"
      :data-placeholder="undefined"
      :data-slot="'select-trigger'"
      :data-state="undefined"
      :disabled="isDisabled || undefined"
      type="button"
      @keydown="handleKeyDown"
    >
      <slot />
    </button>
  </SelectTriggerPrimitive>
</template>
