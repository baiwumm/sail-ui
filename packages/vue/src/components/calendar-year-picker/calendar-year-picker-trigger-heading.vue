<script setup lang="ts">
import {cx, calendarYearPickerVariants} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {resolveHeading} from "../calendar/calendar-utils";
import type {CalendarYearPickerTriggerHeadingProps} from "../calendar/types";
import {useCalendarContext, useCalendarYearPickerTriggerContext} from "../calendar/context";

defineOptions({name: "SailCalendarYearPickerTriggerHeading", inheritAttrs: false});

const props = withDefaults(defineProps<CalendarYearPickerTriggerHeadingProps>(), {
  format: undefined,
  offset: undefined,
});

const root = useCalendarContext();
const trigger = useCalendarYearPickerTriggerContext();
const {className, forwarded} = useForwardedAttrs();

const slots = computed(() => calendarYearPickerVariants());
const classes = computed(() => cx(slots.value.triggerHeading(), className.value));
const heading = computed(() => resolveHeading(root.state, props.offset, props.format));
</script>

<template>
  <span v-bind="forwarded" :class="classes" :data-slot="'calendar-year-picker-trigger-heading'">
    <slot
      :is-open="trigger.isOpen.value"
      :month-year="trigger.monthYear.value"
      :toggle="trigger.toggle"
    >
      {{ heading }}
    </slot>
  </span>
</template>
