<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {getLocalTimeZone, isSameDay, isSameMonth, isToday} from "@internationalized/date";
import {cx} from "@sail-ui/styles";
import {CalendarCellTrigger} from "reka-ui";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {formatDay} from "./calendar-utils";
import {useCalendarContext, useCalendarGridContext} from "./context";
import type {CalendarCellProps} from "./types";

defineOptions({name: "SailCalendarCell", inheritAttrs: false});

const props = defineProps<CalendarCellProps>();

const root = useCalendarContext();
const grid = useCalendarGridContext();
const state = root.state;
const {className, forwarded} = useForwardedAttrs();

const triggerRef = ref<HTMLElement | null>(null);

const isOutsideMonth = computed(() => !isSameMonth(props.date, grid.month.value));
const isOutsideVisibleRange = computed(() => state.isOutsideVisibleView(props.date));
const isDisabled = computed(() => state.isDateDisabled(props.date) || isOutsideMonth.value);
const isUnavailable = computed(() => state.isDateUnavailable?.(props.date) ?? false);
const isSelectable = computed(() => !isDisabled.value && !isUnavailable.value);
const isSelected = computed(() => isSelectable.value && state.isDateSelected(props.date));
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
    <CalendarCellTrigger as-child :day="date" :month="grid.month.value">
      <div
        v-bind="forwarded"
        ref="triggerRef"
        :class="classes"
        :data-disabled="isDisabled ? 'true' : undefined"
        :data-focus-visible="isFocusVisible ? 'true' : undefined"
        :data-focused="isFocused ? 'true' : undefined"
        :data-hovered="isHovered ? 'true' : undefined"
        :data-outside-month="isOutsideMonth ? 'true' : undefined"
        :data-outside-visible-range="isOutsideVisibleRange ? 'true' : undefined"
        :data-pressed="isPressed ? 'true' : undefined"
        :data-selected="isSelected ? 'true' : undefined"
        :data-slot="`${root.kind}-cell`"
        :data-today="isCurrentDay ? 'true' : undefined"
        :data-unavailable="isUnavailable ? 'true' : undefined"
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
      </div>
    </CalendarCellTrigger>
  </td>
</template>
