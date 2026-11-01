<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {VisuallyHidden} from "reka-ui";
import {computed, inject, provide, ref, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {labelContextKey} from "../../shared/label-context";
import {checkboxContextKey, type CheckboxContentProps} from "./types";

defineOptions({name: "SailCheckboxContent", inheritAttrs: false});

defineProps<CheckboxContentProps>();

const context = inject(checkboxContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const inputRef = ref<HTMLInputElement | null>(null);
const labelRef = ref<HTMLElement | null>(null);

const isDisabled = computed(() => context?.isDisabled.value ?? false);

const {isHovered} = useHover(labelRef, {isDisabled});
const {isPressed} = usePress(labelRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(inputRef, {isDisabled});

const classes = computed(() => cx("checkbox__content", className.value));

watch(
  () => context?.isIndeterminate.value,
  (indeterminate) => {
    if (inputRef.value) {
      inputRef.value.indeterminate = Boolean(indeterminate);
    }
  },
  // "post" runs after the DOM update, so an initially indeterminate checkbox
  // reaches the native input while it exists instead of during setup.
  {immediate: true, flush: "post"},
);

// The label renders a `<span>` so the clickable row stays a plain label
// instead of nesting one label inside another.
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
    :data-indeterminate="context?.isIndeterminate.value ? 'true' : undefined"
    :data-invalid="context?.isInvalid.value ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-required="context?.isRequired.value ? 'true' : undefined"
    :data-selected="context?.isSelected.value ? 'true' : undefined"
    :data-slot="'checkbox-content'"
  >
    <VisuallyHidden>
      <input
        ref="inputRef"
        :checked="context?.isSelected.value"
        :disabled="isDisabled"
        :name="context?.name.value"
        :required="context?.isRequired.value"
        type="checkbox"
        :value="context?.value.value"
        @change="context?.toggle()"
      />
    </VisuallyHidden>
    <slot />
  </label>
</template>
