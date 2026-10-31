<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useCalendarContext, useCalendarGridContext} from "./context";
import type {CalendarGridBodyProps} from "./types";

defineOptions({name: "SailCalendarGridBody", inheritAttrs: false});

defineProps<CalendarGridBodyProps>();

const root = useCalendarContext();
const grid = useCalendarGridContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.gridBody(), className.value));
</script>

<template>
  <tbody v-bind="forwarded" :class="classes" :data-slot="`${root.kind}-grid-body`">
    <tr v-for="(week, weekIndex) in grid.rows.value" :key="weekIndex">
      <template v-for="(date, dayIndex) in week" :key="dayIndex">
        <slot v-if="date" :date="date" :day-index="dayIndex" :week-index="weekIndex">
          <component :is="root.cellComponent" :date="date" />
        </slot>
        <td v-else />
      </template>
    </tr>
  </tbody>
</template>
