<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {inputOtpContextKey} from "./context";
import type {InputOtpGroupProps} from "./types";

defineOptions({name: "SailInputOtpGroup", inheritAttrs: false});

defineProps<InputOtpGroupProps>();

const {className, forwarded} = useForwardedAttrs();
const context = inject(inputOtpContextKey, null);
const classes = computed(() => cx(context?.slots.value.group(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" data-slot="input-otp-group">
    <slot />
  </div>
</template>
