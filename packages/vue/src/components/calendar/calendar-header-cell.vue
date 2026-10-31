<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useCalendarContext} from "./context";
import type {CalendarHeaderCellProps} from "./types";

defineOptions({name: "SailCalendarHeaderCell", inheritAttrs: false});

defineProps<CalendarHeaderCellProps>();

const root = useCalendarContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.headerCell(), className.value));
</script>

<template>
  <th v-bind="forwarded" :class="classes" :data-slot="`${root.kind}-header-cell`">
    <slot />
  </th>
</template>
