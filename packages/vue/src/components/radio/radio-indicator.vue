<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {RadioIndicatorProps} from "./types";

defineOptions({name: "SailRadioIndicator", inheritAttrs: false});

defineProps<RadioIndicatorProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx("radio__indicator", className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-slot="'radio-indicator'"
  >
    <slot />
  </span>
</template>
