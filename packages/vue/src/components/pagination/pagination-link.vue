<script setup lang="ts">
import {useFocusRing, useHover, usePress, type PressEvent} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {usePaginationContext} from "./context";
import type {PaginationLinkProps} from "./types";

defineOptions({name: "SailPaginationLink", inheritAttrs: false});

const props = withDefaults(defineProps<PaginationLinkProps>(), {
  isActive: false,
  isDisabled: false,
});

const emit = defineEmits<{
  press: [event: PressEvent];
}>();

const context = usePaginationContext();
const {className, forwarded} = useForwardedAttrs();

const linkRef = ref<HTMLButtonElement | null>(null);
const isActive = computed(() => props.isActive);
const isDisabled = computed(() => props.isDisabled);

const {isHovered} = useHover(linkRef, {isDisabled});
const {isPressed} = usePress(linkRef, {
  isDisabled,
  onPress: (event) => emit("press", event),
});
const {isFocused, isFocusVisible} = useFocusRing(linkRef, {isDisabled});

const classes = computed(() => cx(context.slots.value.link(), className.value));
</script>

<template>
  <button
    v-bind="forwarded"
    ref="linkRef"
    :aria-current="isActive ? 'page' : undefined"
    :class="classes"
    :data-active="isActive ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'pagination-link'"
    :disabled="isDisabled || undefined"
    type="button"
  >
    <slot />
  </button>
</template>
