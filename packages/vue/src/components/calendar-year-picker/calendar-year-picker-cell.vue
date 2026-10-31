<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx, calendarYearPickerVariants} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useCalendarYearPickerGridContext} from "../calendar/context";
import type {CalendarYearPickerCellProps} from "../calendar/types";

defineOptions({name: "SailCalendarYearPickerCell", inheritAttrs: false});

const props = withDefaults(defineProps<CalendarYearPickerCellProps>(), {
  // An explicit undefined default keeps Vue from casting an absent Boolean prop
  // to false, so the open+active fallback can still apply.
  excludeFromTabOrder: undefined,
});

const grid = useCalendarYearPickerGridContext();
const {className, forwarded} = useForwardedAttrs();

const cellRef = ref<HTMLButtonElement | null>(null);

const slots = computed(() => calendarYearPickerVariants());
const classes = computed(() => cx(slots.value.yearCell(), className.value));
const item = computed(() => grid.items.value.find((entry) => entry.year === props.year));
const formattedYear = computed(() => item.value?.formatted ?? String(props.year));
const isSelected = computed(() => props.year === grid.focusedYear.value);
const isActive = computed(() => props.year === grid.activeYear.value);
const isOpen = computed(() => grid.isOpen.value);
const isCurrentYear = computed(() => props.year === grid.currentYear);
const tabIndex = computed(() =>
  (props.excludeFromTabOrder ?? !(isOpen.value && isActive.value)) ? -1 : 0,
);

function select() {
  grid.selectYear(props.year);
}

const {isHovered} = useHover(cellRef);
const {isPressed} = usePress(cellRef);
const {isFocused, isFocusVisible} = useFocusRing(cellRef);
</script>

<template>
  <button
    v-bind="forwarded"
    ref="cellRef"
    :aria-label="formattedYear"
    :class="classes"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-selected="isSelected ? 'true' : undefined"
    :data-slot="'calendar-year-picker-year-cell'"
    :data-year="year"
    :tabindex="tabIndex"
    :type="'button'"
    @click="select"
    @focus="grid.setActiveYear(year)"
  >
    <slot
      :formatted-year="formattedYear"
      :is-current-year="isCurrentYear"
      :is-open="isOpen"
      :is-selected="isSelected"
      :select-year="select"
      :year="year"
    >
      {{ formattedYear }}
    </slot>
  </button>
</template>
