<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {injectDateRangePickerRootContext, injectPopoverRootContext} from "reka-ui";
import {computed, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {resolveElement} from "../../shared/element";
import {useDateRangePickerContext} from "./context";
import type {DateRangePickerTriggerProps} from "./types";

defineOptions({name: "SailDateRangePickerTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<DateRangePickerTriggerProps>(), {
  isDisabled: false,
});

const {className, forwarded} = useForwardedAttrs();
const context = useDateRangePickerContext();
const picker = injectDateRangePickerRootContext();
const rootContext = injectPopoverRootContext();
const generatedTriggerId = useId();
const generatedContentId = useId();

rootContext.triggerId ||= generatedTriggerId;
rootContext.contentId ||= generatedContentId;

const triggerRef = ref<HTMLElement | null>(null);
const isDisabled = computed(() => props.isDisabled || picker.disabled.value);
const isOpen = computed(() => context.overlay.isOpen.value);

const {isFocused, isFocusVisible} = useFocusRing(triggerRef, {isDisabled});
const {isHovered} = useHover(triggerRef, {isDisabled});
const classes = computed(() => cx(context.slots.value.trigger(), className.value));

function setTriggerRef(element: unknown) {
  const resolved = resolveElement(element);

  triggerRef.value = resolved;
  context.triggerRef.value = resolved;
  rootContext.triggerElement.value = resolved ?? undefined;
}

function toggle() {
  if (isDisabled.value) {
    return;
  }

  context.overlay.setOpen(!isOpen.value);
}
</script>

<template>
  <button
    :id="rootContext.triggerId"
    :ref="setTriggerRef"
    v-bind="forwarded"
    aria-haspopup="dialog"
    :aria-controls="isOpen ? rootContext.contentId : undefined"
    :aria-expanded="isOpen"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-slot="'date-range-picker-trigger'"
    :disabled="isDisabled"
    type="button"
    @click="toggle"
  >
    <slot />
  </button>
</template>
