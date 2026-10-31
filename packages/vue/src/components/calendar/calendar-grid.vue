<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import type {DateValue} from "@internationalized/date";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {formatMonthHeading, resolveMonth} from "./calendar-utils";
import {calendarGridContextKey, useCalendarContext} from "./context";
import type {CalendarGridProps} from "./types";

defineOptions({name: "SailCalendarGrid", inheritAttrs: false});

const props = withDefaults(defineProps<CalendarGridProps>(), {
  offset: undefined,
  weekdayStyle: "short",
});

const root = useCalendarContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.grid(), className.value));
const month = computed<DateValue>(
  () => resolveMonth(root.state.grid.value, props.offset)?.value ?? root.state.placeholder.value,
);
const rows = computed<(DateValue | null)[][]>(
  () => resolveMonth(root.state.grid.value, props.offset)?.rows ?? [],
);
const label = computed(() => `${root.label.value}, ${formatMonthHeading(root.state, month.value)}`);
const isMultiselectable = computed(() => root.kind === "range-calendar" || root.isMultiple.value);

provide(calendarGridContextKey, {
  label,
  month,
  rows,
  weekdayStyle: props.weekdayStyle,
});
</script>

<template>
  <table
    v-bind="forwarded"
    :aria-disabled="root.state.disabled.value ? 'true' : undefined"
    :aria-label="label"
    :aria-multiselectable="isMultiselectable ? 'true' : undefined"
    :aria-readonly="root.state.readonly.value ? 'true' : undefined"
    cellpadding="0"
    :class="classes"
    :data-slot="`${root.kind}-grid`"
    role="grid"
  >
    <slot />
  </table>
</template>
