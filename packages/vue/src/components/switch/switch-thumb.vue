<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {SwitchThumbProps} from "./types";

defineOptions({name: "SailSwitchThumb", inheritAttrs: false});

defineProps<SwitchThumbProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx("switch__thumb", className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    :class="classes"
    :data-slot="'switch-thumb'"
  >
    <slot />
  </span>
</template>
