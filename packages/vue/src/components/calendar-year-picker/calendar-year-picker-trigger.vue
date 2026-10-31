<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx, calendarYearPickerVariants} from "@sail-ui/styles";
import {computed, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {calendarYearPickerTriggerContextKey, useCalendarContext} from "../calendar/context";

defineOptions({name: "SailCalendarYearPickerTrigger", inheritAttrs: false});

const root = useCalendarContext();
const {attrs, className, forwarded} = useForwardedAttrs();

const slots = computed(() => calendarYearPickerVariants());
const classes = computed(() => cx(slots.value.trigger(), className.value));

const buttonRef = ref<HTMLButtonElement | null>(null);
const isOpen = computed(() => root.isYearPickerOpen.value);
const monthYear = computed(() => root.heading.value);
const label = computed(
  () => (attrs["aria-label"] as string | undefined) ?? `${monthYear.value}, year selector`,
);

function toggle() {
  root.setYearPickerOpen(!isOpen.value);
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    root.setYearPickerOpen(false);
  }
}

provide(calendarYearPickerTriggerContextKey, {isOpen, monthYear, toggle});

const {isHovered} = useHover(buttonRef);
const {isPressed} = usePress(buttonRef);
const {isFocused, isFocusVisible} = useFocusRing(buttonRef);
</script>

<template>
  <button
    v-bind="forwarded"
    ref="buttonRef"
    :aria-expanded="isOpen ? 'true' : 'false'"
    :aria-label="label"
    :class="classes"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-open="isOpen ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'calendar-year-picker-trigger'"
    :type="'button'"
    @click="toggle"
    @keydown="handleKeyDown"
  >
    <slot :is-open="isOpen" :month-year="monthYear" :toggle="toggle" />
  </button>
</template>
