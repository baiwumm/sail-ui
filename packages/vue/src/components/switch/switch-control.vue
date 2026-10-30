<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {SwitchControlProps} from "./types";

defineOptions({name: "SailSwitchControl", inheritAttrs: false});

defineProps<SwitchControlProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx("switch__control", className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    :class="classes"
    :data-slot="'switch-control'"
  >
    <slot />
  </span>
</template>
