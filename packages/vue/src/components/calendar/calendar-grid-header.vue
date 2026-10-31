<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import CalendarHeaderCell from "./calendar-header-cell.vue";
import {getWeekdayLabels} from "./calendar-utils";
import {useCalendarContext, useCalendarGridContext} from "./context";
import type {CalendarGridHeaderProps} from "./types";

defineOptions({name: "SailCalendarGridHeader", inheritAttrs: false});

defineProps<CalendarGridHeaderProps>();

const root = useCalendarContext();
const grid = useCalendarGridContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.gridHeader(), className.value));
const days = computed(() => getWeekdayLabels(root.state, grid.rows.value, grid.weekdayStyle));
</script>

<template>
  <thead
    v-bind="forwarded"
    :aria-hidden="'true'"
    :class="classes"
    :data-slot="`${root.kind}-grid-header`"
  >
    <tr>
      <template v-for="(day, index) in days" :key="index">
        <slot :day="day" :index="index">
          <CalendarHeaderCell>{{ day }}</CalendarHeaderCell>
        </slot>
      </template>
    </tr>
  </thead>
</template>
