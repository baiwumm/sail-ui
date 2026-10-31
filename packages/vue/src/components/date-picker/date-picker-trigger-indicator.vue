<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {CalendarIcon} from "../../shared/icons";
import {useDatePickerContext} from "./context";
import type {DatePickerTriggerIndicatorProps} from "./types";

defineOptions({name: "SailDatePickerTriggerIndicator", inheritAttrs: false});

defineProps<DatePickerTriggerIndicatorProps>();

const {className, forwarded} = useForwardedAttrs();
const context = useDatePickerContext();

const classes = computed(() => cx(context.slots.value.triggerIndicator(), className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-slot="'date-picker-trigger-indicator'"
  >
    <slot>
      <CalendarIcon />
    </slot>
  </span>
</template>
