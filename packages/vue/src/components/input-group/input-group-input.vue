<script setup lang="ts">
import {cx, inputGroupVariants} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {inputGroupContextKey, type InputGroupInputProps} from "./types";

defineOptions({name: "SailInputGroupInput", inheritAttrs: false});

defineProps<InputGroupInputProps>();

const model = defineModel<string>();
const context = inject(inputGroupContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(inputGroupVariants().input(), className.value));
</script>

<template>
  <input
    v-bind="forwarded"
    :class="classes"
    :data-slot="'input-group-input'"
    :disabled="context?.isDisabled.value"
    :value="model"
    @input="model = ($event.target as HTMLInputElement).value"
  />
</template>
