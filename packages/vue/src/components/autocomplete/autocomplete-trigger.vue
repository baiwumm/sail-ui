<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {injectComboboxRootContext} from "reka-ui";
import {computed, onMounted, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useAutocompleteContext} from "./context";
import type {AutocompleteTriggerProps} from "./types";

defineOptions({name: "SailAutocompleteTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<AutocompleteTriggerProps>(), {
  isDisabled: false,
});

const context = useAutocompleteContext();
const rootContext = injectComboboxRootContext();
const {attrs, className, forwarded} = useForwardedAttrs();

// Reka assigns the content id non-reactively from ComboboxContent, so the
// trigger seeds it up front to expose a stable aria-controls target.
const generatedContentId = useId();

rootContext.contentId ||= generatedContentId;
const elementRef = ref<HTMLElement | null>(null);

const isDisabled = computed(() => context.isDisabled.value || props.isDisabled);

const {isHovered} = useHover(elementRef, {isDisabled});
const {isPressed} = usePress(elementRef, {isDisabled});
// Upstream renders the trigger as a focus-within group (the clear button lives
// inside), so a `button` role would nest interactive controls.
const {isFocusVisible} = useFocusRing(elementRef, {isDisabled, within: true});

const classes = computed(() => cx(context.slots.value.trigger(), className.value));
const labelledBy = computed(
  () => (attrs["aria-labelledby"] as string | undefined) ?? context.labelId,
);

onMounted(() => {
  context.triggerRef.value = elementRef.value;

  if (elementRef.value) {
    rootContext.onTriggerElementChange(elementRef.value);
  }
});

function toggle() {
  if (isDisabled.value) {
    return;
  }

  if (context.overlay.isExiting.value) {
    context.overlay.open();
    return;
  }

  if (context.overlay.isMounted.value) {
    context.overlay.close();
  } else {
    rootContext.onOpenChange(true);
  }
}

function handleClick(event: MouseEvent) {
  const target = event.target as Element | null;

  if (target?.closest('[data-slot="autocomplete-clear-button"]')) {
    return;
  }

  toggle();
}

function handleKeydown(event: KeyboardEvent) {
  if (isDisabled.value) {
    return;
  }

  if (event.key === "Escape" && context.overlay.isMounted.value) {
    event.preventDefault();
    toggle();
    return;
  }

  if (
    event.key === "Enter" ||
    event.key === " " ||
    event.key === "ArrowDown" ||
    event.key === "ArrowUp"
  ) {
    event.preventDefault();
    toggle();
  }
}
</script>

<template>
  <div
    ref="elementRef"
    v-bind="forwarded"
    :aria-controls="context.overlay.isMounted.value ? rootContext.contentId : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-expanded="context.overlay.isMounted.value ? 'true' : 'false'"
    :aria-haspopup="'listbox'"
    :aria-labelledby="labelledBy"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'autocomplete-trigger'"
    role="group"
    tabindex="0"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </div>
</template>
