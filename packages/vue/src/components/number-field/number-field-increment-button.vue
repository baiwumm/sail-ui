<script setup lang="ts">
import {cx, numberFieldVariants} from "@sail-ui/styles";
import {NumberFieldIncrement} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {PlusIcon} from "../../shared/icons";
import type {NumberFieldButtonProps} from "./types";

defineOptions({name: "SailNumberFieldIncrementButton", inheritAttrs: false});

defineProps<NumberFieldButtonProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(numberFieldVariants().incrementButton(), className.value));
</script>

<template>
  <NumberFieldIncrement
    v-bind="{...forwarded, slot: 'increment'}"
    :class="classes"
    :data-slot="'number-field-increment-button'"
  >
    <slot>
      <PlusIcon data-slot="number-field-increment-button-icon" />
    </slot>
  </NumberFieldIncrement>
</template>
