<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {resolveHeading} from "./calendar-utils";
import {useCalendarContext} from "./context";
import type {CalendarHeadingProps} from "./types";

defineOptions({name: "SailCalendarHeading", inheritAttrs: false});

const props = withDefaults(defineProps<CalendarHeadingProps>(), {
  format: undefined,
  offset: undefined,
});

const root = useCalendarContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.heading(), className.value));
const content = computed(() => resolveHeading(root.state, props.offset, props.format));
</script>

<template>
  <h2 v-bind="forwarded" :aria-hidden="'true'" :class="classes" :data-slot="`${root.kind}-heading`">
    <slot>{{ content }}</slot>
  </h2>
</template>
