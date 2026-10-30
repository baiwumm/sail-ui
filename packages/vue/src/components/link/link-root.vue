<script setup lang="ts">
import {cx, linkVariants} from "@sail-ui/styles";
import {useFocusRing, useHover, usePress, type PressEvent} from "@sail-ui/primitives";
import {Primitive} from "reka-ui";
import {computed, provide, ref, useAttrs, type ComponentPublicInstance} from "vue";

import {linkContextKey} from "./context";
import type {LinkRootProps} from "./types";

defineOptions({name: "SailLink", inheritAttrs: false});

const props = defineProps<LinkRootProps>();

const emit = defineEmits<{
  press: [event: PressEvent];
}>();

const attrs = useAttrs();
const linkRef = ref<ComponentPublicInstance | null>(null);
const element = computed(() => (linkRef.value?.$el as Element | null | undefined) ?? null);
const isDisabled = computed(() => props.isDisabled === true);
const isSpan = computed(() => !props.href || isDisabled.value);
// Matches RAC's `!!props['aria-current']`: any truthy value, including the string "false", counts.
const isCurrent = computed(() => Boolean(attrs["aria-current"]));

const slots = computed(() => linkVariants());
const classes = computed(() => cx(slots.value.base(), attrs.class as string | undefined));

const {isHovered} = useHover(element, {isDisabled});
const {isPressed} = usePress(element, {
  isDisabled,
  onPress: (event) => emit("press", event),
});
const {isFocused, isFocusVisible} = useFocusRing(element, {isDisabled});

provide(linkContextKey, {slots});
</script>

<template>
  <Primitive
    ref="linkRef"
    v-bind="$attrs"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :as="as ?? (isSpan ? 'span' : 'a')"
    :as-child="asChild"
    :class="classes"
    :data-current="isCurrent ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'link'"
    :href="isSpan ? undefined : href"
    :role="isSpan ? 'link' : undefined"
    :tabindex="isSpan && !isDisabled ? 0 : undefined"
  >
    <slot />
  </Primitive>
</template>
