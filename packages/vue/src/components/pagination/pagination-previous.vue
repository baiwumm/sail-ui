<script setup lang="ts">
import {useFocusRing, useHover, usePress, type PressEvent} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {usePaginationContext} from "./context";
import type {PaginationPreviousProps} from "./types";

defineOptions({name: "SailPaginationPrevious", inheritAttrs: false});

const props = withDefaults(defineProps<PaginationPreviousProps>(), {isDisabled: false});

const emit = defineEmits<{
  press: [event: PressEvent];
}>();

const context = usePaginationContext();
const {className, forwarded} = useForwardedAttrs();

const previousRef = ref<HTMLButtonElement | null>(null);
const isDisabled = computed(() => props.isDisabled);

const {isHovered} = useHover(previousRef, {isDisabled});
const {isPressed} = usePress(previousRef, {
  isDisabled,
  onPress: (event) => emit("press", event),
});
const {isFocused, isFocusVisible} = useFocusRing(previousRef, {isDisabled});

const classes = computed(() =>
  cx(context.slots.value.link(), "pagination__link--nav", className.value),
);
</script>

<template>
  <button
    v-bind="forwarded"
    ref="previousRef"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'pagination-previous'"
    :disabled="isDisabled || undefined"
    type="button"
  >
    <slot />
  </button>
</template>
