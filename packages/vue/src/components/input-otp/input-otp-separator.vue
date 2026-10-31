<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {inputOtpContextKey} from "./context";
import type {InputOtpSeparatorProps} from "./types";

defineOptions({name: "SailInputOtpSeparator", inheritAttrs: false});

defineProps<InputOtpSeparatorProps>();

const {className, forwarded} = useForwardedAttrs();
const context = inject(inputOtpContextKey, null);
const classes = computed(() => cx(context?.slots.value.separator(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" data-slot="input-otp-separator">
    <slot />
  </div>
</template>
