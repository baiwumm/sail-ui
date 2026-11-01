<script setup lang="ts">
import {getLocalTimeZone, type DateValue} from "@internationalized/date";

const selected = ref<DateValue>();

const label = computed(() =>
  selected.value ? selected.value.toDate(getLocalTimeZone()).toDateString() : "No date picked",
);
</script>

<template>
  <div class="docs-demo docs-demo-stack">
    <SCalendar v-model="selected" aria-label="Appointment date" />
    <p class="text-sm">{{ label }}</p>
  </div>
</template>
