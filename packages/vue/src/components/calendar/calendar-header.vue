<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useCalendarContext} from "./context";
import type {CalendarHeaderProps} from "./types";

defineOptions({name: "SailCalendarHeader", inheritAttrs: false});

defineProps<CalendarHeaderProps>();

const root = useCalendarContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.header(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="`${root.kind}-header`">
    <slot />
  </div>
</template>
