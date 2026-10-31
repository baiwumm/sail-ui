<script setup lang="ts">
import {useFocusRing, useHover, usePress, type PressEvent} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useAccordionContext, useAccordionItemContext} from "./context";

defineOptions({name: "SailAccordionTrigger", inheritAttrs: false});

const emit = defineEmits<{
  press: [event: PressEvent];
}>();

const root = useAccordionContext();
const item = useAccordionItemContext();
const {className, forwarded} = useForwardedAttrs();

const triggerRef = ref<HTMLButtonElement | null>(null);
const isDisabled = computed(() => item.isDisabled.value);

const {isHovered} = useHover(triggerRef, {isDisabled});
const {isPressed} = usePress(triggerRef, {
  isDisabled,
  onPress: (event) => emit("press", event),
});
const {isFocused, isFocusVisible} = useFocusRing(triggerRef, {isDisabled});

const classes = computed(() => cx(root.slots.value.trigger(), className.value));

function handleClick() {
  item.toggle();
}
</script>

<template>
  <button
    v-bind="forwarded"
    :id="item.triggerId"
    ref="triggerRef"
    :aria-controls="item.panelId"
    :aria-expanded="item.isExpanded.value ? 'true' : 'false'"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-reka-collection-item="''"
    :data-slot="'accordion-trigger'"
    :data-state="item.isExpanded.value ? 'open' : 'closed'"
    :disabled="isDisabled || undefined"
    type="button"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
