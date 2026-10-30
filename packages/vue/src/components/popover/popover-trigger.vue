<script setup lang="ts">
import {useFocusRing, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {injectPopoverRootContext} from "reka-ui";
import {computed, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {resolveElement} from "../../shared/element";
import {usePopoverContext} from "./context";
import type {PopoverTriggerProps} from "./types";

defineOptions({name: "SailPopoverTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<PopoverTriggerProps>(), {
  isDisabled: false,
});

const {forwarded, className} = useForwardedAttrs();
const {slots, triggerRef, isOpen, open, close} = usePopoverContext();
const rootContext = injectPopoverRootContext();
const generatedTriggerId = useId();
const generatedContentId = useId();
const isDisabled = computed(() => props.isDisabled);

rootContext.triggerId ||= generatedTriggerId;
rootContext.contentId ||= generatedContentId;

const {isFocusVisible} = useFocusRing(triggerRef, {isDisabled});

usePress(triggerRef, {
  isDisabled,
  onPress: (event) => {
    if (event.pointerType === "keyboard") {
      toggle();
    }
  },
});

const classes = computed(() => cx(slots.value.trigger(), className.value));

function setTriggerRef(element: unknown) {
  const resolved = resolveElement(element);

  triggerRef.value = resolved;
  rootContext.triggerElement.value = resolved ?? undefined;
}

function toggle() {
  if (isDisabled.value) {
    return;
  }

  if (isOpen.value) {
    close();
  } else {
    open();
  }
}
</script>

<template>
  <div
    :id="rootContext.triggerId"
    :ref="setTriggerRef"
    v-bind="forwarded"
    aria-haspopup="dialog"
    :aria-controls="isOpen ? rootContext.contentId : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-expanded="isOpen"
    :class="classes"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-slot="'popover-trigger'"
    :tabindex="isDisabled ? -1 : 0"
    role="button"
    @click="toggle"
  >
    <slot />
  </div>
</template>
