<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useCalendarContext} from "./context";
import type {CalendarCellIndicatorProps} from "./types";

defineOptions({name: "SailCalendarCellIndicator", inheritAttrs: false});

defineProps<CalendarCellIndicatorProps>();

const root = useCalendarContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.cellIndicator(), className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    :aria-hidden="'true'"
    :class="classes"
    :data-slot="`${root.kind}-cell-indicator`"
  />
</template>
