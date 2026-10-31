<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {colorInputGroupVariants, cx} from "@sail-ui/styles";
import {computed, inject, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {colorFieldContextKey} from "./context";
import type {ColorInputGroupProps} from "./types";

defineOptions({name: "SailColorInputGroup", inheritAttrs: false});

const props = withDefaults(defineProps<ColorInputGroupProps>(), {
  variant: "primary",
  fullWidth: false,
});

const field = inject(colorFieldContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const groupRef = ref<HTMLElement | null>(null);

const slots = computed(() =>
  colorInputGroupVariants({fullWidth: props.fullWidth, variant: props.variant}),
);
const classes = computed(() => cx(slots.value.base(), className.value));

const isDisabled = computed(() => field.isDisabled.value);

const {isHovered} = useHover(groupRef, {isDisabled});
const {isFocused} = useFocusRing(groupRef, {isDisabled, within: true});
</script>

<template>
  <div
    v-bind="forwarded"
    ref="groupRef"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-within="isFocused ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="field.isInvalid.value ? 'true' : undefined"
    :data-readonly="field.isReadOnly.value ? 'true' : undefined"
    :data-slot="'color-input-group'"
    role="group"
  >
    <slot />
  </div>
</template>
