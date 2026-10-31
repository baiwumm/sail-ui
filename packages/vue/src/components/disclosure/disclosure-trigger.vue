<script setup lang="ts">
import {useFocusRing, useHover, usePress, type PressEvent} from "@sail-ui/primitives";
import {disclosureVariants, cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDisclosureContext} from "./context";

defineOptions({name: "SailDisclosureTrigger", inheritAttrs: false});

const emit = defineEmits<{
  press: [event: PressEvent];
}>();

const disclosure = useDisclosureContext();
const {className, forwarded} = useForwardedAttrs();

const triggerRef = ref<HTMLButtonElement | null>(null);
const isDisabled = computed(() => disclosure.isDisabled.value);

const {isHovered} = useHover(triggerRef, {isDisabled});
const {isPressed} = usePress(triggerRef, {
  isDisabled,
  onPress: (event) => emit("press", event),
});
const {isFocused, isFocusVisible} = useFocusRing(triggerRef, {isDisabled});

const classes = computed(() => cx(disclosureVariants().trigger(), className.value));

function handleClick() {
  disclosure.toggle();
}
</script>

<template>
  <button
    v-bind="forwarded"
    :id="disclosure.triggerId"
    ref="triggerRef"
    :aria-controls="disclosure.contentId"
    :aria-expanded="disclosure.isExpanded.value ? 'true' : 'false'"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'disclosure-trigger'"
    :data-state="disclosure.isExpanded.value ? 'open' : 'closed'"
    :disabled="isDisabled || undefined"
    type="button"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
