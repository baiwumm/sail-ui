<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {VisuallyHidden} from "reka-ui";
import {computed, inject, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {labelContextKey} from "../../shared/label-context";
import {radioContextKey, type RadioContentProps} from "./types";

defineOptions({name: "SailRadioContent", inheritAttrs: false});

defineProps<RadioContentProps>();

const context = inject(radioContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const inputRef = ref<HTMLInputElement | null>(null);
const labelRef = ref<HTMLElement | null>(null);

const isDisabled = computed(() => context?.isDisabled.value ?? false);

const {isHovered} = useHover(labelRef, {isDisabled});
const {isPressed} = usePress(labelRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(inputRef, {isDisabled});

const classes = computed(() => cx("radio__content", className.value));

provide(labelContextKey, {elementType: "span"});
</script>

<template>
  <label
    ref="labelRef"
    v-bind="forwarded"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="context?.isInvalid.value ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-required="context?.isRequired.value ? 'true' : undefined"
    :data-selected="context?.isSelected.value ? 'true' : undefined"
    :data-slot="'radio-content'"
  >
    <VisuallyHidden>
      <input
        ref="inputRef"
        :checked="context?.isSelected.value"
        :disabled="isDisabled"
        :name="context?.name.value"
        :required="context?.isRequired.value"
        :tabindex="context?.tabIndex.value"
        type="radio"
        :value="context?.value.value"
        @change="context?.select()"
      >
    </VisuallyHidden>
    <slot />
  </label>
</template>
