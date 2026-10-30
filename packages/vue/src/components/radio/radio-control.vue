<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {RadioControlProps} from "./types";

defineOptions({name: "SailRadioControl", inheritAttrs: false});

defineProps<RadioControlProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx("radio__control", className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    :class="classes"
    :data-slot="'radio-control'"
  >
    <slot />
  </span>
</template>
