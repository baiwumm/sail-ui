<script setup lang="ts">
import {useFocusRing, useHover, usePress, type PressEvent} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {usePaginationContext} from "./context";
import type {PaginationNextProps} from "./types";

defineOptions({name: "SailPaginationNext", inheritAttrs: false});

const props = withDefaults(defineProps<PaginationNextProps>(), {isDisabled: false});

const emit = defineEmits<{
  press: [event: PressEvent];
}>();

const context = usePaginationContext();
const {className, forwarded} = useForwardedAttrs();

const nextRef = ref<HTMLButtonElement | null>(null);
const isDisabled = computed(() => props.isDisabled);

const {isHovered} = useHover(nextRef, {isDisabled});
const {isPressed} = usePress(nextRef, {
  isDisabled,
  onPress: (event) => emit("press", event),
});
const {isFocused, isFocusVisible} = useFocusRing(nextRef, {isDisabled});

const classes = computed(() =>
  cx(context.slots.value.link(), "pagination__link--nav", className.value),
);
</script>

<template>
  <button
    v-bind="forwarded"
    ref="nextRef"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'pagination-next'"
    :disabled="isDisabled || undefined"
    type="button"
  >
    <slot />
  </button>
</template>
