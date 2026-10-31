<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {CalendarIcon} from "../../shared/icons";
import {useDateRangePickerContext} from "./context";
import type {DateRangePickerTriggerIndicatorProps} from "./types";

defineOptions({name: "SailDateRangePickerTriggerIndicator", inheritAttrs: false});

defineProps<DateRangePickerTriggerIndicatorProps>();

const {className, forwarded} = useForwardedAttrs();
const context = useDateRangePickerContext();

const classes = computed(() => cx(context.slots.value.triggerIndicator(), className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-slot="'date-range-picker-trigger-indicator'"
  >
    <slot>
      <CalendarIcon />
    </slot>
  </span>
</template>
