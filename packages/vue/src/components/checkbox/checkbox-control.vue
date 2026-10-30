<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {CheckboxControlProps} from "./types";

defineOptions({name: "SailCheckboxControl", inheritAttrs: false});

defineProps<CheckboxControlProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx("checkbox__control", className.value));
</script>

<template>
  <span v-bind="forwarded" :class="classes" :data-slot="'checkbox-control'">
    <slot />
  </span>
</template>
