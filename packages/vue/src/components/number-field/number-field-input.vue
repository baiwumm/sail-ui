<script setup lang="ts">
import {cx, numberFieldVariants} from "@sail-ui/styles";
import {NumberFieldInput} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {numberFieldContextKey, type NumberFieldInputProps} from "./types";

defineOptions({name: "SailNumberFieldInput", inheritAttrs: false});

defineProps<NumberFieldInputProps>();

const {className, forwarded} = useForwardedAttrs();
const context = inject(numberFieldContextKey, null);

const classes = computed(() => cx(numberFieldVariants().input(), className.value));
</script>

<template>
  <NumberFieldInput
    v-bind="forwarded"
    :aria-labelledby="context?.labelId"
    :class="classes"
    :data-slot="'number-field-input'"
  />
</template>
