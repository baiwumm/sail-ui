<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {closeButtonVariants, cx, searchFieldVariants} from "@sail-ui/styles";
import {computed, inject, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {CloseIcon} from "../../shared/icons";
import {searchFieldContextKey, type SearchFieldClearButtonProps} from "./types";

defineOptions({name: "SailSearchFieldClearButton", inheritAttrs: false});

defineProps<SearchFieldClearButtonProps>();

const context = inject(searchFieldContextKey, null);
const {className, forwarded} = useForwardedAttrs();
const buttonRef = ref<HTMLButtonElement | null>(null);

const isDisabled = computed(() => context?.isDisabled.value ?? false);

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isPressed} = usePress(buttonRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(buttonRef, {isDisabled});

const classes = computed(() =>
  cx(closeButtonVariants(), searchFieldVariants().clearButton(), className.value),
);
</script>

<template>
  <button
    ref="buttonRef"
    v-bind="{...forwarded, slot: 'clear'}"
    aria-label="Clear"
    :class="classes"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'search-field-clear-button'"
    :disabled="isDisabled"
    type="button"
    @click="context?.clear()"
  >
    <slot>
      <CloseIcon data-slot="close-button-icon" />
    </slot>
  </button>
</template>
