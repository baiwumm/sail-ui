<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {checkboxContextKey, type CheckboxIndicatorProps} from "./types";

defineOptions({name: "SailCheckboxIndicator", inheritAttrs: false});

defineProps<CheckboxIndicatorProps>();

const context = inject(checkboxContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const isSelected = computed(() => context?.isSelected.value ?? false);
const isIndeterminate = computed(() => context?.isIndeterminate.value ?? false);

const classes = computed(() => cx("checkbox__indicator", className.value));
</script>

<template>
  <span v-bind="forwarded" aria-hidden="true" :class="classes" :data-slot="'checkbox-indicator'">
    <slot>
      <svg
        aria-hidden="true"
        data-slot="checkbox-default-indicator--checkmark"
        fill="none"
        role="presentation"
        stroke="currentColor"
        stroke-dasharray="22"
        :stroke-dashoffset="isSelected ? 44 : 66"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 17 18"
      >
        <polyline points="1 9 7 14 15 4" />
      </svg>
      <svg
        v-if="isIndeterminate"
        aria-hidden="true"
        data-slot="checkbox-default-indicator--indeterminate"
        fill="none"
        role="presentation"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="3"
        viewBox="0 0 24 24"
      >
        <line x1="21" x2="3" y1="12" y2="12" />
      </svg>
    </slot>
  </span>
</template>
