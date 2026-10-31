<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {CloseIcon} from "../../shared/icons";
import {useAutocompleteContext} from "./context";
import type {AutocompleteClearButtonProps} from "./types";

defineOptions({name: "SailAutocompleteClearButton", inheritAttrs: false});

const props = withDefaults(defineProps<AutocompleteClearButtonProps>(), {
  isDisabled: false,
});

const context = useAutocompleteContext();
const {className, forwarded} = useForwardedAttrs();
const buttonRef = ref<HTMLButtonElement | null>(null);

const isDisabled = computed(() => context.isDisabled.value || props.isDisabled);
const isEmpty = computed(() => context.binding.modelValue.value === undefined);

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isPressed} = usePress(buttonRef, {isDisabled});
const {isFocusVisible} = useFocusRing(buttonRef, {isDisabled});

const classes = computed(() => cx(context.slots.value.clearButton(), className.value));

function handleClick(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  if (!isDisabled.value && !isEmpty.value) {
    context.binding.clear();
  }
}
</script>

<template>
  <button
    ref="buttonRef"
    v-bind="forwarded"
    :aria-hidden="isEmpty ? 'true' : undefined"
    aria-label="Clear selection"
    :class="classes"
    :data-empty="isEmpty ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'autocomplete-clear-button'"
    :disabled="isDisabled"
    tabindex="-1"
    type="button"
    @click="handleClick"
  >
    <slot>
      <CloseIcon data-slot="autocomplete-clear-button-icon" />
    </slot>
  </button>
</template>
