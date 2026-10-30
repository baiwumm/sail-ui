<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {SwitchIconProps} from "./types";

defineOptions({name: "SailSwitchIcon", inheritAttrs: false});

defineProps<SwitchIconProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx("switch__icon", className.value));
</script>

<template>
  <span v-bind="forwarded" :class="classes" :data-slot="'switch-icon'">
    <slot />
  </span>
</template>
