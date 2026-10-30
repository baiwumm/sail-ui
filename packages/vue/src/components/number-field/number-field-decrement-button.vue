<script setup lang="ts">
import {cx, numberFieldVariants} from "@sail-ui/styles";
import {NumberFieldDecrement} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {MinusIcon} from "../../shared/icons";
import type {NumberFieldButtonProps} from "./types";

defineOptions({name: "SailNumberFieldDecrementButton", inheritAttrs: false});

defineProps<NumberFieldButtonProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(numberFieldVariants().decrementButton(), className.value));
</script>

<template>
  <NumberFieldDecrement
    v-bind="{...forwarded, slot: 'decrement'}"
    :class="classes"
    :data-slot="'number-field-decrement-button'"
  >
    <slot>
      <MinusIcon data-slot="number-field-decrement-button-icon" />
    </slot>
  </NumberFieldDecrement>
</template>
