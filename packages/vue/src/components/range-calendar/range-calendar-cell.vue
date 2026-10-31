<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {getLocalTimeZone, isSameDay, isSameMonth, isToday} from "@internationalized/date";
import {cx} from "@sail-ui/styles";
import {RangeCalendarCellTrigger} from "reka-ui";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {formatDay} from "../calendar/calendar-utils";
import {useCalendarContext, useCalendarGridContext} from "../calendar/context";
import type {CalendarCellProps} from "../calendar/types";

// Upstream renders this wrapper with a literal class instead of a `tv()` slot.
const cellButtonClassName = "range-calendar__cell-button";

defineOptions({name: "SailRangeCalendarCell", inheritAttrs: false});

const props = defineProps<CalendarCellProps>();

const root = useCalendarContext();
const grid = useCalendarGridContext();
const range = root.rangeState;

if (!range) {
  throw new Error("RangeCalendarCell must be used inside <RangeCalendar>.");
}

const state = root.state;
const {className, forwarded} = useForwardedAttrs();

const triggerRef = ref<HTMLElement | null>(null);

const highlightedRange = computed(() => range.highlightedRange.value);
const isHighlighted = computed(() => {
  const highlighted = highlightedRange.value;

  if (!highlighted) {
    return false;
  }

  return props.date.compare(highlighted.start) >= 0 && props.date.compare(highlighted.end) <= 0;
});

const isOutsideMonth = computed(() => !isSameMonth(props.date, grid.month.value));
const isOutsideVisibleRange = computed(() => state.isOutsideVisibleView(props.date));
const isDisabled = computed(() => state.isDateDisabled(props.date) || isOutsideMonth.value);
const isUnavailable = computed(() => state.isDateUnavailable?.(props.date) ?? false);
const isSelectable = computed(() => !isDisabled.value && !isUnavailable.value);
const isSelected = computed(
  () => isSelectable.value && (range.isSelected(props.date) || isHighlighted.value),
);
const isSelectionStart = computed(() => {
  const highlighted = highlightedRange.value;

  return highlighted
    ? isSameDay(props.date, highlighted.start)
    : range.isSelectionStart(props.date);
});
const isSelectionEnd = computed(() => {
  const highlighted = highlightedRange.value;

  return highlighted ? isSameDay(props.date, highlighted.end) : range.isSelectionEnd(props.date);
});
const isFocused = computed(
  () =>
    !isOutsideMonth.value && isSelectable.value && isSameDay(state.placeholder.value, props.date),
);
const isCurrentDay = computed(() => isToday(props.date, getLocalTimeZone()));
const formattedDate = computed(() => formatDay(state, props.date));
const classes = computed(() => cx(root.slots.cell(), className.value));

const {isHovered} = useHover(triggerRef, {isDisabled});
const {isPressed} = usePress(triggerRef, {isDisabled});
const {isFocusVisible} = useFocusRing(triggerRef, {isDisabled});
</script>

<template>
  <td
    :aria-disabled="isSelectable ? undefined : 'true'"
    :aria-selected="isSelected ? 'true' : undefined"
    role="gridcell"
  >
    <RangeCalendarCellTrigger as-child :day="date" :month="grid.month.value">
      <div
        v-bind="forwarded"
        ref="triggerRef"
        :aria-pressed="undefined"
        :class="classes"
        :data-disabled="isDisabled ? 'true' : undefined"
        :data-focus-visible="isFocusVisible ? 'true' : undefined"
        :data-focused="isFocused ? 'true' : undefined"
        :data-hovered="isHovered ? 'true' : undefined"
        :data-outside-month="isOutsideMonth ? 'true' : undefined"
        :data-outside-visible-range="isOutsideVisibleRange ? 'true' : undefined"
        :data-pressed="isPressed ? 'true' : undefined"
        :data-selected="isSelected ? 'true' : undefined"
        :data-selection-end="isSelectionEnd ? 'true' : undefined"
        :data-selection-start="isSelectionStart ? 'true' : undefined"
        :data-slot="`${root.kind}-cell`"
        :data-today="isCurrentDay ? 'true' : undefined"
        :data-unavailable="isUnavailable ? 'true' : undefined"
      >
        <span
          :class="cellButtonClassName"
          :data-disabled="isDisabled ? 'true' : undefined"
          :data-hovered="isHovered ? 'true' : undefined"
          :data-pressed="isPressed ? 'true' : undefined"
          :data-selected="isSelectionStart || isSelectionEnd ? 'true' : undefined"
          :data-slot="`${root.kind}-cell-button`"
        >
          <slot
            :formatted-date="formattedDate"
            :is-disabled="isDisabled"
            :is-outside-month="isOutsideMonth"
            :is-selected="isSelected"
            :is-today="isCurrentDay"
          >
            {{ formattedDate }}
          </slot>
        </span>
      </div>
    </RangeCalendarCellTrigger>
  </td>
</template>
