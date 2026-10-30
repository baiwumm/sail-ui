<script setup lang="ts">
import {useFocusRing} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {injectTooltipRootContext} from "reka-ui";
import {computed, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {resolveElement} from "../../shared/element";
import {useTooltipContext} from "./context";
import type {TooltipTriggerProps} from "./types";

defineOptions({name: "SailTooltipTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<TooltipTriggerProps>(), {
  isDisabled: false,
});

const {forwarded, className} = useForwardedAttrs();
const {
  slots,
  triggerRef,
  isOpen,
  isDisabled: isRootDisabled,
  triggerMode,
  scheduleOpen,
  scheduleClose,
  cancelScheduled,
  openNow,
} = useTooltipContext();
const rootContext = injectTooltipRootContext();
const generatedContentId = useId();
const isDisabled = computed(() => props.isDisabled || isRootDisabled.value);

rootContext.contentId ||= generatedContentId;

const {isFocusVisible} = useFocusRing(triggerRef, {isDisabled});

const classes = computed(() => cx(slots.value.trigger(), className.value));

function setTriggerRef(element: unknown) {
  const resolved = resolveElement(element);

  triggerRef.value = resolved;
  rootContext.onTriggerChange(resolved ?? undefined);
}

function handlePointerEnter() {
  if (isDisabled.value || triggerMode.value !== "hover") {
    return;
  }

  if (isOpen.value) {
    cancelScheduled();
    return;
  }

  scheduleOpen();
}

function handlePointerLeave() {
  if (isDisabled.value || triggerMode.value !== "hover") {
    return;
  }

  if (isOpen.value) {
    scheduleClose();
    return;
  }

  cancelScheduled();
}

function handleFocus() {
  if (isDisabled.value) {
    return;
  }

  openNow();
}

function handleBlur() {
  if (isDisabled.value) {
    return;
  }

  scheduleClose();
}
</script>

<template>
  <div
    :ref="setTriggerRef"
    v-bind="forwarded"
    :aria-describedby="isOpen ? rootContext.contentId : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :class="classes"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    data-grace-area-trigger=""
    :data-slot="'tooltip-trigger'"
    :tabindex="isDisabled ? -1 : 0"
    role="button"
    @blur="handleBlur"
    @focus="handleFocus"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <slot />
  </div>
</template>
