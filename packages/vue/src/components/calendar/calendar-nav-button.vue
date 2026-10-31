<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {ChevronLeftIcon, ChevronRightIcon} from "../../shared/icons";
import {useForwardedAttrs} from "../../shared/attrs";
import {useCalendarContext} from "./context";
import type {CalendarNavButtonProps} from "./types";

defineOptions({name: "SailCalendarNavButton", inheritAttrs: false});

const props = withDefaults(defineProps<CalendarNavButtonProps>(), {
  page: "previous",
});

const root = useCalendarContext();
const {attrs, className, forwarded} = useForwardedAttrs();

const buttonRef = ref<HTMLButtonElement | null>(null);
const isPrevious = computed(() => props.page === "previous");
const isDisabled = computed(() =>
  isPrevious.value ? root.state.isPrevButtonDisabled() : root.state.isNextButtonDisabled(),
);
const label = computed(
  () => (attrs["aria-label"] as string | undefined) ?? (isPrevious.value ? "Previous" : "Next"),
);
const iconClasses = computed(() => root.slots.navButtonIcon());
const classes = computed(() => cx(root.slots.navButton(), className.value));
// Upstream CSS selects on the literal `slot` attribute, which Vue templates treat
// as the deprecated slot syntax, so it is forwarded through `v-bind` instead.
const buttonAttrs = computed(() => ({...forwarded.value, slot: props.page}));

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isPressed} = usePress(buttonRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(buttonRef, {isDisabled});

function handleClick() {
  if (isDisabled.value) {
    return;
  }

  if (isPrevious.value) {
    root.state.prevPage();
  } else {
    root.state.nextPage();
  }
}
</script>

<template>
  <button
    v-bind="buttonAttrs"
    ref="buttonRef"
    :aria-label="label"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="`${root.kind}-nav-button`"
    :disabled="isDisabled || undefined"
    :type="'button'"
    @click="handleClick"
  >
    <slot>
      <ChevronLeftIcon
        v-if="isPrevious"
        :class="iconClasses"
        :data-slot="`${root.kind}-nav-button-icon`"
      />
      <ChevronRightIcon v-else :class="iconClasses" :data-slot="`${root.kind}-nav-button-icon`" />
    </slot>
  </button>
</template>
