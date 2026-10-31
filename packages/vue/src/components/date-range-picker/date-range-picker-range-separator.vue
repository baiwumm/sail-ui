<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDateRangePickerContext} from "./context";
import type {DateRangePickerRangeSeparatorProps} from "./types";

defineOptions({name: "SailDateRangePickerRangeSeparator", inheritAttrs: false});

defineProps<DateRangePickerRangeSeparatorProps>();

const {className, forwarded} = useForwardedAttrs();
const context = useDateRangePickerContext();

const classes = computed(() => cx(context.slots.value.rangeSeparator(), className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-slot="'date-range-picker-range-separator'"
  >
    <slot> - </slot>
  </span>
</template>
