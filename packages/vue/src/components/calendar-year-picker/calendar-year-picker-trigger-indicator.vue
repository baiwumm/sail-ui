<script setup lang="ts">
import {cx, calendarYearPickerVariants} from "@sail-ui/styles";
import {computed} from "vue";

import {ChevronRightIcon} from "../../shared/icons";
import {useForwardedAttrs} from "../../shared/attrs";
import {useCalendarYearPickerTriggerContext} from "../calendar/context";

defineOptions({name: "SailCalendarYearPickerTriggerIndicator", inheritAttrs: false});

const trigger = useCalendarYearPickerTriggerContext();
const {className, forwarded} = useForwardedAttrs();

const slots = computed(() => calendarYearPickerVariants());
const classes = computed(() => cx(slots.value.triggerIndicator(), className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    :aria-hidden="'true'"
    :class="classes"
    :data-slot="'calendar-year-picker-trigger-indicator'"
  >
    <slot
      :is-open="trigger.isOpen.value"
      :month-year="trigger.monthYear.value"
      :toggle="trigger.toggle"
    >
      <ChevronRightIcon height="1em" width="1em" />
    </slot>
  </span>
</template>
